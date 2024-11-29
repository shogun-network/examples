import { VersionedTransaction } from "@solana/web3.js";
import { ChainId } from "../constants";
import { fetchSolanaQuote } from "../scripts/fetchQuote";
import { baseSigner, solanaSigner } from "../network";
import { formatStringEstimation } from "../scripts/formatting";
import { getBundleStatuses, sendJitoBundle, sleep } from "../scripts/jito";

async function main() {
  // We recommend using Jito bundles for fast and smooth Solana experience
  const jitoTip = '1000000';
  const amount = '10000000'; // 0.01 SOL
  const srcToken = 'So11111111111111111111111111111111111111112'; // SOL
  const destToken = '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913'; // USDC Base
  const srcChain = ChainId.SOLANA;
  const destChain = ChainId.BASE;
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
    // `destinationAddress` and `dstChainOrderAuthorityAddress` are required for bridge transactions
    destinationAddress: baseSigner.address,
    dstChainOrderAuthorityAddress: baseSigner.address,
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

  // sending transactions as Jito bundle
  const bundleId = await sendJitoBundle(transactions);

  // waiting for transactions confirmation
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