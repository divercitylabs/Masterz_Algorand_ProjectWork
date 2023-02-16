'reach 0.1';

export const main = Reach.App(() => {
  const Owner = Participant('Owner', {
    getCampaign: Fun([], Object({
      ownerAddr: Address,
      title: Bytes(128),
      description: Bytes(256),
      target: UInt,
      deadline: UInt,
    })),  
    campaignReady: Fun([], Null),
  });

  const Funder = API('Funder', {
    donateToCampaign: Fun([UInt], Bool),
    refund: Fun([], Bool),
  });

  const Observer = API('Observer', {
    timesUp: Fun([], Bool),
    getOutcome: Fun([], Bool),
  });

  init();

  Owner.only(() => {
    const {
      ownerAddr, 
      title,
      description,
      target,
      deadline,
     } = declassify(interact.getCampaign());
  });

  Owner.publish(ownerAddr, title, description, target, deadline);
  commit();
  Owner.publish();
  Owner.interact.campaignReady();

  const funders = new Map(Address, UInt);
  const fundersSet = new Set();

  const end = lastConsensusTime() + deadline;
  const [
    keepGoing,
    campaignBalance,
    numFunders,
  ] = parallelReduce([true, 0, 0])
  .define(() => {
    const checkDonateToCampaign = (who, amt) => {
      check(amt > 0, 'Donation must be greater than 0');
      check(!fundersSet.member(who), 'You have already donated to this campaign');
      return () => {
        funders[who] = amt;
        fundersSet.insert(who);
        return [keepGoing, campaignBalance + amt, numFunders + 1];
      };
    };
  })
  .invariant(balance() >= campaignBalance)
  .invariant(fundersSet.Map.size() == numFunders)
  .while(keepGoing)
  .api(Funder.donateToCampaign,
    (payment) => { const _ = checkDonateToCampaign(this, payment); },
    (payment) => payment,
    (payment, k) => {
      
      k(true);
      
      return checkDonateToCampaign(this, payment)();
    }
  )
  .timeout(absoluteTime(end), () => {
    const [ [], k ] = call(Observer.timesUp);
    k(true);
    return [ false, campaignBalance, numFunders ];
  });

  assert( campaignBalance <= balance(), 'Campaign balance cannot exceed contract balance' );

  const outcome = campaignBalance >= target;
  commit();

  const [ [], u ] = call(Observer.getOutcome);
  u(outcome);

  if(outcome){
    transfer(balance()).to(Owner);
    commit();
    exit();
  }


  assert(outcome == false);

  const [
    fundsRemaining,
    numFundersRemaining
  ] = parallelReduce([campaignBalance, numFunders])
  .define(() => {
    const checkPayMeBack = (who) => {
      check(fundersSet.member(who), 'You have not donated to this campaign');
      check(!isNone(funders[who]), 'You have already been refunded');
      check(funders[who] != 0, 'You have already been refunded');
      
      const amt = fromSome(funders[who], 0);
      check(amt != 0, 'You have already been refunded');
      check(amt <= balance(), 'Contract balance is too low to refund you');

      return () => {
        transfer(amt).to(who);
        
        funders[who] = 0;
        delete funders[who];
        fundersSet.remove(who);
        return [fundsRemaining - amt, numFundersRemaining - 1];
      };
    };
  })
  .invariant(balance() >= fundsRemaining)
  .invariant(fundersSet.Map.size() == numFundersRemaining)
  .while(numFundersRemaining > 0 && fundsRemaining > 0)
  .api(Funder.refund,
    () => { const _ = checkPayMeBack(this); },
    () => 0,
    (k) => {
      k(true);
      return checkPayMeBack(this)();
    }
  );

  
  transfer(balance()).to(Owner);
  commit();
  exit();


});
