import { ethers } from "ethers";
import dotenv from "dotenv";

dotenv.config();

export const baseProvider = ethers.getDefaultProvider(process.env.BASE_MAINNET_URL!);
export const signer = new ethers.Wallet(process.env.PRIVATE_KEY!).connect(baseProvider);