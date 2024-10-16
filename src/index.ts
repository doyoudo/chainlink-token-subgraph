import { ethers } from 'ethers';

const ETHERSCAN_API_KEY = 'IB1SGVHDQRNBUBYJ411ARMS2BRRZZGN31w';
const SEPOLIA_RPC_URL = 'https://eth-sepolia.g.alchemy.com/v2/qCq0-jHSTNg66PeB94QMsG0yOa8k2JVP';
const tokenAddress = '0x779877a7b0d9e8603169ddbd7836e478b4624789';

const ERC20_ABI = [
  "function name() view returns (string)",
  "function symbol() view returns (string)",
  "function decimals() view returns (uint8)",
  "function totalSupply() view returns (uint256)",
  "function balanceOf(address) view returns (uint256)",
];

async function getContractInfo(address: string) {
  const provider = new ethers.providers.JsonRpcProvider(SEPOLIA_RPC_URL);

  console.log('检查地址...');
  const code = await provider.getCode(address);
  if (code === '0x') {
    console.log('该地址不是合约地址');
    return;
  }

  console.log('该地址是合约地址');
  console.log('合约字节码:', code);

  const balance = await provider.getBalance(address);
  console.log('合约余额:', ethers.utils.formatEther(balance), 'ETH');

  // 尝试使用通用 ERC20 ABI 与合约交互
  const contract = new ethers.Contract(address, ERC20_ABI, provider);

  try {
    const name = await contract.name();
    const symbol = await contract.symbol();
    const decimals = await contract.decimals();
    const totalSupply = await contract.totalSupply();

    console.log('代币名称:', name);
    console.log('代币符号:', symbol);
    console.log('小数位数:', decimals);
    console.log('总供应量:', ethers.utils.formatUnits(totalSupply, decimals));
  } catch (error: any) {
    console.error('获取代币信息时出错:', error.message);
  }
}

getContractInfo(tokenAddress);
