import {loadStdlib} from '@reach-sh/stdlib';
import * as backend from './build/index.main.mjs';


const stdlib = loadStdlib(process.env);
const startingBalance = stdlib.parseCurrency(100);

console.log(`Creating testing account for Owner`)
const accOwner = await stdlib.newTestAccount(startingBalance);

console.log(`Having Owner create a testing campaign`)
const params = {
  ownerAddr: stdlib.formatAddress(accOwner),
  title: 'Titolo di Prova',
  description: 'Descrizione di Prova',
  target: stdlib.parseCurrency(100),
  deadline: 100,
}

const funders = [];
const startFunders = async () => {
  let donationAmt = stdlib.parseCurrency(10);
  
  const runFunder = async (who) => {
    const acc = await stdlib.newTestAccount(startingBalance);
    funders.push([who, acc]);
    const ctc = acc.contract(backend, ctcOwner.getInfo());
    const getBal = async () => stdlib.formatCurrency(await stdlib.balanceOf(acc));

    console.log(`${who} donating ${stdlib.formatCurrency(donationAmt)} to campaign`);
    console.log(`${who} balance before is ${await getBal()}`);

    try{
      await ctc.apis.Funder.donateToCampaign(donationAmt);
      console.log(`${who} donated ${stdlib.formatCurrency(donationAmt)} to campaign`);
    } catch (e){
      console.log(e);
      console.log(`${who} failed to donate because campaign is over`);
    }
    
    console.log(`${who} balance after is ${await getBal()}`);
  };

  const timesup = async () => {
    await ctcOwner.apis.Observer.timesUp();
    console.log('Deadline reached');
  };

  const getoutcome = async () => {
    const outcome = await ctcOwner.apis.Observer.getOutcome();
    console.log(`Fund ${outcome? `did` : `did not`} meet its goal`);
    return outcome;
  };

  const refund = async (outcome) => {
    for (const [who, acc] of funders) {
      const ctcFunder = acc.contract(backend, ctcOwner.getInfo());
      await ctcFunder.apis.Funder.refund();
      if (!outcome)
        console.log(`${who}: ${stdlib.formatAddress(acc)} got their funds back`);
    }
    if (!outcome)
      console.log(`Refund done`);
  };


  await runFunder('Alice');
  await runFunder('Bob');
  await runFunder('Charlie');
  await runFunder('Dave');
  await runFunder('Eve');
  // await runFunder('Frank');
  // await runFunder('Grace');
  // await runFunder('Helen');
  // await runFunder('Ivan');
  // await runFunder('Judy');
  // await runFunder('Karl');
  // await runFunder('Linda');
  

  console.log(`Waiting for the fund to reach the deadline`);
  await stdlib.wait(params.deadline);
  await timesup();

  const campaignBlance = await ctcOwner.apis.Observer.getCampaignBalance();
  console.log(`Campaign balance is ${stdlib.formatCurrency(campaignBlance)}`);

  const outcome = await getoutcome();

  await refund(outcome);

  for ( const [who, acc] of [['Owner', accOwner], ...funders]) {
    console.log(`${who}: ${stdlib.formatAddress(acc)} has`,
    stdlib.formatCurrency(await stdlib.balanceOf(acc)));
  }


};

console.log('Launching...');
const ctcOwner = accOwner.contract(backend);


console.log('Starting backends...');
await Promise.all([
    backend.Owner(ctcOwner, {
      getCampaign: () => {
        const params2 = {...params};
        params2.target = parseInt(stdlib.formatCurrency(stdlib.bigNumberToNumber(params.target)));
        console.log('Owner sets params of campaign: ', params2);
        return params;
      },
      campaignReady: () => {
        startFunders();
      },
    }),
]);
