// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  
  // Roles Contract deployment
  const Roles = await hre.ethers.getContractFactory("Roles");
  const roles = await Roles.deploy();
  await roles.deployed();
  //Admin Contract Deployment
  const Admin = await hre.ethers.getContractFactory("Admin");
  const admin = await Admin.deploy();
  await admin.deployed();
  // Corporate Contract Deployment
  const Corporate =  await hre.ethers.getContractFactory("Corporate");
  const corporate = await Corporate.deploy(admin.address);
  await corporate.deployed();
  //Trader Contract deployment 
  const Trader = await hre.ethers.getContractFactory("Trader");
  const trader = await Trader.deploy(admin.address);
  await trader.deployed();
  //ERC20 Contract deployment
  const OlympCoin = await hre.ethers.getContractFactory("OlympCoin");
  const olympCoin = await OlympCoin.deploy(10000000);

  const Marketplace =await hre.ethers.getContractFactory("Marketplace");
  const marketplace = await Marketplace.deploy();
  await marketplace.deployed();
  console.log(roles.address,"Roles Contract address");
  console.log(admin.address,"admin Contract address");
  console.log(corporate.address,"corporate Contract address");
  console.log(trader.address,"trader Contract address");
  console.log(olympCoin.address,"OlymCoin Contract address");
  console.log(marketplace.address,"marketplace Contract address");


  




  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
