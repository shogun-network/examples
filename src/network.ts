import { ethers } from "ethers";
import { Connection, Keypair } from "@solana/web3.js";
import bs58 from "bs58";
import dotenv from "dotenv";

dotenv.config();

export const baseProvider = ethers.getDefaultProvider(process.env.BASE_MAINNET_URL!);
export const baseSigner = new ethers.Wallet(process.env.EVM_PRIVATE_KEY!).connect(baseProvider);

export const arbitrumProvider = ethers.getDefaultProvider(process.env.ARBITRUM_MAINNET!);
export const arbitrumSigner = new ethers.Wallet(process.env.EVM_PRIVATE_KEY!).connect(arbitrumProvider);

export const solanaSigner = Keypair.fromSeed(bs58.decode(process.env.SOLANA_BASE_58_PRIVATE_KEY!).slice(0,32));
export const solanaConnection = new Connection(
  process.env.SOLANA_RPC || 'https://api.mainnet-beta.solana.com',
  'confirmed'
);
