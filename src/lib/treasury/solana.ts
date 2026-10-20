import { Connection, PublicKey } from "@solana/web3.js";

// Required env vars:
// - SOLANA_RPC_URL: defaults to the public mainnet-beta endpoint, which is
//   rate-limited and not meant for production traffic — fine for now given
//   the low read frequency here (one dashboard load every ~30-60s per the
//   cache in the balances route), but swap in a dedicated provider
//   (Helius/QuickNode/etc.) if this starts getting throttled.
// - TREASURY_WALLET_ADDRESS: the public key of the self-custody wallet
//   holding SOL, MoCoin, and the Raydium LP tokens. Public info, not a
//   secret — but this app never needs (and must never receive) that
//   wallet's private key or seed phrase.
const DEFAULT_RPC_URL = "https://api.mainnet-beta.solana.com";

let connection: Connection | null = null;

export function getConnection(): Connection {
  if (!connection) {
    connection = new Connection(process.env.SOLANA_RPC_URL || DEFAULT_RPC_URL, "confirmed");
  }
  return connection;
}

export function getTreasuryWalletAddress(): string | null {
  return process.env.TREASURY_WALLET_ADDRESS || null;
}

export async function getSolBalance(ownerAddress: string): Promise<number> {
  const owner = new PublicKey(ownerAddress);
  const lamports = await getConnection().getBalance(owner, "confirmed");
  return lamports / 1_000_000_000;
}

export async function getTokenAccountBalance(ownerAddress: string, mintAddress: string): Promise<number> {
  const owner = new PublicKey(ownerAddress);
  const mint = new PublicKey(mintAddress);

  const accounts = await getConnection().getParsedTokenAccountsByOwner(owner, { mint });

  return accounts.value.reduce((sum, account) => {
    const amount = account.account.data.parsed?.info?.tokenAmount?.uiAmount;
    return sum + (typeof amount === "number" ? amount : 0);
  }, 0);
}

const TOKEN_PROGRAM_IDS = [
  "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA",
  "TokenzQdBNbLqP5VEhdkAS6EPFLC1PHnBqCXEpPxuEb", // Token-2022
];

// Every token the wallet holds, keyed by mint, in two RPC calls (one per token
// program) — cheaper than one call per mint when scanning many LP mints.
export async function getAllTokenBalances(ownerAddress: string): Promise<Record<string, number>> {
  const owner = new PublicKey(ownerAddress);
  const responses = await Promise.all(
    TOKEN_PROGRAM_IDS.map((programId) =>
      getConnection().getParsedTokenAccountsByOwner(owner, { programId: new PublicKey(programId) })
    )
  );

  const balances: Record<string, number> = {};
  for (const response of responses) {
    for (const account of response.value) {
      const info = account.account.data.parsed?.info;
      const amount = info?.tokenAmount?.uiAmount;
      if (info?.mint && typeof amount === "number") {
        balances[info.mint] = (balances[info.mint] || 0) + amount;
      }
    }
  }
  return balances;
}

export async function getTokenSupply(mintAddress: string): Promise<number> {
  const mint = new PublicKey(mintAddress);
  const supply = await getConnection().getTokenSupply(mint, "confirmed");
  return supply.value.uiAmount || 0;
}
