import { fetchEvmQuote } from "../scripts/fetchQuote";
import { ChainId, NativeToken } from "../constants";
import { baseSigner } from "../network";
import { approveIfRequired } from "../scripts/approveIfRequired";

async function main() {
  const amount = "1000000000000000000"; // 1ETH
  const srcToken = NativeToken;
  const destToken = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'; // USDC Base
  const srcChain = ChainId.BASE;
  const destChain = ChainId.BASE;

  const quote = await fetchEvmQuote({
    senderAddress: baseSigner.address,
    amount,
    srcToken,
    destToken,
    srcChain,
    destChain,
  });


  await approveIfRequired(baseSigner, srcToken, quote.calldatas.to, amount);

  const swapTx = await baseSigner.sendTransaction({
    to: quote.calldatas.to,
    data: quote.calldatas.data,
    value: quote.calldatas.value,
  });
  await swapTx.wait();
  console.log(`https://basescan.org/tx/${swapTx.hash}`);
}

main().then();