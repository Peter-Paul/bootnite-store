"use client";

import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { ToastContainer, toast } from "react-toastify";

declare global {
  interface Window {
    ethereum?: any;
  }
}

const CONTRACT_ADDRESS = "0x3F89F571BF0F3319EdF9f5bD05150dB3b313c4F8";
const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "uint256", name: "_minimumPrice", type: "uint256" },
      { internalType: "uint256", name: "_transferFee", type: "uint256" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "buyer",
        type: "address",
      },
      {
        indexed: true,
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "ItemBought",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
    ],
    name: "ItemMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: true,
        internalType: "uint256",
        name: "itemId",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "feePaid",
        type: "uint256",
      },
    ],
    name: "ItemTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newPrice",
        type: "uint256",
      },
    ],
    name: "MinimumPriceUpdated",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: "uint256",
        name: "newFee",
        type: "uint256",
      },
    ],
    name: "TransferFeeUpdated",
    type: "event",
  },
  {
    inputs: [{ internalType: "uint256", name: "itemId", type: "uint256" }],
    name: "buyItem",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "user", type: "address" }],
    name: "getOwnedItems",
    outputs: [{ internalType: "uint256[]", name: "", type: "uint256[]" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "itemId", type: "uint256" }],
    name: "isItemOwned",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "isMinted",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    name: "itemOwner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "minimumPrice",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "itemId", type: "uint256" }],
    name: "mintItem",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "", type: "address" },
      { internalType: "uint256", name: "", type: "uint256" },
    ],
    name: "ownedItems",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "transferFee",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "itemId", type: "uint256" },
    ],
    name: "transferItem",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newPrice", type: "uint256" }],
    name: "updateMinimumPrice",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "uint256", name: "newFee", type: "uint256" }],
    name: "updateTransferFee",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "withdraw",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const xpTokens = [
  { id: 1, name: "Medusa", type: "Skin", expiry: "7d", price: "0.001 ETH" },
  {
    id: 2,
    name: "Cyber-Norse Helm",
    type: "Sticker",
    expiry: "2d",
    price: "0.002 ETH",
  },
  {
    id: 3,
    name: "2x Rank XP",
    type: "Rank XP",
    duration: "1h",
    expiry: "7d",
    price: "0.003 ETH",
  },
  {
    id: 4,
    name: "Hulk Smask",
    type: "Charm",
    expiry: "1d",
    price: "0.0025 ETH",
  },
  {
    id: 5,
    name: "Mjolnir",
    type: "Sticker",
    expiry: "7d",
    price: "0.0015 ETH",
  },
  { id: 6, name: "Saitama", type: "Skin", expiry: "2d", price: "0.004 ETH" },
  {
    id: 7,
    name: "3x Gun XP",
    type: "Gun XP",
    duration: "1h",
    expiry: "7d",
    price: "0.005 ETH",
  },
  {
    id: 8,
    name: "Spider Man",
    type: "Skin",
    expiry: "3d",
    price: "0.0022 ETH",
  },
  {
    id: 9,
    name: "4x Battlepass XP",
    type: "Battlepass XP",
    duration: "30mins",
    expiry: "2d",
    price: "0.0035 ETH",
  },
  {
    id: 10,
    name: "Gas Musk Skull",
    type: "Charm",
    expiry: "5d",
    price: "0.003 ETH",
  },
  {
    id: 11,
    name: "King Kong",
    type: "Charm",
    expiry: "4d",
    price: "0.0028 ETH",
  },
  { id: 12, name: "IT", type: "Skin", expiry: "6d", price: "0.0032 ETH" },
  { id: 13, name: "Joker", type: "Charm", expiry: "3d", price: "0.0027 ETH" },
  { id: 14, name: "Rambo", type: "Skin", expiry: "5d", price: "0.0038 ETH" },
  {
    id: 15,
    name: "Sponge Bob",
    type: "Charm",
    expiry: "4d",
    price: "0.0024 ETH",
  },
];

const featuredItems = [
  {
    id: 1,
    name: "Gas Musk Skull",
    type: "Charm",
    image:
      "https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761336936/Gemini_Generated_Image_rl483hrl483hrl48-removebg-preview_dcxsis.png",
  },
  {
    id: 2,
    name: "Medusa",
    type: "Skin",
    image:
      "https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761404454/Gemini_Generated_Image_xi7tnwxi7tnwxi7t-removebg-preview_zw8k5i.png",
  },
  {
    id: 3,
    name: "Cyber-Norse Helm",
    type: "Sticker",
    image:
      "https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761406429/Gemini_Generated_Image_roqu2wroqu2wroqu-removebg-preview_ktxto3.png",
  },
];

const backgroundImages = [
  "https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761335408/Gemini_Generated_Image_udc1n1udc1n1udc1_zye1cf.png",
  "https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761335406/Gemini_Generated_Image_d7ew0wd7ew0wd7ew_hbkdo2.png",
  "https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761335405/Gemini_Generated_Image_jrxjbjjrxjbjjrxj_e3k6hb.png",
];

export default function Home() {
  const [account, setAccount] = useState("");
  const [activeTab, setActiveTab] = useState<"store" | "collection" | "admin">(
    "store"
  );
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [currentSlide, setCurrentSlide] = useState(0);
  const [bgSlide, setBgSlide] = useState(0);
  const [isOwner, setIsOwner] = useState(false);
  const [newPrice, setNewPrice] = useState("");
  const [newOwner, setNewOwner] = useState("");
  const [mintItemId, setMintItemId] = useState("");
  const [transferFee, setTransferFee] = useState("");
  const [ownedItems, setOwnedItems] = useState<number[]>([]);
  const [itemsOwned, setItemsOwned] = useState<{ [key: number]: boolean }>({});
  const [transferAddresses, setTransferAddresses] = useState<{
    [key: number]: string;
  }>({});

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (window.ethereum) {
      const handleAccountsChanged = async (accounts: string[]) => {
        if (accounts.length === 0) {
          disconnectWallet();
        } else if (accounts[0] !== account) {
          setAccount(accounts[0]);
          await checkOwner(accounts[0]);
          await loadOwnedItems(accounts[0]);
          await checkItemsOwnership();
          toast.success("Wallet switched!");
        }
      };

      window.ethereum.on("accountsChanged", handleAccountsChanged);

      return () => {
        window.ethereum.removeListener(
          "accountsChanged",
          handleAccountsChanged
        );
      };
    }
  }, [account]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setBgSlide((prev) => (prev + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const getTimeRemaining = (expiresAt: number) => {
    const diff = expiresAt - currentTime;
    if (diff <= 0) return "Expired";
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
    if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
    if (minutes > 0) return `${minutes}m ${seconds}s`;
    return `${seconds}s`;
  };

  const checkOwner = async (userAccount: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );
      const contractOwner = await contract.owner();
      setIsOwner(userAccount.toLowerCase() === contractOwner.toLowerCase());
    } catch (err) {
      setIsOwner(false);
    }
  };

  const loadOwnedItems = async (userAccount: string) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );
      const items = await contract.getOwnedItems(userAccount);
      setOwnedItems(items.map((id: bigint) => Number(id)));
    } catch (err) {
      setOwnedItems([]);
    }
  };

  const checkItemsOwnership = async () => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        provider
      );

      const owned: { [key: number]: boolean } = {};
      for (const token of xpTokens) {
        const isOwned = await contract.isItemOwned(token.id);
        owned[token.id] = isOwned;
      }
      setItemsOwned(owned);
    } catch (err) {
      setItemsOwned({});
    }
  };

  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        toast.error("MetaMask not installed");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      const network = await provider.getNetwork();
      if (Number(network.chainId) !== 84532) {
        try {
          await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x14a34" }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: "wallet_addEthereumChain",
              params: [
                {
                  chainId: "0x14a34",
                  chainName: "Base Sepolia",
                  rpcUrls: ["https://sepolia.base.org"],
                  nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                  blockExplorerUrls: ["https://sepolia.basescan.org"],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }

      setAccount(accounts[0]);
      await checkOwner(accounts[0]);
      await loadOwnedItems(accounts[0]);
      await checkItemsOwnership();
      toast.success("Wallet connected!");
    } catch (err: any) {
      const errorMsg =
        err?.reason || err?.message || "Failed to connect wallet";
      toast.error(errorMsg);
    }
  };

  const disconnectWallet = () => {
    setAccount("");
    setIsOwner(false);
    setOwnedItems([]);
    setItemsOwned({});
    setTransferAddresses({});
    toast.success("Wallet disconnected!");
  };

  const handlePurchase = async (itemId: number, price: string) => {
    try {
      if (!account) {
        toast.error("Connect wallet first");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.buyItem(itemId, {
        value: ethers.parseEther(price),
      });
      await tx.wait();
      await loadOwnedItems(account);
      await checkItemsOwnership();
      toast.success("Purchase successful!");
    } catch (err: any) {
      const errorMsg = err?.reason || err?.message || "Purchase failed";
      toast.error(errorMsg);
    }
  };

  const handleUpdatePrice = async () => {
    try {
      if (!account) {
        toast.error("Connect wallet first");
        return;
      }
      if (!newPrice || isNaN(Number(newPrice))) {
        toast.error("Enter valid price");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const priceInWei = ethers.parseEther(newPrice);
      const tx = await contract.updateMinimumPrice(priceInWei);
      await tx.wait();
      toast.success("Price updated!");
      setNewPrice("");
    } catch (err: any) {
      const errorMsg = err?.reason || err?.message || "Price update failed";
      toast.error(errorMsg);
    }
  };

  const handleTransferOwnership = async () => {
    try {
      if (!account) {
        toast.error("Connect wallet first");
        return;
      }
      if (!newOwner || !ethers.isAddress(newOwner)) {
        toast.error("Enter valid address");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.transferOwnership(newOwner);
      await tx.wait();
      toast.success("Ownership transferred!");
      setIsOwner(false);
      setNewOwner("");
    } catch (err: any) {
      const errorMsg = err?.reason || err?.message || "Transfer failed";
      toast.error(errorMsg);
    }
  };

  const handleMintItem = async () => {
    try {
      if (!account) {
        toast.error("Connect wallet first");
        return;
      }
      if (!mintItemId || isNaN(Number(mintItemId))) {
        toast.error("Enter valid item ID");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const tx = await contract.mintItem(Number(mintItemId));
      await tx.wait();
      await checkItemsOwnership();
      toast.success("Item minted!");
      setMintItemId("");
    } catch (err: any) {
      const errorMsg = err?.reason || err?.message || "Mint failed";
      toast.error(errorMsg);
    }
  };

  const handleUpdateTransferFee = async () => {
    try {
      if (!account) {
        toast.error("Connect wallet first");
        return;
      }
      if (!transferFee || isNaN(Number(transferFee))) {
        toast.error("Enter valid fee");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const feeInWei = ethers.parseEther(transferFee);
      const tx = await contract.updateTransferFee(feeInWei);
      await tx.wait();
      toast.success("Transfer fee updated!");
      setTransferFee("");
    } catch (err: any) {
      const errorMsg = err?.reason || err?.message || "Fee update failed";
      toast.error(errorMsg);
    }
  };

  const handleTransferItem = async (itemId: number, toAddress: string) => {
    try {
      if (!account) {
        toast.error("Connect wallet first");
        return;
      }
      if (!toAddress || !ethers.isAddress(toAddress)) {
        toast.error("Enter valid address");
        return;
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );

      const fee = await contract.transferFee();
      const tx = await contract.transferItem(toAddress, itemId, { value: fee });
      await tx.wait();
      await loadOwnedItems(account);
      await checkItemsOwnership();
      setTransferAddresses({ ...transferAddresses, [itemId]: "" });
      toast.success("Item transferred!");
    } catch (err: any) {
      const errorMsg = err?.reason || err?.message || "Transfer failed";
      toast.error(errorMsg);
    }
  };

  return (
    <main className="min-h-screen p-8 relative">
      <div className="fixed inset-0 -z-10">
        {backgroundImages.map((img, index) => (
          <div
            key={img}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{
              opacity: index === bgSlide ? 1 : 0,
              backgroundImage: `url(${img})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
              backgroundAttachment: "fixed",
            }}
          />
        ))}
        <div className="absolute inset-0 bg-background/80" />
      </div>
      <div className="absolute top-8 right-8">
        {account ? (
          <div className="flex items-center gap-3">
            <div className="bg-card border-2 border-accent px-4 py-2 rounded">
              <span className="text-accent text-sm">
                {account.slice(0, 6)}...{account.slice(-4)}
              </span>
            </div>
            <button
              onClick={disconnectWallet}
              className="bg-card border-2 border-primary/30 hover:border-accent text-foreground px-4 py-2 rounded text-sm font-medium transition-colors"
            >
              Disconnect
            </button>
          </div>
        ) : (
          <button
            onClick={connectWallet}
            className="bg-accent hover:bg-accent/80 text-foreground px-6 py-2 rounded font-medium transition-colors"
          >
            Connect Wallet
          </button>
        )}
      </div>

      <ToastContainer position="bottom-right" theme="dark" />

      <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
        Botnite Store
      </h1>

      <div className="mb-12 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-6 text-primary">
          Featured Items
        </h2>
        <div className="relative overflow-hidden rounded-lg bg-card border-2 border-accent neon-border">
          <div
            className="flex transition-transform duration-500 ease-in-out"
            style={{ transform: `translateX(-${currentSlide * 100}%)` }}
          >
            {featuredItems.map((item) => (
              <div
                key={item.id}
                className="min-w-full p-8 flex items-center gap-8"
              >
                <div className="w-1/2 flex items-center justify-center">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="max-w-full max-h-80 object-contain"
                  />
                </div>
                <div className="w-1/2 flex flex-col justify-center">
                  <h3 className="text-4xl font-bold text-primary mb-4">
                    {item.name}
                  </h3>
                  <p className="text-secondary text-2xl">{item.type}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
            {[0, 1, 2].map((index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentSlide ? "bg-accent" : "bg-primary/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-12">
        <button
          onClick={() => setActiveTab("store")}
          className={`px-8 py-3 rounded font-medium transition-colors ${
            activeTab === "store"
              ? "bg-accent text-foreground"
              : "bg-card border-2 border-primary/30 text-primary hover:border-accent"
          }`}
        >
          Store
        </button>
        <button
          onClick={() => setActiveTab("collection")}
          className={`px-8 py-3 rounded font-medium transition-colors ${
            activeTab === "collection"
              ? "bg-accent text-foreground"
              : "bg-card border-2 border-primary/30 text-primary hover:border-accent"
          }`}
        >
          My Collection
        </button>
        {isOwner && (
          <button
            onClick={() => setActiveTab("admin")}
            className={`px-8 py-3 rounded font-medium transition-colors ${
              activeTab === "admin"
                ? "bg-accent text-foreground"
                : "bg-card border-2 border-primary/30 text-primary hover:border-accent"
            }`}
          >
            Admin
          </button>
        )}
      </div>

      {activeTab === "store" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-[1800px] mx-auto">
          {xpTokens.map((token) => {
            const isPurchased = itemsOwned[token.id] || false;
            const priceValue = token.price.replace(" ETH", "");
            return (
              <div
                key={token.id}
                className="bg-card border-2 border-primary/30 rounded-lg p-6 hover:border-accent hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:scale-105 transition-all duration-300"
              >
                <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded mb-4 flex items-center justify-center">
                  {token.id === 1 ? (
                    <img
                      src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761404454/Gemini_Generated_Image_xi7tnwxi7tnwxi7t-removebg-preview_zw8k5i.png"
                      alt={token.name}
                      className="w-full h-full object-contain"
                    />
                  ) : token.id === 2 ? (
                    <img
                      src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761406429/Gemini_Generated_Image_roqu2wroqu2wroqu-removebg-preview_ktxto3.png"
                      alt={token.name}
                      className="w-full h-full object-contain"
                    />
                  ) : token.id === 4 ? (
                    <img
                      src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761404454/Gemini_Generated_Image_2kua9p2kua9p2kua-removebg-preview_f8eitp.png"
                      alt={token.name}
                      className="w-full h-full object-contain"
                    />
                  ) : token.id === 5 ? (
                    <img
                      src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761406429/Gemini_Generated_Image_y2hd6oy2hd6oy2hd-removebg-preview_gyzykd.png"
                      alt={token.name}
                      className="w-full h-full object-contain"
                    />
                  ) : token.id === 6 ? (
                    <img
                      src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761404454/Gemini_Generated_Image_6lxequ6lxequ6lxe-removebg-preview_cfolj1.png"
                      alt={token.name}
                      className="w-full h-full object-contain"
                    />
                  ) : token.id === 8 ? (
                    <img
                      src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761406122/Gemini_Generated_Image_na7idena7idena7i-removebg-preview_otf18b.png"
                      alt={token.name}
                      className="w-full h-full object-contain"
                    />
                  ) : token.id === 10 ? (
                    <img
                      src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761336936/Gemini_Generated_Image_rl483hrl483hrl48-removebg-preview_dcxsis.png"
                      alt={token.name}
                      className="w-full h-full object-contain"
                    />
                  ) : token.id === 11 ? (
                    <img
                      src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761438767/Gemini_Generated_Image_2rjwp62rjwp62rjw-removebg-preview_vn2rvb.png"
                      alt={token.name}
                      className="w-full h-full object-contain"
                    />
                  ) : token.id === 12 ? (
                    <img
                      src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761438768/Gemini_Generated_Image_8pr2v28pr2v28pr2-removebg-preview_fwnwmr.png"
                      alt={token.name}
                      className="w-full h-full object-contain"
                    />
                  ) : token.id === 13 ? (
                    <img
                      src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761438767/Gemini_Generated_Image_mv1zvwmv1zvwmv1z-removebg-preview_bvnmnn.png"
                      alt={token.name}
                      className="w-full h-full object-contain"
                    />
                  ) : token.id === 14 ? (
                    <img
                      src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761438766/Gemini_Generated_Image_oxxno3oxxno3oxxn-removebg-preview_szxo4h.png"
                      alt={token.name}
                      className="w-full h-full object-contain"
                    />
                  ) : token.id === 15 ? (
                    <img
                      src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761439644/Gemini_Generated_Image_ev07iwev07iwev07-removebg-preview_qxn0gu.png"
                      alt={token.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <span className="text-6xl opacity-50">⚡</span>
                  )}
                </div>
                <h3 className="text-lg font-semibold text-primary mb-2">
                  {token.name}
                </h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Type:</span>
                    <span className="text-secondary font-medium">
                      {token.type}
                    </span>
                  </div>
                  {"duration" in token && (
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Duration:</span>
                      <span className="text-accent font-medium">
                        {token.duration}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Expires in:</span>
                    <span className="text-accent font-medium">
                      {token.expiry}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-foreground/70">Price:</span>
                    <span className="text-accent font-bold">{token.price}</span>
                  </div>
                </div>
                {isPurchased ? (
                  <div className="w-full bg-primary/30 text-primary py-2 px-3 rounded text-sm font-medium text-center">
                    Purchased
                  </div>
                ) : account ? (
                  <button
                    onClick={() => handlePurchase(token.id, priceValue)}
                    className="w-full bg-accent hover:bg-accent/80 text-foreground py-2 px-3 rounded text-sm font-medium transition-colors"
                  >
                    Purchase
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>
      )}

      {activeTab === "collection" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 max-w-[1800px] mx-auto">
          {ownedItems.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-foreground/70 text-lg">
                No items in your collection
              </p>
            </div>
          ) : (
            ownedItems.map((itemId) => {
              const token = xpTokens[(itemId - 1) % xpTokens.length];
              return (
                <div
                  key={itemId}
                  className="bg-card border-2 border-primary/30 rounded-lg p-6 hover:border-accent hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] hover:scale-105 transition-all duration-300"
                >
                  <div className="aspect-square bg-gradient-to-br from-primary/20 to-secondary/20 rounded mb-4 flex items-center justify-center">
                    {token.id === 1 ? (
                      <img
                        src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761404454/Gemini_Generated_Image_xi7tnwxi7tnwxi7t-removebg-preview_zw8k5i.png"
                        alt={token.name}
                        className="w-full h-full object-contain"
                      />
                    ) : token.id === 2 ? (
                      <img
                        src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761406429/Gemini_Generated_Image_roqu2wroqu2wroqu-removebg-preview_ktxto3.png"
                        alt={token.name}
                        className="w-full h-full object-contain"
                      />
                    ) : token.id === 4 ? (
                      <img
                        src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761404454/Gemini_Generated_Image_2kua9p2kua9p2kua-removebg-preview_f8eitp.png"
                        alt={token.name}
                        className="w-full h-full object-contain"
                      />
                    ) : token.id === 5 ? (
                      <img
                        src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761406429/Gemini_Generated_Image_y2hd6oy2hd6oy2hd-removebg-preview_gyzykd.png"
                        alt={token.name}
                        className="w-full h-full object-contain"
                      />
                    ) : token.id === 6 ? (
                      <img
                        src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761404454/Gemini_Generated_Image_6lxequ6lxequ6lxe-removebg-preview_cfolj1.png"
                        alt={token.name}
                        className="w-full h-full object-contain"
                      />
                    ) : token.id === 8 ? (
                      <img
                        src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761406122/Gemini_Generated_Image_na7idena7idena7i-removebg-preview_otf18b.png"
                        alt={token.name}
                        className="w-full h-full object-contain"
                      />
                    ) : token.id === 10 ? (
                      <img
                        src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761336936/Gemini_Generated_Image_rl483hrl483hrl48-removebg-preview_dcxsis.png"
                        alt={token.name}
                        className="w-full h-full object-contain"
                      />
                    ) : token.id === 11 ? (
                      <img
                        src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761438767/Gemini_Generated_Image_2rjwp62rjwp62rjw-removebg-preview_vn2rvb.png"
                        alt={token.name}
                        className="w-full h-full object-contain"
                      />
                    ) : token.id === 12 ? (
                      <img
                        src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761438768/Gemini_Generated_Image_8pr2v28pr2v28pr2-removebg-preview_fwnwmr.png"
                        alt={token.name}
                        className="w-full h-full object-contain"
                      />
                    ) : token.id === 13 ? (
                      <img
                        src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761438767/Gemini_Generated_Image_mv1zvwmv1zvwmv1z-removebg-preview_bvnmnn.png"
                        alt={token.name}
                        className="w-full h-full object-contain"
                      />
                    ) : token.id === 14 ? (
                      <img
                        src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761438766/Gemini_Generated_Image_oxxno3oxxno3oxxn-removebg-preview_szxo4h.png"
                        alt={token.name}
                        className="w-full h-full object-contain"
                      />
                    ) : token.id === 15 ? (
                      <img
                        src="https://res.cloudinary.com/dwf6iuvbh/image/upload/v1761439644/Gemini_Generated_Image_ev07iwev07iwev07-removebg-preview_qxn0gu.png"
                        alt={token.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-6xl opacity-50">⚡</span>
                    )}
                  </div>
                  <h3 className="text-lg font-semibold text-primary mb-2">
                    {token.name}
                  </h3>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Item ID:</span>
                      <span className="text-accent font-bold">#{itemId}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-foreground/70">Type:</span>
                      <span className="text-secondary font-medium">
                        {token.type}
                      </span>
                    </div>
                    {"duration" in token && (
                      <div className="flex justify-between text-sm">
                        <span className="text-foreground/70">Duration:</span>
                        <span className="text-accent font-medium">
                          {token.duration}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <input
                      type="text"
                      value={transferAddresses[itemId] || ""}
                      onChange={(e) =>
                        setTransferAddresses({
                          ...transferAddresses,
                          [itemId]: e.target.value,
                        })
                      }
                      placeholder="Recipient address"
                      className="w-full bg-background border-2 border-primary/30 text-foreground px-3 py-2 rounded text-sm focus:border-accent outline-none"
                    />
                    {transferAddresses[itemId] && (
                      <button
                        onClick={() =>
                          handleTransferItem(itemId, transferAddresses[itemId])
                        }
                        className="w-full bg-accent hover:bg-accent/80 text-foreground py-2 px-3 rounded text-sm font-medium transition-colors"
                      >
                        Transfer
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}

      {activeTab === "admin" && (
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="bg-card border-2 border-accent rounded-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">Mint Item</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-foreground/70 text-sm mb-2">
                  Item ID
                </label>
                <input
                  type="text"
                  value={mintItemId}
                  onChange={(e) => setMintItemId(e.target.value)}
                  placeholder="1"
                  className="w-full bg-background border-2 border-primary/30 text-foreground px-4 py-3 rounded focus:border-accent outline-none"
                />
              </div>
              <button
                onClick={handleMintItem}
                className="w-full bg-accent hover:bg-accent/80 text-foreground py-3 px-6 rounded font-medium transition-colors"
              >
                Mint Item
              </button>
            </div>
          </div>

          <div className="bg-card border-2 border-accent rounded-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Update Minimum Price
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-foreground/70 text-sm mb-2">
                  New Price (ETH)
                </label>
                <input
                  type="text"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  placeholder="0.01"
                  className="w-full bg-background border-2 border-primary/30 text-foreground px-4 py-3 rounded focus:border-accent outline-none"
                />
              </div>
              <button
                onClick={handleUpdatePrice}
                className="w-full bg-accent hover:bg-accent/80 text-foreground py-3 px-6 rounded font-medium transition-colors"
              >
                Update Price
              </button>
            </div>
          </div>

          <div className="bg-card border-2 border-accent rounded-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Update Transfer Fee
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-foreground/70 text-sm mb-2">
                  New Fee (ETH)
                </label>
                <input
                  type="text"
                  value={transferFee}
                  onChange={(e) => setTransferFee(e.target.value)}
                  placeholder="0.005"
                  className="w-full bg-background border-2 border-primary/30 text-foreground px-4 py-3 rounded focus:border-accent outline-none"
                />
              </div>
              <button
                onClick={handleUpdateTransferFee}
                className="w-full bg-accent hover:bg-accent/80 text-foreground py-3 px-6 rounded font-medium transition-colors"
              >
                Update Fee
              </button>
            </div>
          </div>

          <div className="bg-card border-2 border-accent rounded-lg p-6">
            <h2 className="text-2xl font-bold text-primary mb-6">
              Transfer Ownership
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-foreground/70 text-sm mb-2">
                  New Owner Address
                </label>
                <input
                  type="text"
                  value={newOwner}
                  onChange={(e) => setNewOwner(e.target.value)}
                  placeholder="0x..."
                  className="w-full bg-background border-2 border-primary/30 text-foreground px-4 py-3 rounded focus:border-accent outline-none"
                />
              </div>
              <button
                onClick={handleTransferOwnership}
                className="w-full bg-accent hover:bg-accent/80 text-foreground py-3 px-6 rounded font-medium transition-colors"
              >
                Transfer Ownership
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
