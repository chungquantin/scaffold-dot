"use client";

import React, { useState } from "react";
import { TransactionHash } from "./TransactionHash";
import { formatDistanceToNow } from "date-fns";
import { Block, TransactionReceipt, formatEther } from "viem";
import { Address } from "~~/components/scaffold-eth";
import { useTargetNetwork } from "~~/hooks/scaffold-eth/useTargetNetwork";
import { ChainWithAttributes, TransactionWithFunction } from "~~/utils/scaffold-eth";
import { TransactionsTableProps } from "~~/utils/scaffold-eth/";

const BlockDetailModal = ({
  block,
  isOpen,
  onClose,
  targetNetwork,
  transactionReceipts = {},
}: {
  block: Block | null;
  isOpen: boolean;
  onClose: () => void;
  targetNetwork: ChainWithAttributes;
  transactionReceipts?: { [key: string]: TransactionReceipt };
}) => {
  if (!block || !isOpen) return null;

  const blockDetails = [
    { label: "Block Number", value: block.number?.toString() || "Pending" },
    { label: "Hash", value: block.hash || "Pending", isCode: true },
    { label: "Parent Hash", value: block.parentHash, isCode: true },
    { label: "Miner", value: block.miner, isAddress: true },
    {
      label: "Timestamp",
      value: block.timestamp ? new Date(Number(block.timestamp) * 1000).toLocaleString() : "Pending",
    },
    { label: "Transactions", value: Array.isArray(block.transactions) ? block.transactions.length : 0 },
    { label: "Gas Used", value: block.gasUsed.toString() },
    { label: "Gas Limit", value: block.gasLimit.toString() },
    {
      label: "Base Fee Per Gas",
      value: block.baseFeePerGas ? formatEther(block.baseFeePerGas) + " " + targetNetwork.nativeCurrency.symbol : "0",
    },
    { label: "Difficulty", value: block.difficulty.toString() },
    { label: "Total Difficulty", value: block.totalDifficulty?.toString() || "0" },
    { label: "Size", value: `${block.size} bytes` },
    { label: "State Root", value: block.stateRoot, isCode: true },
    { label: "Nonce", value: block.nonce || "0x0" },
    { label: "Extra Data", value: block.extraData, isCode: true },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          aria-hidden="true"
          onClick={onClose}
        ></div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">
          &#8203;
        </span>

        <div className="inline-block align-bottom bg-base-100 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-base-100 px-4 pt-5 pb-4 sm:p-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg leading-6 font-medium">Block #{block.number?.toString() || "Pending"}</h3>
              <button type="button" className="text-gray-400 hover:text-gray-500 focus:outline-none" onClick={onClose}>
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="mt-4 max-h-[70vh] overflow-y-auto">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Overview</h4>
                  <div className="space-y-4">
                    {blockDetails.map((detail, index) => (
                      <div key={index} className="grid grid-cols-3 gap-4">
                        <div className="text-sm font-medium text-gray-500">{detail.label}</div>
                        <div className="col-span-2 break-all">
                          {detail.isAddress ? (
                            <Address address={detail.value as `0x${string}`} size="sm" />
                          ) : detail.isCode ? (
                            <code className="bg-base-200 px-2 py-1 rounded text-sm break-all">
                              {detail.value as string}
                            </code>
                          ) : (
                            <span className="break-all">{detail.value as string}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {Array.isArray(block.transactions) && block.transactions.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-medium mb-4">Transactions ({block.transactions.length})</h4>
                    <div className="overflow-x-auto">
                      <table className="table w-full">
                        <thead>
                          <tr>
                            <th>Txn Hash</th>
                            <th>From</th>
                            <th>To</th>
                            <th className="text-right">Value</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(block.transactions as TransactionWithFunction[]).map(tx => {
                            const receipt = transactionReceipts[tx.hash];
                            return (
                              <tr key={tx.hash} className="hover">
                                <td className="py-2">
                                  <TransactionHash hash={tx.hash} />
                                </td>
                                <td className="py-2">
                                  <Address address={tx.from} size="sm" onlyEnsOrAddress />
                                </td>
                                <td className="py-2">
                                  {!receipt?.contractAddress ? (
                                    tx.to ? (
                                      <Address address={tx.to} size="sm" onlyEnsOrAddress />
                                    ) : (
                                      <span>Contract Creation</span>
                                    )
                                  ) : (
                                    <div className="relative">
                                      <Address address={receipt.contractAddress} size="sm" onlyEnsOrAddress />
                                      <small className="text-xs text-gray-500">(Contract Creation)</small>
                                    </div>
                                  )}
                                </td>
                                <td className="text-right py-2">
                                  {formatEther(tx.value)} {targetNetwork.nativeCurrency.symbol}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="bg-base-200 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary text-base font-medium text-white hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const BlocksTable = ({ blocks, transactionReceipts }: TransactionsTableProps) => {
  const { targetNetwork } = useTargetNetwork();
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleBlockClick = (block: Block) => {
    setSelectedBlock(block);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col px-4 md:px-0">
      <div className="overflow-x-auto w-full shadow-2xl rounded-xl">
        <table className="table text-xl bg-base-100 table-zebra w-full md:table-md table-sm">
          <thead>
            <tr className="rounded-xl text-sm text-base-content">
              <th className="bg-primary text-white">Block</th>
              <th className="bg-primary text-white">Age</th>
              <th className="bg-primary text-white">Txn</th>
              <th className="bg-primary text-white">Miner</th>
              <th className="bg-primary text-white">Gas Used</th>
              <th className="bg-primary text-white">Gas Limit</th>
              <th className="bg-primary text-end text-white">Base Fee ({targetNetwork.nativeCurrency.symbol})</th>
            </tr>
          </thead>
          <tbody>
            {blocks.map(block => {
              const transactionCount = Array.isArray(block.transactions) ? block.transactions.length : 0;
              return (
                <BlockRow
                  key={block.number?.toString() || "pending"}
                  block={block}
                  transactionCount={transactionCount}
                  onBlockClick={handleBlockClick}
                  targetNetwork={targetNetwork}
                />
              );
            })}
          </tbody>
        </table>
      </div>

      {selectedBlock && (
        <BlockDetailModal
          block={selectedBlock}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          targetNetwork={targetNetwork}
          transactionReceipts={transactionReceipts}
        />
      )}
    </div>
  );
};

// Helper component to display a row for a block
const BlockRow = ({
  block,
  transactionCount,
  onBlockClick,
  targetNetwork,
}: {
  block: Block;
  transactionCount: number;
  onBlockClick: (block: Block) => void;
  targetNetwork: ChainWithAttributes;
}) => {
  const timeMined = block.timestamp ? new Date(Number(block.timestamp) * 1000) : new Date();
  const formattedTime = formatDistanceToNow(timeMined, { addSuffix: true });

  return (
    <tr className="hover text-sm">
      <td className="w-1/12 md:py-4">
        <button
          className="text-blue-500 hover:underline cursor-pointer bg-transparent border-none p-0 m-0 text-left"
          onClick={e => {
            e.stopPropagation();
            onBlockClick(block);
          }}
        >
          {block.number?.toString() || "Pending"}
        </button>
      </td>
      <td className="w-2/12 md:py-4">{formattedTime}</td>
      <td className="w-2/12 md:py-4">
        <div className="flex items-center">
          <span className="badge badge-primary mr-2">{transactionCount}</span>
          {transactionCount === 1 ? "txn" : "txns"}
        </div>
      </td>
      <td className="w-2/12 md:py-4">
        <Address address={block.miner} size="sm" onlyEnsOrAddress />
      </td>
      <td className="w-2/12 md:py-4 text-sm">{block.gasUsed.toString()}</td>
      <td className="w-2/12 md:py-4 text-sm">{block.gasLimit.toString()}</td>
      <td className="text-right md:py-4 text-sm">
        {block.baseFeePerGas ? `${formatEther(block.baseFeePerGas)} ${targetNetwork.nativeCurrency.symbol}` : "0"}
      </td>
    </tr>
  );
};
