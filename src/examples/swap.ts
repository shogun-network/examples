import { fetchEvmQuote } from "../scripts/fetchQuote";
import { ChainId, NativeToken } from "../constants";
import { signer } from "../network";

async function main() {
  const amount = "1000000000000000000"; // 1ETH
  const srcToken = NativeToken;
  const destToken = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'; // USDC Base
  const srcChain = ChainId.BASE;
  const destChain = ChainId.BASE;

  const quote = await fetchEvmQuote({
    senderAddress: signer.address,
    amount,
    srcToken,
    destToken,
    srcChain,
    destChain,
  });

  console.log(quote);
}

main().then();