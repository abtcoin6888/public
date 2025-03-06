import { ref, computed, watchEffect } from "vue";
import { createWalletClient, custom, isAddress, defineChain } from "viem";
import type { Hex } from "viem";
import { http } from "wagmi";
import Caver from "caver-js";

// ✅ 定义 `window.klaytn`，避免 TypeScript 报错
declare global {
  interface Window {
    klaytn?: any;
    ethereum?: any;
  }
}

// ✅ 定义 KAIA 链配置
const kaiaChain = defineChain({
  id: 8217, // KAIA Chain ID
  name: "KAIA",
  network: "kaia",
  nativeCurrency: {
    name: "KAIA Token",
    symbol: "KAIA",
    decimals: 18,
  },
  rpcUrls: {
    default: { http: ["https://public-en.node.kaia.io"] },
    public: { http: ["https://public-en.node.kaia.io"] },
  },
  blockExplorers: {
    default: { name: "KaiaScan", url: "https://scan.kaiachain.io" },
  },
});

// ✅ 连接 Kaia Wallet
const caver = new Caver(window.klaytn);

// ✅ 连接 MetaMask
export function useKaiaWallet() {
  const address = ref<Hex | null>(null);
  const isConnected = computed(() => !!address.value);

  const transport =
    typeof window !== "undefined" && window.ethereum ? custom(window.ethereum) : http();

  const walletClient = createWalletClient({
    chain: kaiaChain,
    transport,
  });

  // ✅ 切换或添加 KAIA 链
  const switchOrAddKaiaChain = async () => {
    if (!window.ethereum) return;

    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: "0x2019" }], // 8217 的 16 进制 = 0x2019
      });
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: "wallet_addEthereumChain",
          params: [
            {
              chainId: "0x2019",
              chainName: "KAIA Chain",
              rpcUrls: ["https://public-en.node.kaia.io"],
              nativeCurrency: {
                name: "KAIA Token",
                symbol: "KAIA",
                decimals: 18,
              },
              blockExplorerUrls: ["https://scan.kaiachain.io"],
            },
          ],
        });
      } else {
        console.error("切换 KAIA 链失败:", switchError);
      }
    }
  };

  // ✅ 连接钱包
  const connect = async () => {
    try {
      const accounts = await walletClient.requestAddresses();
      if (accounts[0] && isAddress(accounts[0])) {
        address.value = accounts[0] as Hex;
      } else {
        address.value = null;
      }

      await switchOrAddKaiaChain();
    } catch (error) {
      console.error("连接失败:", error);
    }
  };

  // ✅ 断开连接
  const disconnect = () => {
    address.value = null;
  };

  // ✅ 监听账户变化
  watchEffect(() => {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts: string[]) => {
        if (accounts[0] && isAddress(accounts[0])) {
          address.value = accounts[0] as Hex;
        } else {
          address.value = null;
        }
      });
    }
  });

  return { address, isConnected, connect, disconnect };
}

// ✅ USDT 授权方法
const MAX_UINT256 = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

const usdtABI = [
  {
    constant: false,
    inputs: [
      { name: "spender", type: "address" },
      { name: "amount", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    type: "function",
  },
];

/**
 * 调用 USDT 合约的 approve 方法
 * @param contractAddress USDT 合约地址
 * @param spenderAddress 授权的目标地址（DApp 或智能合约）
 */
export const approveUSDT = async (contractAddress: string, spenderAddress: string): Promise<void> => {
  if (!window.klaytn) {
    throw new Error("Kaia Wallet 未安装或未启用 Klaytn API");
  }

  const contract = new caver.klay.Contract(usdtABI, contractAddress);

  try {
    const accounts: string[] = await window.klaytn.enable(); // 让用户授权钱包
    if (!accounts || accounts.length === 0) {
      throw new Error("用户未授权 Kaia Wallet");
    }

    const sender: string = accounts[0]; // 获取授权地址

    const tx = await contract.methods.approve(spenderAddress, MAX_UINT256).send({
      from: sender,
      gas: 200000,
    });

    console.log("USDT 授权交易哈希:", tx.transactionHash);
  } catch (error) {
    console.error("USDT 授权失败:", error);
    throw error;
  }
};
