import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers } from "hardhat";
import { Album__factory, AlbumTracker } from "../typechain-types";
import { BaseContract, ContractTransactionReceipt } from "ethers";

describe("AlbumStore contract", function () {
  const TITLE = "Freedom";
  const PRICE = 100;
  const UID = ethers.solidityPackedKeccak256(["string"], [TITLE]);
  const QUANTITY = 7;
  const INITIAL_INDEX = 0;
  const ALBUM_INDEX_BUY = 0;
  const INITIAL_ORDER_ID = 0;

  async function deployAlbumStoreFixture() {
    const [owner, customer] = await ethers.getSigners();

    const AlbumStoreFactory = await ethers.getContractFactory("AlbumStore");
    const store = await AlbumStoreFactory.deploy(owner.address);
    await store.waitForDeployment();

    return { store, owner, customer }
  }

  it("Allow to add album", async () => {
    console.log('Start testing')
    const { store } = await loadFixture(deployAlbumStoreFixture);

    const addTx = await store.addAlbum(UID, TITLE, PRICE, QUANTITY);
    await addTx.wait()

    const album = await store.albums(INITIAL_INDEX);

    expect(album.index, "Album index should be 0").to.eq(INITIAL_INDEX)
    expect(album.price, "Album price should be 100").to.eq(PRICE)
    expect(album.title, "Album title should be Freedom").to.eq(TITLE)
    expect(album.quantity, "Album quantity should be 7").to.eq(QUANTITY)
    expect(album.uid, `Album id should be equal ${UID}`).to.eq(UID)
    expect(await store.currentIndex(), "Current index shold update").to.eq(INITIAL_INDEX + 1);
  })

  it("Allow to buy album", async function () {
    const { store, customer } = await loadFixture(deployAlbumStoreFixture);

    expect(await store.currentOrderId()).to.eq(INITIAL_ORDER_ID);

    const addTx = await store.addAlbum(UID, TITLE, PRICE, QUANTITY);
    await addTx.wait()

    const album = await store.albums(INITIAL_INDEX);

    const buyTx = await store
      .connect(customer)
      .buy(ALBUM_INDEX_BUY, { value: PRICE });

    const receipt = await buyTx.wait();

    await expect(buyTx, "Check changed ehter balance customer and store").to.changeEtherBalances(
      [customer, store], [-PRICE, PRICE]
    );

    expect(receipt, "Recepiet not null").not.to.be.null;
    expect(receipt?.blockNumber, "blockNumber not undefined").not.to.be.undefined;
    const block = await ethers.provider.getBlock(receipt!.blockNumber);
    const time = block?.timestamp;

    await expect(buyTx, "Check AlbumBought event")
      .to.emit(store, "AlbumBought")
      .withArgs(UID, customer.address, time);

    const order = await store.orders(INITIAL_ORDER_ID);

    expect(order.orderId, "Order id should be 0").to.eq(INITIAL_ORDER_ID);
    expect(order.albumUid, `Order album id should be equal ${UID}`).to.eq(UID);
    expect(order.customer, `Customer address should be ${customer.address}`).to.eq(customer.address);
    expect(order.status, "Order status should be index 0 - paid").to.eq(0);
    expect(order.orderedAt, `Order time should be ${time}`).to.eq(time);

    expect(((await store.albums(ALBUM_INDEX_BUY)).quantity), "Album quantity should be 6").to.eq(QUANTITY - 1);
  })

  it("Shoul not allow to buy via receive", async () => {
    const { store, customer } = await loadFixture(deployAlbumStoreFixture);

    const txData = {
      to: store.target,
      value: 100,
    }

    await expect(customer.sendTransaction(txData), "Erorr message should be - Please use the buy function to purchase albums!")
      .to.be.revertedWith("Please use the buy function to purchase albums!")
  })

  it("Shoul allow to trigger delivery", async () => {
    const { store, customer } = await loadFixture(deployAlbumStoreFixture);

    const addTx = await store.addAlbum(UID, TITLE, PRICE, QUANTITY);
    await addTx.wait();

    const buyTx = await store
      .connect(customer)
      .buy(ALBUM_INDEX_BUY, { value: PRICE });

    await buyTx.wait();

    const triggerDelivery = await store.delivered(ALBUM_INDEX_BUY);
    await triggerDelivery.wait();

    const order = await store.orders(INITIAL_ORDER_ID);

    expect(order.status, "Order status should be index 1 - delivered").to.eq(1);

    await expect(triggerDelivery)
      .to.emit(store, "OrderDelivered")
      .withArgs(UID, customer.address);
  })
})