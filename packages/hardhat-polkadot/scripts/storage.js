const hre = require("hardhat");

async function main() {
  const Storage = await hre.ethers.getContractFactory("Storage");
  const initialValue = 42;

  const storage = await Storage.deploy(initialValue);

  await storage.waitForDeployment();

  const contractAddress = await storage.getAddress();

  console.log("Storage deployed to:", contractAddress);

  const newNumber = 513; // 你希望设置的号码值
  const tx = await storage.setNumber(newNumber);

  await tx.wait();

  console.log(`Number set to ${newNumber} at contract: ${contractAddress}`);

  const currentNumber = await storage.storedNumber();

  console.log(`Current number in contract: ${currentNumber.toString()}`);
}

// 运行主函数
main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
