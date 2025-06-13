const { buildModule } = require("@nomicfoundation/hardhat-ignition/modules");

const UniswapV2FactoryModule = buildModule("UniswapV2FactoryModule", m => {
  const deployer = m.getAccount(0);

  const weth = m.getParameter("WETH", "0x28c09c396D3c54B2c5f4fC571f562be66bF43776");

  const factory = m.contract("UniswapV2Factory", [deployer]);

  const router = m.contract("UniswapV2Router02", [factory, weth]);

  return {
    weth,
    factory,
    router,
  };
});

module.exports = UniswapV2FactoryModule;
