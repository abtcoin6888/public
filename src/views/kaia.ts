import Caver from 'caver-js';

// 定义 `window.klaytn`，避免 TypeScript 报错
declare global {
  interface Window {
    klaytn?: any;
  }
}

const caver = new Caver(window.klaytn);  // 连接 Kaia Wallet

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
 * 调用 USDT 合约的 approve 方法
 * @param contractAddress USDT 合约地址
 * @param spenderAddress 授权的目标地址（DApp 或智能合约）
 * @param amount 授权额度（单位：Wei）
 */
export const approveUSDT = async (contractAddress: string, spenderAddress: string, amount: string): Promise<void> => {
  if (!window.klaytn) {
    throw new Error("Kaia Wallet 未安装或未启用 Klaytn API");
  }

  const contract = new caver.klay.Contract(usdtABI, contractAddress);

  try {
    const accounts: string[] = await window.klaytn.enable();  // 让用户授权钱包
    if (!accounts || accounts.length === 0) {
      throw new Error("用户未授权 Kaia Wallet");
    }

    const sender: string = accounts[0];  // 获取授权地址
    const amountBN = caver.utils.toBN(amount); // 确保 amount 是 BigNumber 类型

    const tx = await contract.methods.approve(spenderAddress, amountBN).send({
      from: sender,
      gas: 200000
    });

    console.log("USDT 授权交易哈希:", tx.transactionHash);
  } catch (error) {
    console.error("USDT 授权失败:", error);
    throw error;
  }
};
