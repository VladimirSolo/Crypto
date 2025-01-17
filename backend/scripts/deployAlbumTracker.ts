import { ethers } from "hardhat";

async function main() {
  console.log('Process deploing...')

  const [signer] = await ethers.getSigners();
  const AlbumTrackerFactory = await ethers.getContractFactory('AlbumTracker', signer);
  const tracker = await AlbumTrackerFactory.deploy();
  await tracker.waitForDeployment()

  const contractAddress = await tracker.getAddress()

  console.log(`Deployed to ${contractAddress}`)

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error); process.exit(1)
  })