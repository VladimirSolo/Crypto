import { ethers } from "hardhat";

async function main() {
  console.log('Process deploing...')

  const [owner, customer] = await ethers.getSigners();

  const AlbumStoreFactory = await ethers.getContractFactory('AlbumStore');
  const store = await AlbumStoreFactory.deploy(owner.address);
  await store.waitForDeployment()

  const contractAddress = await store.getAddress()

  console.log(`Deployed to ${contractAddress}`)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error); process.exit(1)
  })