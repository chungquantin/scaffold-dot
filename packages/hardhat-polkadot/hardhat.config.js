require("@nomicfoundation/hardhat-toolbox");
require("@nomicfoundation/hardhat-ignition");

require("@parity/hardhat-polkadot");

require("dotenv").config();

// require("hardhat-revive-node");
/** @type import('hardhat/config').HardhatUserConfig */
const config = {
  solidity: "0.8.19",
  resolc: {
    compilerSource: "npm",
    settings: {
      optimizer: {
        enabled: true,
        parameters: "z",
        fallbackOz: true,
        runs: 200,
      },
      standardJson: true,
    },
  },
  networks: {
    // polkadotHubTestnet: {
    //   polkavm: true,
    //   url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
    // },
    hardhat: {
      polkavm: true,
      nodeConfig: {
        nodeBinaryPath: "./bin/substrate-node",
        rpcPort: 8000,
        dev: true,
      },
      adapterConfig: {
        adapterBinaryPath: "./bin/eth-rpc",
        dev: true,
      },
    },
  },
};

module.exports = config;
