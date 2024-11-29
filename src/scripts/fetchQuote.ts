import axios from "axios";
import dotenv from "dotenv";
import { QuoteQueryParams } from "../types";
import { EvmEstimation } from "../types/evm";
import { SolanaEstimation } from "../types/solana";

dotenv.config();

export async function fetchQuote<ReturnType>(
  params: QuoteQueryParams
): Promise<ReturnType> {
  try {
    const response = await axios.get<ReturnType>(
      process.env.BASE_URL!,
      {
        timeout: 200000,
        params,
        headers: { "x-api-key": process.env.API_KEY }
      }
    );
    return response.data;
  } catch (error: any) {
    const msg = `Error dextra get tokenIn ${
      params.srcToken
    } in ${params.srcChain} tokenOut ${params.destToken} as ${
      params.destChain
    } = ` + error?.response?.data?.error + error;
    console.error(msg);
    throw new Error(error.message + msg + ". How to rerun: " + error?.config?.url);
  }
}

export async function fetchEvmQuote(params: QuoteQueryParams): Promise<EvmEstimation> {
  return await fetchQuote<EvmEstimation>(params);
}

export async function fetchSolanaQuote(params: QuoteQueryParams): Promise<SolanaEstimation> {
  return await fetchQuote<SolanaEstimation>(params);
}