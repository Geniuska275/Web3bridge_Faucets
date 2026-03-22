import { ethers } from "ethers";

// This would be your contract ABI
const TOKEN_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function maxSupply() view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function requestTokens()",
  "function mint(uint256 amount)",
  "function transfer(address to, uint256 amount) returns (bool)",
  "function getCooldown(address account) view returns (uint256)",
];

// This would be your contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // Example address

let provider: ethers.BrowserProvider | undefined;
let signer: ethers.Signer | undefined;
let tokenContract: ethers.Contract | undefined;

export const connectWallet = async (): Promise<string> => {
  if (window.ethereum) {
    provider = new ethers.BrowserProvider(window.ethereum);
    signer = await provider.getSigner();
    tokenContract = new ethers.Contract(CONTRACT_ADDRESS, TOKEN_ABI, signer);
    const address = await signer.getAddress();
    return address;
  } else {
    throw new Error("MetaMask is not installed!");
  }
};

const getContract = () => {
  if (!tokenContract) {
    throw new Error("Wallet not connected or contract not initialized.");
  }
  return tokenContract;
};

const parseBigNumber = (value: bigint, decimals: number = 18): number => {
  return parseFloat(ethers.formatUnits(value, decimals));
};

export const getTokenName = async (): Promise<string> => {
  const contract = getContract();
  const name = await contract.name();
  return name;
};

export const getTokenSymbol = async (): Promise<string> => {
  const contract = getContract();
  const symbol = await contract.symbol();
  return symbol;
};

export const getDecimals = async (): Promise<number> => {
  const contract = getContract();
  const decimals = await contract.decimals();
  return Number(decimals);
};

export const getTotalSupply = async (): Promise<number> => {
  const contract = getContract();
  const [supply, decimals] = await Promise.all([
    contract.totalSupply(),
    contract.decimals(),
  ]);
  return parseBigNumber(supply, Number(decimals));
};

export const getMaxSupply = async (): Promise<number> => {
  const contract = getContract();
  const [maxSupply, decimals] = await Promise.all([
    contract.maxSupply(),
    contract.decimals(),
  ]);
  return parseBigNumber(maxSupply, Number(decimals));
};

export const getBalance = async (address: string): Promise<number> => {
  const contract = getContract();
  const [balance, decimals] = await Promise.all([
    contract.balanceOf(address),
    contract.decimals(),
  ]);
  return parseBigNumber(balance, Number(decimals));
};

export const requestTokens = async (
  address: string
): Promise<{ success: boolean; message: string; cooldownMs?: number }> => {
  try {
    const contract = getContract();
    const tx = await contract.requestTokens();
    await tx.wait();
    return { success: true, message: "100 VRD tokens requested successfully!" };
  } catch (error: any) {
    console.error("Error requesting tokens:", error);
    const cooldown = await getCooldownRemaining(address);
    if (cooldown > 0) {
      return {
        success: false,
        message: "You are on cooldown. Please wait before requesting again.",
        cooldownMs: cooldown,
      };
    }
    return { success: false, message: error.reason || "Failed to request tokens." };
  }
};

export const getCooldownRemaining = async (address: string): Promise<number> => {
  try {
    const contract = getContract();
    const cooldownEnd = await contract.getCooldown(address); // Returns a Unix timestamp in seconds
    const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
    const remainingSeconds = Number(cooldownEnd) - currentTime;
    return Math.max(0, remainingSeconds * 1000); // Convert to milliseconds
  } catch (error) {
    console.error("Error getting cooldown:", error);
    return 0;
  }
};

export const mintTokens = async (
  address: string,
  amount: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const contract = getContract();
    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount.toString(), Number(decimals));
    const tx = await contract.mint(amountWei);
    await tx.wait();
    return { success: true, message: `${amount} VRD tokens minted to ${address}!` };
  } catch (error: any) {
    console.error("Error minting tokens:", error);
    return { success: false, message: error.reason || "Failed to mint tokens." };
  }
};

export const transferTokens = async (
  fromAddress: string,
  toAddress: string,
  amount: number
): Promise<{ success: boolean; message: string }> => {
  try {
    const contract = getContract();
    const decimals = await contract.decimals();
    const amountWei = ethers.parseUnits(amount.toString(), Number(decimals));
    const tx = await contract.transfer(toAddress, amountWei);
    await tx.wait();
    return {
      success: true,
      message: `${amount} VRD tokens transferred to ${toAddress} successfully!`,
    };
  } catch (error: any) {
    console.error("Error transferring tokens:", error);
    return { success: false, message: error.reason || "Failed to transfer tokens." };
  }
};
