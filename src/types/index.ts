import { EvmEstimation } from "./evm";
import { SolanaEstimation } from "./solana";

export type DextraQuoteEstimation = EvmEstimation | SolanaEstimation;

export type QuoteQueryParams = {
  srcToken: string,
  destToken: string,
  amount: string,
  senderAddress: string,
  srcChain: string,
  destChain: string,
  slippage?: string,
  gasRefuel?: string,
  srcChainOrderAuthorityAddress?: string,
  dstChainOrderAuthorityAddress?: string,
  dstChainBridgeFallbackAddress?: string,
  destinationAddress?: string,
  affiliateWallet?: string,
  affiliateFee?: string,
  externalCall?: string,
  // Solana only params
  jitoTip?: string,
  excludeDexes?: string,
  onlyDirectRoutes?: string,
}