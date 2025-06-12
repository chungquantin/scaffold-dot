import type { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ignition";
import "@nomicfoundation/hardhat-viem";
import "@parity/hardhat-polkadot";

// Configuration for the forked live chain
const forkedLiveChain = {
  forking: {
    url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
  },
};

const localNodeConfig = {
  nodeConfig: {
    nodeBinaryPath: "./bin/substrate-node",
    rpcPort: 8000,
    dev: true,
  },
};

const localAdapterConfig = {
  adapterConfig: {
    adapterBinaryPath: "./bin/eth-rpc",
    dev: true,
  },
};

const config: HardhatUserConfig = {
  solidity: "0.8.28",
  resolc: {
    compilerSource: "npm",
    settings: {
      optimizer: {
        enabled: true,
        parameters: "z",
        fallbackOz: true,
        runs: 200,
      },
    },
  },
  networks: {
    // polkadotHubTestnet: {
    //   polkavm: true,
    //   // Using Paseo Asset Hub by default
    //   url: "https://testnet-passet-hub-eth-rpc.polkadot.io",
    //   accounts: [process.env.PRIVATE_KEY!],
    // },
    hardhat: {
      polkavm: true,
      // If you want to use forked live chain, uncomment the next line
      // ...forkedLiveChain,

      // If you want to use local node, uncomment the next line
      ...localNodeConfig,

      // If you want to use local adapter, uncomment the next line
      ...localAdapterConfig,
    },
  },
};

export default config;
