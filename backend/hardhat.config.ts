import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "./tasks/task"

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
  // https://github.com/cgewecke/hardhat-gas-reporter --> example usage
  gasReporter: {
    enabled: false
  }
};

export default config;
