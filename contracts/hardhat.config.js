require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter');
require('dotenv').config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    localhost: {
      url: "http://localhost:8545",
      accounts: ["0xa5692f0dd913400276ea060ea341e96efaa5c855b5c88a9abc924a7803c0676c"],
      gas: 2100000,
      gasPrice: 8000000000,
      saveDeployments: true,
      chainId : 1337
    },
    goerli : {
      url: "https://eth-goerli.g.alchemy.com/v2/iKrbf5JMaM3SIQ3juSw45meeeh0z2vy7",
      accounts: ["e0dcc69ec098b1cc0dc1f3875f54912f3cc3cf448a4aba528ee6d02c622bf3b1"]
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
