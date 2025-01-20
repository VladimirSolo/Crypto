import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "./tasks/task"
import dotenv from 'dotenv';

dotenv.config();

const PRIVATE_KEY = process.env.PRIVATE_KEY || "0x";
const ALCHEMY_SEPOLIA_KEY = process.env.ALCHEMY_SEPOLIA_KEY || "";
const API_URL = `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_SEPOLIA_KEY}`;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || "";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.28",
    settings: {
      optimizer: {
        enabled: true,
        runs: 2000
      }
    }
  },
  networks: {
    hardhat: {
      chainId: 1337,
      initialBaseFeePerGas: 0,
    },
    sepolia: {
      url: API_URL,
      accounts: [`0x${PRIVATE_KEY}`]
    }
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: ETHERSCAN_API_KEY,
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    // Write on https://repo.sourcify.dev/contracts
    enabled: true
  },
  // https://github.com/cgewecke/hardhat-gas-reporter --> example usage
  gasReporter: {
    enabled: false
  }
};

export default config;
