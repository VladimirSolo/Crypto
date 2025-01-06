"use client";
import { Button } from "antd";
import { Addressable, BrowserProvider, formatEther } from "ethers";
import { useEffect, useState } from "react";

export const Header = () => {
  const [currentAccount, setCurrentAccount] = useState<string | Addressable>(
    ""
  );
  const [balance, setBalance] = useState<string>("");

  const switchNetwork = async () => {
    const chainId = "0xaa36a7";
    try {
      const currentChainId = await window.ethereum?.request({
        method: "eth_chainId",
      });
      if (currentChainId === chainId) {
        console.log("Already on Sepolia Test Network");
        return;
      }

      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: "0xaa36a7",
          },
        ],
      });

      console.log("Switched to Sepolia Test Network");
    } catch (error) {
      console.error("Ошибка при переключении на сеть Sepolia:", error);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      console.log("MetaMask не установлен");
      return;
    }

    try {
      await switchNetwork();
      const chainId = await window.ethereum?.request({ method: "eth_chainId" });
      console.log("Текущая сеть:", chainId);

      const provider = new BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);
      localStorage.setItem("account", accounts[0]);
      setCurrentAccount(accounts[0]);

      const balanceInWei = await provider.getBalance(accounts[0]);
      const balanceInEth = formatEther(balanceInWei);
      setBalance(balanceInEth);
      console.log(`Баланс: ${balanceInEth} ETH`);
    } catch (error) {
      console.error("Ошибка подключения к MetaMask:", error);
    }
  };

  const handleDisconnect = () => {
    localStorage.removeItem("account");
    setCurrentAccount("");
  };

  useEffect(() => {
    const accountFromLocalStorage = localStorage.getItem("account");
    if (accountFromLocalStorage) {
      setCurrentAccount(accountFromLocalStorage);
    }
  }, []);
  return (
    <header className="p-6">
      <Button
        type="primary"
        onClick={currentAccount ? handleDisconnect : connectWallet}
      >
        {currentAccount ? "Отключить кошелек" : "Подключить кошелек"}
      </Button>
    </header>
  );
};
