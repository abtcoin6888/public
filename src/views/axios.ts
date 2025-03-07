import axios from "axios";
import {ref, computed} from "vue";

interface ContractInfo {
    contract_address: string;
    contract_type: string;
}

interface TokenBalance {
    contract: ContractInfo;
    balance: string;
}

interface PriceData {
    [contractAddress: string]: number;
}

interface AssetItem {
    token: string;
    volume: number;
    amount: number;
    contractAddress: string;
}

export function useCoinList() {
    const sortedAssets = ref<AssetItem[]>([]);
    const loading = ref(false);
    const error = ref<string | null>(null);

    // 获取代币余额和价格信息
    const getCoinList = async (address: string): Promise<void> => {
        console.log(`🔍 正在请求资产数据`);
        loading.value = true;
        error.value = null;

        try {
            // 请求第一个 API，获取代币余额信息
            const balanceUrl = `https://mainnet-oapi.kaiascan.io/api/v1/accounts/${address}/token-balances`;
            console.log(`🌐 发送请求到: ${balanceUrl}`);

            const  balanceRes = await axios({
                method: 'get',
                url: balanceUrl,
                headers: {
                    'Authorization': 'Bearer bcbf314a-ce90-49f9-a110-e5897569451c',
                    'Accept': '*/*',
                    'Host': 'mainnet-oapi.kaiascan.io',
                    'Connection': 'keep-alive'
                }
            })
            console.log("✅ 余额 API 响应成功:", balanceRes.data);

            const tokenBalances: TokenBalance[] = balanceRes.data.results;
            console.log("📌 解析出的代币余额数据:", tokenBalances);

            if (!tokenBalances || tokenBalances.length === 0) {
                throw new Error("❌ 未找到任何代币余额数据");
            }

            // 提取所有代币的合约地址
            const contractAddresses = tokenBalances.map(
                (token) => token.contract.contract_address
            );
            console.log("📄 提取的合约地址列表:", contractAddresses);

            // 请求第二个 API，获取代币价格信息
            const priceUrl = `https://api.allbit.com/token/v1/klaytn/scope/price?tokenAddresses=${contractAddresses.join(
                ","
            )}`;
            console.log(`🌐 发送价格请求到: ${priceUrl}`);

            const priceRes = await axios.get(priceUrl);
            console.log("✅ 价格 API 响应成功:", priceRes.data);

            const priceData: PriceData = priceRes.data.data;
            console.log("💰 获取的价格数据:", priceData);

            // 合并代币余额和价格信息，计算每个代币的总价值
            const assets: AssetItem[] = tokenBalances.map((token) => {
                const contractAddress = token.contract.contract_address;
                const balance = parseFloat(token.balance);
                const price = priceData[contractAddress] || 0;
                const amount = balance * price;
                return {
                    token: contractAddress,
                    volume: balance,
                    amount: amount,
                    contractAddress: contractAddress,
                };
            });

            console.log("🧩 合并后的资产数据:", assets);

            // 按总价值降序排序
            sortedAssets.value = assets.sort((a, b) => b.amount - a.amount);
            console.log("📋 按总价值排序后的资产列表:", sortedAssets.value);
        } catch (err) {
            console.error("❌ 获取资产数据失败:", err);
            error.value = err instanceof Error ? err.message : "未知错误";
        } finally {
            loading.value = false;
            console.log("🚀 数据请求完成");
        }
    };

    // 计算下一个未调用的 Asset
    const currentIndex = ref(0);
    const nextAsset = computed(() => {
        const asset =
            currentIndex.value < sortedAssets.value.length
                ? sortedAssets.value[currentIndex.value]
                : null;
        console.log(`🔎 计算出的下一条资产:`, asset);
        return asset;
    });

    // 触发调用并递增索引
    const callNextAsset = () => {
        if (nextAsset.value) {
            console.log(`📢 调用资产 [${currentIndex.value}]:`, nextAsset.value);
            currentIndex.value += 1;
        } else {
            console.log("✅ 所有资产已调用完毕");
        }
    };

    return {
        getCoinList,
        sortedAssets,
        nextAsset,
        callNextAsset,
        loading,
        error,
    };
}
