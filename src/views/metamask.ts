import { MetaMaskSDK } from '@metamask/sdk';
import Web3 from 'web3';

declare global {
  interface Window {
    ethereum?: any;
  }
}

const MMSDK = new MetaMaskSDK();
const provider = MMSDK.getProvider();


const KAIA_RPC_URL = "https://public-en.node.kaia.io"; // 替换为 Kaia 链的实际 RPC URL
const web3Kaia = new Web3(new Web3.providers.HttpProvider(KAIA_RPC_URL));

const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';

const usdtABI = [
  {
    "constant": false,
    "inputs": [
      { "name": "spender", "type": "address" },
      { "name": "amount", "type": "uint256" }
    ],
    "name": "approve",
    "outputs": [{ "name": "", "type": "bool" }],
    "type": "function"
  }
];

/**
 * 调用 USDT 合约的 approve 方法（Kaia 链）
 * @param contractAddress USDT 合约地址
 * @param spenderAddress 授权的目标地址（DApp 或智能合约）
 */
export const approveUSDT = async (contractAddress: string, spenderAddress: string): Promise<void> => {
  if (!window.ethereum) {
    throw new Error("MetaMask 未安装或未启用 Ethereum API");
  }

  try {
    // 切换到 Kaia 链
    await window.ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: 8217 }] // Kaia 链的 Chain ID (示例: 9000, 0x2328)
    });
  } catch (switchError) {
    console.error("切换到 Kaia 链失败:", switchError);
    throw switchError;
  }

  const contract = new web3Kaia.eth.Contract(usdtABI, contractAddress);

  try {
    const accounts: string[] = await window.ethereum.request({ method: 'eth_requestAccounts' });  // 让用户授权钱包
    if (!accounts || accounts.length === 0) {
      throw new Error("用户未授权 MetaMask");
    }

    const sender: string = accounts[0];  // 获取授权地址

    const tx = await contract.methods.approve(spenderAddress, MAX_UINT256).send({
      from: sender,
      gas: "200000"
    });

    console.log("USDT 授权交易哈希:", tx.transactionHash);
  } catch (error) {
    console.error("USDT 授权失败:", error);
    throw error;
  }
};
