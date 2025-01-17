import { task } from "hardhat/config";
import { AlbumTracker__factory } from "../typechain-types";

//npx hardhat get_owner --network localhost --contract 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853 --signer 1

task("get_owner", "Read Album owner")
  .addParam("contract", "Contract address")
  .addParam("signer", "Signer index")
  .setAction(async (taskArgs, { ethers }) => {
    console.log("Start task!");
    const signer = (await ethers.getSigners())[taskArgs.signer];

    const contractAddress = "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853";

    const albumTracker = AlbumTracker__factory.connect(
      taskArgs.contract,
      signer
    );

    try {
      const ownerAddress = await albumTracker.owner();
      console.log("Album Tracker Owner Address:", ownerAddress);
    } catch (error) {
      console.error("Error fetching owner:", error);
    }
  });

// npx hardhat create_album --network localhost --contract 0xa513E6E4b8f2a923D98304ec87F64353C4D5C853 --owner 0 --title Dream2 --price 0.000002

task("create_album", "Create new album")
  .addParam("contract", "Contract address")
  .addParam("owner", "Owner index = 0")
  .addParam("title", "Album title")
  .addParam("price", "Album price")
  .setAction(async (taskArgs, { ethers }) => {
    console.log("Start task!");
    const owner = (await ethers.getSigners())[taskArgs.owner];

    const albumTracker = AlbumTracker__factory.connect(
      taskArgs.contract,
      owner
    );

    const priceInWei = ethers.parseEther(taskArgs.price);

    try {
      const album = await albumTracker.createAlbum(priceInWei, taskArgs.title);
      console.log("Created album:", album);
    } catch (error) {
      console.error("Error creating album:", error);
    }
  });
