import { fetchEvmQuote } from "../scripts/fetchQuote";
import { ChainId, NativeToken } from "../constants";
import { baseProvider, signer } from "../network";
import { ethers } from "ethers";
import { IERC20_ABI } from "../abi/IERC20";

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

  if (srcToken as string !== NativeToken) {
    const TokenIn = new ethers.Contract(
      srcToken,
      IERC20_ABI,
      baseProvider,
    );
    const allowance: bigint = await TokenIn.allowance(
      signer.address,
      quote.calldatas.to,
    );

    if (allowance < BigInt(amount)) {
      console.log(`Approving ${amount} tokens`);
      const approveTx = await TokenIn.approve(
        quote.calldatas.to,
        amount,
      );

      await approveTx.wait();
    }
  }

  const swapTx = await signer.sendTransaction({
    to: quote.calldatas.to,
    data: quote.calldatas.data,
    value: quote.calldatas.value,
  });
  await swapTx.wait();
  console.log(`https://basescan.org/tx/${swapTx.hash}`);
}

main().then();