"use client";
import { useEffect, useState } from "react";
import { BrowserProvider } from "ethers";
import { getContract } from "../config";
import Image from "next/image";

export default function Home() {
  const [walletKey, setWalletKey] = useState("");
  const [mintingAmount, setMintingAmount] = useState<number>(0);
  const [balance, setBalance] = useState<number>(0);
  const [stakingAmount, setStakingAmount] = useState<number>(0);
  const [stakedAmount, setStakedAmount] = useState<number>(0);
  const [withdrawAmount, setWithdrawAmount] = useState<number>(0);
  const [withdrawnAmount, setWithdrawnAmount] = useState<number>(0);
  const [mintedAmount, setMintedAmount] = useState<number>(0);

  const [mintSubmitted, setMintSubmitted] = useState(false);
  const [stakeSubmitted, setStakeSubmitted] = useState(false);
  const [withdrawSubmitted, setWithdrawSubmitted] = useState(false);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);

  const mintCoin = async () => {
    if (mintingAmount <= 0) {
      alert("Mint failed: Cannot mint 0 amount.");
      return;
    }

    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    try {
      const tx = await contract.mint(signer, Math.floor(mintingAmount));
      await tx.wait();
      setMintSubmitted(true);
      checkBalance();
      setMintedAmount(mintedAmount + mintingAmount);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Minting failed: ${decodedError?.args}`);
    }
  };

  const mintAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setMintingAmount(Number(inputValue));
    } else {
      setMintingAmount(0);
    }
  };

  const stakeCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    try {
      const tx = await contract.stake(Math.floor(stakingAmount));
      await tx.wait();
      setStakeSubmitted(true);
      checkBalance();
      setStakedAmount(stakedAmount + stakingAmount);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Staking failed: ${decodedError?.args}`);
    }
  };

  const stakeAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    if (!isNaN(Number(inputValue))) {
      setStakingAmount(Number(inputValue));
    } else {
      setStakingAmount(0);
    }
  };

  const withdrawCoin = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    try {
      const tx = await contract.withdraw();
      await tx.wait();
      setWithdrawSubmitted(true);
      checkBalance();
      setWithdrawnAmount(withdrawnAmount + withdrawAmount);
    } catch (e: any) {
      const decodedError = contract.interface.parseError(e.data);
      alert(`Withdrawal failed: ${decodedError?.args}`);
    }
  };

  const connectWallet = async () => {
    const { ethereum } = window as any;

    try {
      await ethereum.request({
        method: "wallet_addEthereumChain",
        params: [
          {
            nativeCurrency: {
              name: "ETH",
              symbol: "ETH",
              decimals: 18,
            },
            rpcUrls: [
              "https://sepolia-rollup.arbitrum.io/rpc",
              "https://arbitrum-sepolia.blockpi.network/v1/rpc/public",
            ],
            chainId: "0x66eee",
            chainName: "Arbitrum Sepolia",
          },
        ],
      });

      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      setConnectedWallet(accounts[0]); //

      await ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [
          {
            chainId: "0x66eee",
          },
        ],
      });
    } catch (error) {
      console.error("Error connecting wallet:", error);
      alert(
        "Error connecting wallet. Please make sure you have an Ethereum-compatible wallet installed and connected."
      );
    }
  };

  const checkBalance = async () => {
    const { ethereum } = window as any;
    const provider = new BrowserProvider(ethereum);
    const signer = await provider.getSigner();
    const contract = getContract(signer);

    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      const userBalance = await contract.balanceOf(accounts[0]);
      setBalance(userBalance.toNumber());
    } catch (error) {
      console.error("Error checking balance:", error);
    }
  };

  const importToken = async () => {
    const tokenAddress = "0x412948f4D605b51cE2F9e566d7708Cb759BA891e";
    const tokenSymbol = "SVD";
    const tokenDecimals = 18;

    const { ethereum } = window as any;

    try {
      const success = await ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: {
            address: tokenAddress,
            symbol: tokenSymbol,
            decimals: tokenDecimals,
          },
        },
      });

      if (success) {
        console.log(`${tokenSymbol} token added to Metamask`);
        alert(`Token ${tokenSymbol} has been imported successfully!`);
      } else {
        console.error(`Failed to add ${tokenSymbol} token to Metamask`);
      }
    } catch (error) {
      console.error("Error adding token to Metamask:", error);
      // Handle error or show an error message to the user
    }
  };

  useEffect(() => {
    if (walletKey) {
      checkBalance();
    }
  }, [walletKey, mintSubmitted, stakeSubmitted, withdrawSubmitted]);

  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center p-8"
      style={{
        backgroundImage:
          "url('https://www.shutterstock.com/image-vector/avocado-seamless-pattern-print-fabric-600nw-788494813.jpg')",
      }}
      >
    <Image
      src="/SVD.png"
      alt="SVD Logo"
      width={100}
      height={40}
      priority
      className="mx-5 mb-5"
    />
      <div className="max-w-max bg-green-900 bg-opacity-40 rounded-lg text-center p-6 mb-6 font-serif">
      <h1 className="text-2xl font-bold text-white">FREE SHAVACADOO TOKEN</h1>
      </div>

      <div className="w-center mx-3 mb-2 flex flex-col md:flex-row md:justify-between md:space-x-3">
        <div className="max-w-max bg-green-900 bg-opacity-40 rounded-lg text-center p-4 mb-4 mx-auto">
          <h2 className="text-xl font-semibold mb-2 text-center text-white font-serif">
            Connect Wallet
          </h2>
          <button
            onClick={connectWallet}
            className="bg-green-500 text-white font-bold py-1 px-2 rounded focus:outline-none hover:bg-green-700 focus:ring-2 focus:ring-green-500 mt-1"
          >
            Connect
          </button>
        </div>

        <div className="max-w-max bg-green-900 bg-opacity-40 rounded-lg text-center p-4 mb-4 mx-auto">
          <h2 className="text-xl font-semibold mb-2 text-center text-white font-serif">
            Import Token
          </h2>
          <button
            onClick={importToken}
            className="bg-green-500 text-white font-bold py-1 px-2 rounded focus:outline-none hover:bg-green-700 focus:ring-2 focus:ring-green-500 mt-1"
          >
            Import Token
          </button>
        </div>
      </div>

      {connectedWallet && (
        <p className="mt-4 text-white bg-green-500 p-2 rounded-lg">
          Connected to wallet: {connectedWallet}
        </p>
      )}

      <div className="w-full mx-auto mb-4">
        <div className="max-w-max bg-green-900 bg-opacity-40 rounded-lg text-center p-4 mb-4 mx-auto">
          <h2 className="text-xl font-semibold mb-2 text-center text-white font-serif">
            Minting
          </h2>
          <input
            type="number"
            min="0"
            value={mintingAmount}
            onChange={mintAmountChange}
            className="w-full p-2 border border-gray-400 rounded-lg mb-2"
            placeholder="Enter amount to mint"
            style={{ color: "black" }}
          />
          <button
            onClick={mintCoin}
            className="bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none hover:bg-green-700 focus:ring-2 focus:ring-green-500 font-serif"
          >
            Mint
          </button>
          {mintSubmitted && (
            <p className="text-green-500 mt-2">
              Minting successful! Total Minted:{" "}
              <span className="text-black">{mintedAmount}</span>
            </p>
          )}
        </div>
      </div>

      <div className="w-full mx-auto mb-4">
        <div className="max-w-max bg-green-900 bg-opacity-40 rounded-lg text-center p-4 mb-4 mx-auto">
          <h2 className="text-xl font-semibold mb-2 text-center text-white font-serif">
            Staking
          </h2>
          <input
            type="number"
            min="0"
            value={stakingAmount}
            onChange={stakeAmountChange}
            className="w-full p-2 border border-gray-400 rounded-lg mb-2"
            placeholder="Enter amount to stake"
            style={{ color: "black" }}
          />
          <button
            onClick={stakeCoin}
            className="bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none hover:bg-green-700 focus:ring-2 focus:ring-green-500 font-serif"
          >
            Stake
          </button>
          {stakeSubmitted && (
            <p className="text-orange-500 mt-2">
              Staking successful! Total Staked:{" "}
              <span className="text-black">{stakedAmount}</span>
            </p>
          )}
        </div>
      </div>

      <div className="w-full mx-auto text-center">
        <button
          onClick={withdrawCoin}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded focus:outline-none hover:bg-red-700 focus:ring-2 focus:ring-red-500 font-serif"
        >
          Withdraw
        </button>
        {withdrawSubmitted && (
          <p className="text-red-500 mt-2">
            Withdrawal successful! Total Withdrawn:{" "}
            <span className="text-black">{withdrawnAmount}</span>
          </p>
        )}
      </div>

      <div
        className="mt-4 text-black bg-white bg-opacity-50 w-full p-2 rounded-lg text-center font-serif"
        style={{ fontSize: "16px", fontWeight: "bold", fontStyle: "italic" }}
      >
        <p>Created by: Jhon Kenneth A. Acerado</p>
      </div>
    </main>
  );
}
