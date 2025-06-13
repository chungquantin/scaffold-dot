const { ethers } = require("ethers");
const { parse, stringify } = require("envfile");
const fs = require("fs");
const password = require("@inquirer/password").default;

const envFilePath = "./.env";

const getValidatedPassword = async () => {
  while (true) {
    const pass = await password({ message: "Enter a password to encrypt your private key:" });
    const confirmation = await password({ message: "Confirm password:" });

    if (pass === confirmation) {
      return pass;
    }
    console.log("❌ Passwords don't match. Please try again.");
  }
};

const getWalletFromPrivateKey = async () => {
  while (true) {
    const privateKey = await password({ message: "Paste your private key:" });
    try {
      const wallet = new ethers.Wallet(privateKey);
      return wallet;
    } catch (e) {
      console.log("❌ Invalid private key format. Please try again.");
    }
  }
};

const setNewEnvConfig = async (existingEnvConfig = {}) => {
  console.log("👛 Importing Wallet\n");

  const wallet = await getWalletFromPrivateKey();
  const pass = await getValidatedPassword();
  const encryptedJson = await wallet.encrypt(pass);

  const newEnvConfig = {
    ...existingEnvConfig,
    DEPLOYER_PRIVATE_KEY_ENCRYPTED: encryptedJson,
  };

  // Store in .env
  fs.writeFileSync(envFilePath, stringify(newEnvConfig));
  console.log("\n📄 Encrypted Private Key saved to packages/hardhat/.env file");
  console.log("🪄 Imported wallet address:", wallet.address, "\n");
  console.log("⚠️ Make sure to remember your password! You'll need it to decrypt the private key.");
};

async function main() {
  // Read .env file if it exists
  let existingEnvConfig = {};
  try {
    if (fs.existsSync(envFilePath)) {
      existingEnvConfig = parse(fs.readFileSync(envFilePath, "utf8"));
    }
  } catch (error) {
    console.error("Error reading .env file:", error);
    process.exit(1);
  }

  await setNewEnvConfig(existingEnvConfig);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

// For testing purposes
module.exports = {
  getValidatedPassword,
  getWalletFromPrivateKey,
  setNewEnvConfig,
};
