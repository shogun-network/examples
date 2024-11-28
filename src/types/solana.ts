import { TokenFeeData } from "./evm";

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
  gasRefuel?: string,
  bridgeFee?: TokenFeeData,
  affiliateFee?: {
    receiver: string,
    feeToken: string,
    feeAmount: string,
  },
};

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