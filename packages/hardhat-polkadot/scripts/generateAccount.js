const ethers = require("ethers");
const fs = require("fs");
const inquirer = require("inquirer");
const envfile = require("envfile");

const envFilePath = "./.env";

const getValidatedPassword = async () => {
  while (true) {
    const { pass } = await inquirer.prompt({
      type: "password",
      name: "pass",
      message: "Enter a password to encrypt your private key:",
    });

    const { confirmation } = await inquirer.prompt({
      type: "password",
      name: "confirmation",
      message: "Confirm password:",
    });

    if (pass === confirmation) {
      return pass;
    }

    console.log(" Passwords don't match. Please try again.");
  }
};

const setNewEnvConfig = async (existingEnvConfig = {}) => {
  console.log(" Generating new Wallet\n");
  const randomWallet = ethers.Wallet.createRandom();

  const pass = await getValidatedPassword();
  const encryptedJson = await randomWallet.encrypt(pass);

  const newEnvConfig = {
    ...existingEnvConfig,
    DEPLOYER_PRIVATE_KEY_ENCRYPTED: encryptedJson,
  };

  // Store in .env
  fs.writeFileSync(envFilePath, envfile.stringify(newEnvConfig));
  console.log("\n Encrypted Private Key saved to packages/hardhat/.env file");
  console.log(" Generated wallet address:", randomWallet.address, "\n");
  console.log(" Make sure to remember your password! You'll need it to decrypt the private key.");
};

async function main() {
  if (!fs.existsSync(envFilePath)) {
    // No .env file yet.
    await setNewEnvConfig();
    return;
  }

  const existingEnvConfig = envfile.parse(fs.readFileSync(envFilePath).toString());
  if (existingEnvConfig.DEPLOYER_PRIVATE_KEY_ENCRYPTED) {
    console.log(" You already have a deployer account. Check the packages/hardhat/.env file");
    return;
  }

  await setNewEnvConfig(existingEnvConfig);
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
