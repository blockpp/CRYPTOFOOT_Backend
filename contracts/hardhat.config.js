require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter');
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    localhost: {
      url: "HTTP://127.0.0.1:7545",
      accounts: ["0x7ef8d84a9b830e7e3140bfc2f68c826d9c32fd62ddd2460872d27d9e75b2e1a8"],
      gas: 2100000,
      gasPrice: 8000000000,
      saveDeployments: true,
      chainId : 1337
    },
    goerli : {
      url: "https://eth-goerli.g.alchemy.com/v2/iKrbf5JMaM3SIQ3juSw45meeeh0z2vy7",
      accounts: ["e0dcc69ec098b1cc0dc1f3875f54912f3cc3cf448a4aba528ee6d02c622bf3b1"]
    },
    sepolia: {
      url: "https://eth-sepolia.g.alchemy.com/v2/mDG_5tQnnH1o2NWmfeVQood-21iXR45g",
      accounts: ['254eda0af30df30944ba70d5188d0fdca6baf744cb634e078929ca3d17410265'],
    },

  },
  abiExporter: [
    { 
      path: '../abi/',
      format: "json"
    }
  ],
  solidity: {
    version: "0.8.8",
    settings: {
      evmVersion: "byzantium",
      optimizer: {
        enabled: true,
        runs: 1500
      }
    }
  },
  
};
