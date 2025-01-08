import { BrowserProvider } from "ethers";

let walletProvider: BrowserProvider | undefined;

if (typeof window !== "undefined" && window.ethereum) {
  walletProvider = new BrowserProvider(window.ethereum);
}

export default walletProvider;
