import { Contract } from "ethers";
import { ABI } from "./ABI";
import { defaultProvider } from "../providers/defaultProvider";
import { getContractAddress } from "../utils/getContractAddress";

export const mainContract = new Contract(getContractAddress(), ABI, defaultProvider);
