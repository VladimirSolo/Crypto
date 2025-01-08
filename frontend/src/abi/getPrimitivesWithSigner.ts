import { Contract } from "ethers";
import { ABI } from "./ABI";
import walletProvider from "../providers/walletProvider";
import { getContractAddress } from "../utils/getContractAddress";
// import { mainContract } from "./mainContract";

export const getPrimitivesWithSigner = async () => {
  if (!walletProvider) {
    throw new Error("wallet provider is not defined");
  }
  try {
    const signer = await walletProvider.getSigner();
    // const primitivesWithSigner = mainContract.connect(signer);
    const primitivesWithSigner = new Contract(getContractAddress(), ABI, signer);
    return primitivesWithSigner;

  } catch (error) {
    console.log(error)
  }
};
