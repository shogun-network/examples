import axios from 'axios'
import { DextraApiKey, DextraQuoteURL } from './examples';

export async function dextraQuote(
 { // required
  senderAddress,
  srcToken,
  destToken,
  amount,
  srcChain,
  destChain,
  // optional
  gasRefuel,
  slippage,
  affiliateFee,
  affiliateWallet,
  destinationAddress,
  bridgeExtraNative,
  dstChainOrderAuthorityAddress,
  srcChainOrderAuthorityAddress,
  externalCall,
  // Solana only params
  jitoTip,
  excludeDexes,
  onlyDirectRoutes,
  // helper for func
  dextraBaseUrl = DextraQuoteURL,
  apiKey = DextraApiKey,
 }: {
  // Required params
  senderAddress: string,
  srcToken: string,
  destToken: string,
  amount: string,
  srcChain: string,
  destChain: string,
  // Optional params
  gasRefuel?: number,
  slippage?: number,
  affiliateFee?: number,
  affiliateWallet?: string,
  destinationAddress?: string,
  bridgeExtraNative?: number,
  dstChainOrderAuthorityAddress?: string,
  srcChainOrderAuthorityAddress?: string,
  externalCall?: string,
  // Solana only params
  jitoTip?: string,
  excludeDexes?: string,
  onlyDirectRoutes?: string,
  // helper for func
  dextraBaseUrl?: string,
  apiKey?: string,
 }
): Promise<DextraQuoteEstimation> {
  // URL with required params
  let url = `${dextraBaseUrl}?srcToken=${srcToken}&destToken=${destToken}&amount=${amount}&senderAddress=${senderAddress}&destChain=${destChain}&srcChain=${srcChain}`

  // Add optional params as needed
  if (gasRefuel) url += `&gasRefuel=${gasRefuel}`;
  if (slippage) url += `&slippage=${slippage}`;
  if (bridgeExtraNative) url += `&bridgeExtraNative=${bridgeExtraNative}`;
  if (affiliateWallet) url += `&affiliateWallet=${affiliateWallet}`;
  if (affiliateFee) url += `&affiliateFee=${affiliateFee}`;
  if (destinationAddress) url += `&destinationAddress=${destinationAddress}`;
  if (dstChainOrderAuthorityAddress) url += `&dstChainOrderAuthorityAddress=${dstChainOrderAuthorityAddress}`;
  if (srcChainOrderAuthorityAddress) url += `&srcChainOrderAuthorityAddress=${srcChainOrderAuthorityAddress}`;
  if (externalCall) url += `&externalCall=${externalCall}`;
  // Solana only
  if (jitoTip) url += `&jitoTip=${jitoTip}`;
  if (excludeDexes) url += `&excludeDexes=${excludeDexes}`;
  if (onlyDirectRoutes) url += `&onlyDirectRoutes=${onlyDirectRoutes}`;

  console.info("dextra quote: ", url)
  try {
    const response = await axios.get(url, {timeout: 200000, headers: {"x-api-key": apiKey}})
    const estimate = response.data;
    return estimate;
  } catch (error: any) {
    const msg = `Error dextra get tokenIn ${srcToken} in ${srcChain} tokenOut ${destToken} as ${destChain} = ` + error?.response?.data?.error + error;
    console.error(msg);
    throw new Error(error.message + msg + ". How to rerun: " + error?.config?.url);
  }
}

export type DextraQuoteEstimation = EvmEstimation | SolanaEstimation;

export type EvmEstimation = {
  routes: {
    path?: string[],
    amountIn: TokenData,
    amountOut: TokenData,
  }[],
  inputAmount: TokenData,
  outputAmount: TokenData & { receiver: string },
  calldatas: {
    chainId: number,
    from: string,
    data: `0x${string}`,
    to: string,
    value: string,
  },
} & ReplaceHexWithString<ExtraData>;

export type ExtraData = {
  gasRefuel?: string,
  swapFee?: TokenFeeData,
  bridgeFee?: TokenFeeData,
} & AffiliateFee;

export type AffiliateFee = {
  affiliateFee?: {
    receiver: `0x${string}`,
    feeToken: `0x${string}`,
    feeAmount: string,
  }
}

export type TokenData = {
  address: string,
  decimals: number,
  chainId: number,
  name: string,
  symbol: string,
  value: string,
}

export type TokenFeeData = {
  token: string,
  amount: string,
  chainId: number,
}

// --------- SOLANA TYPES ------------

export type SolanaEstimation = {
  routes: SolanaRoute[],
  inputAmount: {
    address: string,
    decimals: number,
    name: string,
    symbol: string,
    value: string,
    chainId: number
  },
  outputAmount: {
    address: string,
    decimals: number,
    name: string,
    symbol: string,
    value: string,
    chainId: number
  },
  calldatas: SolanaCallData[],
} & SolanaEstimationExtraData;

export type SolanaRoute = {
  path: string[],
  amountIn: {
    address: string,
    decimals: string,
    value: string,
    chainId: number
  },
  amountOut: {
    address: string,
    decimals: string,
    value: string,
    chainId: number
  },
  pools: string[]
};

export type SolanaCallData = {
  from: string,
  chainId: number,
  // calldata note
  label: string,
  // actual calldata
  data: string,
};

export type SolanaEstimationExtraData = {
  gasRefuel?: string,
  bridgeFee?: TokenFeeData,
  affiliateFee?: {
    receiver: string,
    feeToken: string,
    feeAmount: string,
  },
}

// ------------------- UTILS

// replaces all required and optional `0x${string}` types to required/optional string
type ReplaceHexWithString<T> = {
  [K in keyof T]: T[K] extends `0x${string}`
    ? string
    : T[K] extends `0x${string}` | undefined
      ? string | undefined
      : T[K] extends object
        ? ReplaceHexWithString<T[K]>
        : T[K] extends object | undefined
          ? ReplaceHexWithString<T[K]>
          : T[K];
};


export enum ChainId {
  ETHEREUM = "1",
  GOERLI = "5",
  BSC = "56",
  BSC_TESTNET = "97",
  ZKSYNC_TESTNET = "280",
  ZKSYNC = "324",
  OPBNB_TESTNET = "5611",
  OPBNB = "204",
  POLYGON_ZKEVM = "1101",
  POLYGON_ZKEVM_TESTNET = "1442",
  ARBITRUM_ONE = "42161",
  ARBITRUM_GOERLI = "421613",
  ARBITRUM_SEPOLIA = "421614",
  SCROLL_SEPOLIA = "534351",
  LINEA = "59144",
  LINEA_TESTNET = "59140",
  BASE = "8453",
  BASE_TESTNET = "84531",
  BASE_SEPOLIA = "84532",
  SEPOLIA = "11155111",
  SOLANA = "7565164",
  TRON = "728126428",
}