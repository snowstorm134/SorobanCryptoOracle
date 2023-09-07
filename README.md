<div>
<img src="projectLogo.png" width="500">

<h3 align="center">Soroban Bitcoin Price Oracle</h3>

  <p align="center"> Bitcoin Price Oracle on Soroban Stellar (Futurenet)</p>
    - Live app: https://soroban-bitcoin-oracle.netlify.app<br/>
    - Tutorial (article): https://dev.to/user1122/soroban-bitcoin-price-oracle-tutorial-3ldk<br/>
    - Tutorial (video): <a href="https://t.ly/kc_xI">Link</a>
</div>

## Soroban Bitcoin Price Oracle

TBD

## Built With

- Soroban smart contracts - https://soroban.stellar.org
- React
- IPFS Storage - https://thirdweb.com/dashboard/infrastructure/storage
- Chakra UI - https://chakra-ui.com/


## Getting Started

### Prerequisites

* **Node v18** - Install here: https://nodejs.org/en/download
  
* **Rust** - How to install Rust: 
  [https://soroban.stellar.org/docs/getting-started/setup#install-rust](https://soroban.stellar.org/docs/getting-started/setup#install-rust)

* **Soroban CLI** - How to install Soroban CLI: 
  [https://soroban.stellar.org/docs/getting-started/setup#install-the-soroban-cli](https://soroban.stellar.org/docs/getting-started/setup#install-the-soroban-cli)
  
* **Stellar Account with test tokens on Futurenet** - How to create new wallet using soroban-cli & receive test tokens:
  [https://soroban.stellar.org/docs/getting-started/deploy-to-futurenet#configure-an-identity](https://soroban.stellar.org/docs/getting-started/deploy-to-futurenet#configure-an-identity)

* **Freighter Wallet** - Wallet extension for interact with the app. Link: https://www.freighter.app



### Build, deploy & run the app frontend

1. Clone this repository:
   ```sh
   git clone https://github.com/snowstorm134/SorobanCryptoOracle.git
   ```

2. Run
   ```sh
   npm run setup
   ```
    It will execute the `initialize.sh` bash script. *

    > * If you are using Linux or Ubuntu OS, you may get the following error:
    >   
    >   `./initialize.sh: Permission denied`

    This error occurs when the shell script you’re trying to run doesn’t have the permissions to execute. To fix that, use this command:

    ```sh
    chmod +x initialize.sh
    ```

    and try again to run 
    
    ```sh
    npm run setup
    ```

    The `initialize.sh` script will do all actions (creating a new wallet, get test tokens, build and deploy all contracts using this wallet, create bind for typescript and also will install all node js packages). For more details, please check the guide.







3. You will need to run a CRON task at every 5 minutes that will check if there is need to fetch the BTC price from external API and set it to contract.

   The function is ready, you need only to put:
   - Secret key of wallet (relayer) that will fetch BTC price from API and set it to smart contract;
   - Contract address of deployed Oracle Contract;
   - `API_KEY` from https://api-ninjas.com/api/cryptoprice (for free).
     
   To run the CRON task, go to `cron` dir and run:
   ```sh
   npm install
   node cron-script.js
   ```
  
4. Run
   ```sh
   npm run dev
   ```
   It will run the app frontend on port 3000 or other.
 
5. Open the app and start use it.
  
