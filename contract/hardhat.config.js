require("@nomicfoundation/hardhat-toolbox");
require('hardhat-abi-exporter');

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  networks: {
    localhost: {
      url: "http://127.0.0.1:8545",
      accounts: ["0xf74897f369624274e178c7303fb9997a0061840d0174dcaeebaa6f4792497c2a"],
    },
    goerli : {
      url : "https://eth-goerli.g.alchemy.com/v2/iKrbf5JMaM3SIQ3juSw45meeeh0z2vy7",
      accounts: ["8b71e8f3611e70559f4852a3a26fbc06599dfc09f851320a71faf2345e249ce8"],
    }
  },

  abiExporter: [
    {
      path: '../abi/',
      format: "json",
    },
    
  ],
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      },
    },
  },
};
