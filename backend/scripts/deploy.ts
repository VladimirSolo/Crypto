import { ethers } from "hardhat";

async function main() {
  const provider = ethers.provider;
  const [signer] = await ethers.getSigners();
  console.log("🚀 ~ signer:", signer)

  const addr = await signer.getAddress()
  console.log("🚀 ~ addr:", addr)

  const reciver = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
  const amountInWei = ethers.parseEther('1');

  const txData = {
    to: reciver,
    value: amountInWei,
  }

  const tx = await signer.sendTransaction(txData);
  console.log("🚀 ~ sendTransaction:", tx)

  await tx.wait();

  const signerBalance = await provider.getBalance(addr);
  console.log("🚀 Signer balance:", ethers.formatEther(signerBalance))

  console.log("🚀 Reciver balance:", `${ethers.formatEther(await provider.getBalance(reciver))}`)

  // Working with blocks
  const blockInfo = await ethers.provider.getBlock(1, true)// true - all transaction get
  console.log("🚀 ~ Information about first block:", blockInfo)
  // get time from block
  const timeBlock = (await ethers.provider.getBlock(1))?.timestamp // seconds
  const timeBlockMiliSeconds = timeBlock && new Date(timeBlock * 1000)
  console.log("🚀 ~ timeBlockMiliSeconds:", timeBlockMiliSeconds)
  // get hash
  const hashTx = blockInfo?.prefetchedTransactions[0].hash
  console.log("🚀 ~ hash Transactions:", hashTx)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error); process.exit(1)
  })