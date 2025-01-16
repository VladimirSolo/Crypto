import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Album__factory, AlbumTracker } from "../typechain-types";
import { BaseContract, ContractTransactionReceipt } from "ethers";

describe("AlbumTracker Contract Tests", function () {
  const ALBUM_TITLE = "The World is mine";
  const ALBUM_PRICE = ethers.parseEther("0.0000000001");

  const SECOND_ALBUM_TITLE = "Califonia dreams";
  const SECOND_ALBUM_PRICE = ethers.parseEther("0.0000000002");

  async function deployAlbumTrackerFixture() {
    const [owner, buyer] = await ethers.getSigners();
    const AlbumTrackerFactory = await ethers.getContractFactory('AlbumTracker');
    const tracker = await AlbumTrackerFactory.deploy();

    return { tracker, owner, buyer };
  }

  it("deploy albums", async function () {
    const { tracker, buyer } = await loadFixture(deployAlbumTrackerFixture);

    const createAlbumReceipt = await createAlbum(tracker, ALBUM_TITLE, ALBUM_PRICE);
    expect(createAlbumReceipt, "Album creation transaction should be successful").to.not.be.null;

    const expectedAlbumAddress = await precomputeAddress(tracker);
    const album = Album__factory.connect(expectedAlbumAddress, buyer);

    expect(await album.price(), "Album price should match").to.eq(ALBUM_PRICE);
    expect(await album.title(), "Album title should match").to.eq(ALBUM_TITLE);
    expect(await album.purchased(), "Newly created album should not be purchased").to.be.false;
    expect(await album.index(), "Album index should be 0").to.eq(0);

  });

  it("creates albums", async function () {
    const { tracker } = await loadFixture(deployAlbumTrackerFixture);

    const receiptTx = await createAlbum(tracker, ALBUM_TITLE, ALBUM_PRICE);
    const album = await tracker.albums(0);

    expect(album.price, "Album price should match").to.eq(ALBUM_PRICE);
    expect(album.title, "Album title should match").to.eq(ALBUM_TITLE);
    expect(album.state, "Album state should be 0").to.eq(0);
    expect(await tracker.currentIndex(), "Album currentIndex should be 1").to.eq(1)

    const expectedAlbumAddress = await precomputeAddress(tracker);

    expect(receiptTx?.logs[0].topics[1], "Album address").to.eq(ethers.zeroPadValue(expectedAlbumAddress, 32));
    // await using
    await expect(receiptTx, "Emit").to.emit(tracker, "AlbumStateChanged").withArgs(expectedAlbumAddress, 0, 0, album.title)
  });

  it("allows to buy albums", async function () {
    const { tracker, buyer } = await loadFixture(deployAlbumTrackerFixture);

    await createAlbum(tracker, ALBUM_TITLE, ALBUM_PRICE);

    const expectedAlbumAddress = await precomputeAddress(tracker);
    const album = Album__factory.connect(expectedAlbumAddress, buyer);

    const txData = {
      to: expectedAlbumAddress,
      value: ALBUM_PRICE,
    }

    const txBuy = await buyer.sendTransaction(txData);
    await txBuy.wait();

    expect(await album.purchased(), "Newly created album should be purchased").to.be.true;
    expect((await tracker.albums(0)).state, "Album state should be 1").to.eq(1);

    await expect(txBuy, "Check changed ehter balance buyer").to.changeEtherBalance(
      buyer, -ALBUM_PRICE
    );
    await expect(txBuy, "Check changed ehter balance buyer and tracker").to.changeEtherBalances(
      [buyer, tracker], [-ALBUM_PRICE, ALBUM_PRICE]
    );

    // test erorr
    await expect(buyer.sendTransaction(txData), "Should be error message").to.be.revertedWith("This album is already purchased!")
  });

  it("create and test a second album", async function () {
    const { tracker } = await loadFixture(deployAlbumTrackerFixture);

    await createAlbum(tracker, ALBUM_TITLE, ALBUM_PRICE);
    const receiptTx = await createAlbum(tracker, SECOND_ALBUM_TITLE, SECOND_ALBUM_PRICE);

    const secondAlbum = await tracker.albums(1);

    expect(secondAlbum.price, "Second Album price should match").to.eq(SECOND_ALBUM_PRICE);
    expect(secondAlbum.title, "Second Album title should match").to.eq(SECOND_ALBUM_TITLE);
    expect(secondAlbum.state, "Second Album state should be 0").to.eq(0);
    expect(secondAlbum.album, "Second Album address").to.be.properAddress;
    expect(await tracker.currentIndex(), "Second Album currentIndex should be 2").to.eq(2);

    const balance = await ethers.provider.getBalance(secondAlbum.album)
    expect(balance.toString(), "Second Album balance should be 0").to.eq("0")

    const expectedSecondAlbumAddress = await precomputeAddress(tracker, 2);
    await expect(receiptTx).to.emit(tracker, "AlbumStateChanged").withArgs(expectedSecondAlbumAddress, 1, 0, SECOND_ALBUM_TITLE);
  })

  it("should check that only owners can create albums", async function () {
    const { tracker, buyer } = await loadFixture(deployAlbumTrackerFixture);

    await expect(tracker.connect(buyer).createAlbum(ALBUM_PRICE, ALBUM_TITLE)).to.be.revertedWithCustomError(tracker, "OwnableUnauthorizedAccount");
  })

  // Helper function to precompute the address of the album
  async function precomputeAddress(contract: BaseContract, nonce = 1): Promise<string> {
    return ethers.getCreateAddress({
      from: await contract.getAddress(),
      nonce,
    });
  }

  // Helper function to create an album
  async function createAlbum(tracker: AlbumTracker, title: string, price: bigint): Promise<ContractTransactionReceipt | null> {
    const createAlbumTx = await tracker.createAlbum(price, title);

    return await createAlbumTx.wait();
  }
});
