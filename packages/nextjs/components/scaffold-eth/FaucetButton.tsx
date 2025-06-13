"use client";

import { useAccount } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { hardhat } from "~~/config/hardhat";
import { useWatchBalance } from "~~/hooks/scaffold-eth/useWatchBalance";

/**
 * FaucetButton button which lets you grab eth.
 */
export const FaucetButton = () => {
  const { address, chain: ConnectedChain } = useAccount();

  const { data: balance } = useWatchBalance({ address });

  // Render only on local chain
  if (ConnectedChain?.id !== hardhat.id) {
    return null;
  }

  const isBalanceZero = balance && balance.value === 0n;

  return (
    <div
      className={
        !isBalanceZero
          ? "ml-1"
          : "ml-1 tooltip tooltip-bottom tooltip-primary tooltip-open font-bold before:left-auto before:transform-none before:content-[attr(data-tip)] before:-translate-x-2/5"
      }
      data-tip="Grab funds from faucet"
    >
      <a className="btn btn-secondary btn-sm px-2 rounded-full" href="https://faucet.polkadot.io/?parachain=1000">
        <BanknotesIcon className="h-4 w-4" />
      </a>
    </div>
  );
};
