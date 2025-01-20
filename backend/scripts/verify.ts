import hre from "hardhat"

// Define the NFT EXAMPLE
const name = "AlbumNFT"
const symbol = "Album"
const _metadataUri = "ipfs://Ue93LEmZaMds8bRjZCTJxo4DusvcBdLTS6XuDbdfd88y6"
const _maxTokens = "500"

async function main() {
  await hre.run("verify:verify", {
    address: "0x3972c87769886C4f1Ff3a8b77bc57738E82192D9",
    constructorArguments: [name, symbol, _metadataUri, _maxTokens],
  })
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

// npx hardhat run scripts/verify.ts --network sepolia