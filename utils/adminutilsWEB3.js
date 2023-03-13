const { ethers , Wallet} = require("ethers");
const USER_REGISTRY_ABI = require('../abi/contracts/AdminContract.sol/AdminContract.json');
require("dotenv").config();
const USER_REGISTRY_ADDRESS = "USER_REGISTRY_CONTRACT_ADDRESS";
const ADMIN_ADDRESS = "ADMIN_ADDRESS";

const provider  = new ethers.providers.JsonRpcProvider(process.env.PROVIDER_URI_DEV);

const privateKey = process.env.PRIVATE_KEY;
const contractAddress = process.env.ADMIN_ADDRESS;


const userRegistryContract = new ethers.Contract(
  USER_REGISTRY_ADDRESS,
  USER_REGISTRY_ABI,
  provider
);

async function addUser(name, email) {

  await provider.getNetwork();
  const wallet = new Wallet(privateKey,provider).connect(provider);
  const admin = new ethers.Contract(contractAddress, USER_REGISTRY_ABI , wallet);
  const tx = await admin.addUser(name, email);
  tx.wait();
  console.log(tx.hex , "tx has been added");

  return tx;

}

async function deleteUser(userAddress) {
  const tx = await userRegistryContract.connect(signer).deleteUser(userAddress);
  await tx.wait();
  console.log("User deleted successfully");
}

async function updateUserEmail(userAddress, newEmail) {
  const tx = await userRegistryContract.connect(signer).updateUserEmail(userAddress, newEmail);
  await tx.wait();
  console.log("User email updated successfully");
}

async function updateUserValidationStatus(userAddress, validationStatus) {
  const tx = await userRegistryContract.connect(signer).updateUserValidationStatus(userAddress, validationStatus);
  await tx.wait();
  console.log("User validation status updated successfully");
}

async function getUser(userAddress) {
  const user = await userRegistryContract.getUser(userAddress);
  console.log(`User: name=${user[0]}, email=${user[1]}, validated=${user[2]}`);
}

async function getAdmin() {
  const admin = await userRegistryContract.getAdmin();
  console.log(`Admin: name=${admin[0]}, email=${admin[1]}, validated=${admin[2]}`);
}

module.exports = {
  addUser,
  deleteUser,
  updateUserEmail,
  updateUserValidationStatus,
  getUser,
  getAdmin
};
