# Masterz Algorand ProjectWork

[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-yellow.svg)](https://opensource.org/licenses/)

This is a crowdfunding application that allows users to create campaigns and fund them. The application is built using Reach, a development framework for creating decentralized applications on the Algorand and Ethereum blockchain.

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contact](#contact)
- [Acknowledgments](#acknowledgments)

## Overview

### User Roles

The application has two types of users: Owners and Funders. Owners are users who create campaigns, while Funders are users who contribute funds to campaigns.

### Campaign Creation

Owners can create new campaigns by providing the following information:

- Title: A descriptive title for the campaign.
- Description: A detailed description of the campaign and its goals.
- Target: The amount of funding the campaign is trying to raise.
- End Date: The date when the campaign will end.

### Campaign Funding

Funders can contribute funds to campaigns by selecting a campaign and entering the amount they wish to donate. Funds can be transferred using cryptocurrency.

### Campaign Completion

When a campaign ends, the application checks whether the target amount has been reached. If the target has been met or exceeded, the funds are transferred to the campaign owner. If the target has not been met, the funds are returned to the funders.

## Getting Started

### Prerequisites

Before you can use this project, you will need the following:

- A POSIX system (e.g. Linux, macOS, Windows with WSL2 option)
- [make](https://en.wikipedia.org/wiki/Make_(software)) (GNU Make) installed
- [Docker](https://www.docker.com/get-started/) installed
- [Docker Compose](https://docs.docker.com/compose/install/) installed

If you are missing any of these prerequisites, please refer to the documentation for your operating system to learn how to install them.

To confirm everything is installed try to run the following three commands and see no errors.

```
make --version
docker --version
docker-compose --version
```

If you’re using Windows, consult [the guide to using Reach on Windows](https://docs.reach.sh/guide-windows.html).


### Installation

Once confirmed that prerequisite are installed, create a directory for the project so you can follow along:

```
mkdir -p ~/divercitylabs/ && cd ~/divercitylabs/
```

Next, download [Reach](https://www.reach.sh/) by running

```
curl https://docs.reach.sh/reach -o reach ; chmod +x reach
```

Since Reach is Dockerized, when first used, the images it uses need to be downloaded. This will happen automatically when used for the first time, but can be done manually now by running

```
./reach update
```

More information: Detailed Reach install instructions can be found in the [reach docs](https://reach.sh/).

Now clone the repo and navigate to the project folder

```
git clone https://github.com/divercitylabs/Masterz_Algorand_ProjectWork
cd Masterz_Algorand_ProjectWork
```

## Usage

Set an environment variable to use the Algorand Blockchain.

```
export REACH_CONNECTOR_MODE="ALGO-devnet"
```

Compile the code
```
../reach compile
```
and run it
```
../reach run
```



## License

All rights reserved.

<p align="justify"> 
Upon viewing this code, the user acknowledges that the software is the property of DivercityLabs and that unauthorized use of the software is prohibited. Any violation of the copyright or other intellectual property rights will be prosecuted under the law.
By way of example but not limited to, copyright law protects original creative works, such as software, video games, books, music, images, and videos. Copyright law varies by country. Copyright owners generally have the right to control certain unauthorized uses of their work (including the right to sue people who use their copyrighted work without permission). As a result, certain images and other copyrighted content may require permissions or licenses, especially if you use the work in a commercial setting. For example, even if you have permission to use an image, you may need additional permission to use what is in the image (e.g., a photo of a sculpture, a person, or a logo) because someone else's copyright, trademark, or publicity rights might also be involved. You are responsible for obtaining all of the permissions and licenses necessary to use the content in your specific context.
</p>

## Contact

If you have any questions, comments, or concerns about this project, please feel free to contact us at:

- ✉️ Email: [divercitylabs@gmail.com](mailto:divercitylabs@gmail.com)

We'll do our best to respond as soon as possible.

## Acknowledgments

This project would not have been possible without the following technologies:

- [Algorand](https://www.algorand.com/)
- [Docker](https://www.docker.com/)
- [Reach](https://reach.sh)

<p align="justify"> 
We'd like to thank Algorand for creating the Algorand blockchain, which has revolutionized the way we think about decentralized and secure transactions.
We'd like to thank also the developers of Docker and Reach for creating and maintaining these fantastic tools, which made our work on this project much easier and more efficient.
</p>
<p align="justify"> 
We want to express our sincere appreciation to <a href='https://www.masterzblockchain.com/'>Masterz<a/> for their role in advancing our knowledge of blockchain technology. Thanks to Masterz, we had the privilege of meeting each other and creating this team.
</p>
