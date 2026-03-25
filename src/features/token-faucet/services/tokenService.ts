// Simulated Token Service with 5 read functions and 3 write functions
// Uses localStorage for per-user state persistence

const COOLDOWN_MS = 24 * 60 * 60 * 1000; // 24 hours
const STORAGE_KEY_PREFIX = "token_faucet_";

interface UserState {
  address: string;
  balance: number;
  lastRequestTime: number | null;
}

interface TokenInfo {
  name: string;
  symbol: string;
  decimals: number;
  totalSupply: number;
  maxSupply: number;
}

const TOKEN_INFO: TokenInfo = {
  name: "Verdant Token",
  symbol: "VRD",
  decimals: 18,
  totalSupply: 1_000_000,
  maxSupply: 10_000_000,
};

function getUserState(address: string): UserState {
  const stored = localStorage.getItem(STORAGE_KEY_PREFIX + address);
  if (stored) return JSON.parse(stored);
  return { address, balance: 0, lastRequestTime: null };
}

function saveUserState(state: UserState) {
  localStorage.setItem(STORAGE_KEY_PREFIX + state.address, JSON.stringify(state));
}

function updateTotalSupply(delta: number) {
  const key = STORAGE_KEY_PREFIX + "totalSupply";
  const current = Number(localStorage.getItem(key) || TOKEN_INFO.totalSupply);
  localStorage.setItem(key, String(current + delta));
}

// ─── READ FUNCTIONS ───

export async function getTokenName(): Promise<string> {
  await simulateDelay();
  return TOKEN_INFO.name;
}

export async function getTokenSymbol(): Promise<string> {
  await simulateDelay();
  return TOKEN_INFO.symbol;
}

export async function getDecimals(): Promise<number> {
  await simulateDelay();
  return TOKEN_INFO.decimals;
}

export async function getTotalSupply(): Promise<number> {
  await simulateDelay();
  const stored = localStorage.getItem(STORAGE_KEY_PREFIX + "totalSupply");
  return stored ? Number(stored) : TOKEN_INFO.totalSupply;
}

export async function getBalance(address: string): Promise<number> {
  await simulateDelay();
  if (!address) return 0;
  return getUserState(address).balance;
}

export async function getMaxSupply(): Promise<number> {
  await simulateDelay();
  return TOKEN_INFO.maxSupply;
}

export async function getCooldownRemaining(address: string): Promise<number> {
  if (!address) return 0;
  const state = getUserState(address);
  if (!state.lastRequestTime) return 0;
  const elapsed = Date.now() - state.lastRequestTime;
  return Math.max(0, COOLDOWN_MS - elapsed);
}

// ─── WRITE FUNCTIONS ───

export async function requestTokens(address: string): Promise<{ success: boolean; message: string; cooldownMs?: number }> {
  await simulateDelay(800);
  if (!address) return { success: false, message: "Please enter a wallet address" };
  

  const state = getUserState(address);
  const cooldown = await getCooldownRemaining(address);

  if (cooldown > 0) {
    return {
      success: false,
      message: `Cooldown active. Please wait.`,
      cooldownMs: cooldown,
    };
  }

  const amount = 100;
  state.balance += amount;
  state.lastRequestTime = Date.now();
  saveUserState(state);
  updateTotalSupply(amount);

  return { success: true, message: `Successfully received ${amount} VRD tokens!` };
}

export async function mintTokens(address: string, amount: number): Promise<{ success: boolean; message: string }> {
  await simulateDelay(1000);
  if (!address) return { success: false, message: "Please enter a wallet address" };
  if (amount <= 0 || amount > 10000) return { success: false, message: "Amount must be between 1 and 10,000" };

  const totalSupply = await getTotalSupply();
  if (totalSupply + amount > TOKEN_INFO.maxSupply) {
    return { success: false, message: `Minting would exceed max supply of ${TOKEN_INFO.maxSupply.toLocaleString()} VRD` };
  }

  const state = getUserState(address);
  state.balance += amount;
  saveUserState(state);
  updateTotalSupply(amount);

  return { success: true, message: `Successfully minted ${amount.toLocaleString()} VRD tokens!` };
}

export async function transferTokens(
  fromAddress: string,
  toAddress: string,
  amount: number
): Promise<{ success: boolean; message: string }> {
  await simulateDelay(1200);
  if (!fromAddress || !toAddress) return { success: false, message: "Both addresses are required" };
  if (fromAddress === toAddress) return { success: false, message: "Cannot transfer to the same address" };
  if (amount <= 0) return { success: false, message: "Amount must be greater than 0" };

  const senderState = getUserState(fromAddress);
  if (senderState.balance < amount) {
    return { success: false, message: `Insufficient balance. You have ${senderState.balance.toLocaleString()} VRD` };
  }

  const recipientState = getUserState(toAddress);
  senderState.balance -= amount;
  recipientState.balance += amount;
  saveUserState(senderState);
  saveUserState(recipientState);

  return { success: true, message: `Successfully transferred ${amount.toLocaleString()} VRD to ${toAddress.slice(0, 8)}...` };
}

// ─── HELPERS ───

function simulateDelay(ms = 400): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
