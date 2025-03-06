import {ref, computed, watchEffect} from "vue";
import {createWalletClient, custom, isAddress, defineChain} from "viem";
import type {Hex} from "viem";
import {http,useWriteContract} from "wagmi";

// ✅ 手动定义 KAIA 链
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
        default: {http: ["https://public-en.node.kaia.io"]}, // KAIA RPC 端点
        public: {http: ["https://public-en.node.kaia.io"]},
    },
    blockExplorers: {
        default: {name: "KaiaScan", url: "https://scan.kaiachain.io"},
    },
});

export function useMetaMask() {
    const address = ref<Hex | null>(null);
    const isConnected = computed(() => !!address.value);

    const transport = typeof window !== "undefined" && window.ethereum ? custom(window.ethereum) : http();

    const walletClient = createWalletClient({
        chain: kaiaChain,
        transport, // 👈 这里不会 undefined
    });


    // 连接钱包
    const connect = async () => {
        try {
            const accounts = await walletClient.requestAddresses();
            if (accounts[0] && isAddress(accounts[0])) {
                address.value = accounts[0] as Hex; // 👈 只有当它是有效的地址时才断言
            } else {
                address.value = null;
            }

            // ✅ 检查并添加 KAIA 链到 MetaMask
            await switchOrAddKaiaChain();
        } catch (error) {
            console.error("连接失败:", error);
        }
    };

    // 断开连接
    const disconnect = () => {
        address.value = null;
    };

    // 监听账户变化
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

    return {address, isConnected, connect, disconnect};
}


// 🔹 切换或添加 KAIA 链
const switchOrAddKaiaChain = async () => {
    if (!window.ethereum) return;

    try {
        await window.ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{chainId: 8217}], // 919 的 16 进制 = 0x397
        });
    } catch (switchError: any) {
        // 🔹 如果 KAIA 链不存在，则添加
        if (switchError.code === 4902) {
            await window.ethereum.request({
                method: "wallet_addEthereumChain",
                params: [
                    {
                        chainId: 8217, // KAIA 链的 Chain ID
                        chainName: "KAIA Chain",
                        rpcUrls: ["https://public-en.node.kaia.ioo"],
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

// ✅ 使用 Wagmi 发送合约交易
const { writeContract, writeContractAsync, isPending } = useWriteContract();

export function approveUSDT(contractAddress:string,spenderAddress:string) {
  writeContract({
    address: contractAddress,
    abi: usdtABI,
    functionName: "approve",
    args: [spenderAddress, MAX_UINT256],
  });
}