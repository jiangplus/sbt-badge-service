import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import '@openzeppelin/hardhat-upgrades';
import "@nomiclabs/hardhat-etherscan";

import * as dotenv from "dotenv";

dotenv.config();


const config: HardhatUserConfig = {
  mocha: {
    timeout: 100000000
  },
  gasReporter: {
    // enabled: (process.env.REPORT_GAS) ? true : false
    enabled: false
  },
  etherscan: {
    apiKey: {
      avalancheFujiTestnet: process.env.ETHERSCAN_API_KEY
    },
  },
  solidity:{ 
    version:"0.8.17",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1000,
      },
    },
  },
  networks: {
    localhost: {
      // accounts: process.env.KEY1 !== undefined ? [process.env.KEY1, process.env.KEY2 || ""] : [],
    },
    fuji: {
      url: `https://api.avax-test.network/ext/bc/C/rpc`,
      accounts:
        process.env.KEY1 !== undefined ? [process.env.KEY1, process.env.KEY2 || ""] : [],
      timeout: 3600000
    },
  }
};

export default config;
