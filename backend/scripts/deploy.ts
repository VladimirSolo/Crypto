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
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error); process.exit(1)
  })