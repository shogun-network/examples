import { VersionedTransaction } from "@solana/web3.js";
import { ChainId } from "../constants";
import { fetchSolanaQuote } from "../scripts/fetchQuote";
import { solanaSigner } from "../network";
import { formatStringEstimation } from "../scripts/formatting";
import { getBundleStatuses, sendJitoBundle, sleep } from "../scripts/jito";

async function main() {
  // We recommend using Jito bundles for fast and smooth Solana experience
  const jitoTip = '1000000';
  const amount = '1000000'; // 0.001 SOL
  const srcToken = 'So11111111111111111111111111111111111111112'; // SOL
  const destToken = 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'; // USDC Solana
  const srcChain = ChainId.SOLANA;
  const destChain = ChainId.SOLANA;
  const slippage = '1.5';

  const quote = await fetchSolanaQuote({
    senderAddress: solanaSigner.publicKey.toBase58(),
    amount,
    srcToken,
    destToken,
    srcChain,
    destChain,
    slippage,
    jitoTip,
  });

  console.log(`Expected to receive: ${
    formatStringEstimation(quote.outputAmount.value, quote.outputAmount.decimals)
  } ${quote.outputAmount.symbol}`);

  // deserialize Solana transactions
  const transactions: VersionedTransaction[] = [];
  for (let i = 0; i < quote.calldatas.length; i++) {
    const calldata = quote.calldatas[i];
    const messageBuffer = Buffer.from(calldata.data, 'base64');
    const transaction = VersionedTransaction.deserialize(messageBuffer);
    transactions.push(transaction);
  }

  // sign transactions
  for (let transaction of transactions) {
    transaction.sign([solanaSigner]);
  }

  const bundleId = await sendJitoBundle(transactions);
  while (true) {
    const bundleData = await getBundleStatuses(bundleId);
    console.log(`Bundle status: ${bundleData.status}`);

    await sleep(1000);
    if (bundleData.status === 'confirmed' ||bundleData.status === 'finalized') {
      bundleData.transactions.forEach((transactionHash) => {
        console.log(`https://solscan.io/tx/${transactionHash}`);
      });
      return;
    }
  }
}

main().then();