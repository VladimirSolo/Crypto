import { ethers, run } from "hardhat";

async function main() {
  console.log('Process deploing...')

  const [owner] = await ethers.getSigners();
  console.log("🚀 owner -> deploed:", owner)

  const AlbumStoreFactory = await ethers.getContractFactory('AlbumStore');
  const store = await AlbumStoreFactory.deploy(owner.address);
  await store.waitForDeployment()

  const contractAddress = await store.getAddress();

  console.log(`Deployed to ${contractAddress}`);

  // Verifying contract
  try {
    console.log("Verifying contract...");
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: [owner.address],
    });
    console.log("Verification successful!");
  } catch (error) {
    console.error("Verification failed:", error);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error); process.exit(1)
  })