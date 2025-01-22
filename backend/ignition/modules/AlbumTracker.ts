// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const AlbumTrackerModule = buildModule("AlbumTrackerModule", (m) => {
  const AlbumTracker = m.contract("AlbumTracker")

  return { AlbumTracker };
});

export default AlbumTrackerModule;
