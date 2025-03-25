import requests
import pandas as pd
import json
import time
import os

# CSV 文件路径
csv_file = "token-holders.csv"
success_file = "claim_success.csv"
failure_file = "claim_failed.csv"

# 钱包地址池（轮流使用，避免 nonce 过低）
walletAddress = [
    "0x0311Dbb9D64B0d0c29AbA1672D73A35A0226a59C",
    "0x2278Dc5E5719423524DaE7095a5b65a85d16d305",
    "0x22a061AF1be1321eB173cF09EFb7dfA78f4B1aF4",
    "0x45e8edB5EAEc5b423EDEAAc85C443009767AbD2F",
    "0x4843709E73880F36d9D660B86dD45445fcd939CD",
    "0x677C2cC63C87ef49A497729cE9065bE1F287Ed99",
    "0x679ce4581727877c3c8Ba46cC274D54caA86E2C3",
    "0xa6920896F7525750b4Ad54baE5b53341B7d246a5",
    "0xFb93b332A7F7f1D7B83Ac1Be7A535E655e04d28b",
    "0xffFadF66391D39fB6D82971D47FB9B7f0F1EFa89"
]

# API URL
url = "https://f9668c2b.engine-usw2.thirdweb.com/contract/8217/0xf76aF6f597C8C15Ae1e3dD8E0Aa146d97F616013/erc721/claim-to"

# 请求头（部分参数会根据 `walletAddress` 变更）
headers_template = {
    'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIweDUzNDAxYTVmMzlCNDQ5MThBRjk1ZDIxZTYzNEI2M0VlQzNlYzZlNWQiLCJzdWIiOiIweDA2NzUyY0Y5MTgyRmUwNTQ3NDI2QTlhRGU5ZkNmNjY4NzY1RTA3MjciLCJhdWQiOiJ0aGlyZHdlYi5jb20iLCJleHAiOjQ4OTUyMDU1ODQsIm5iZiI6MTc0MTYwNTU4NCwiaWF0IjoxNzQxNjA1NTg0LCJqdGkiOiJjZjEzZTNkYi0zNTg0LTQ4MmEtYjI0My1hZWY0MGFhNjljMDgiLCJjdHgiOnsicGVybWlzc2lvbnMiOiJBRE1JTiJ9fQ.MHhiYzhhNDBhMmM5MmJjOTIxOWQ4YjBiNTQwODM5ZTZhNzI5MWM4OWU4ZWNjMmJmZTQ2ODk3NTE4N2RlYjkwZjU3NWJkMGNlYTU2ZDkzZTMyZTZlZjNmNzczYjBmMWVkYWZhZjYwMDhjYzc1YjllYjVlOTAxZDM1Mzk0ZDk5MTUxYzFi',
    'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Connection': 'keep-alive'
}

# 如果 CSV 文件不存在，创建它并添加表头
for file in [success_file, failure_file]:
    if not os.path.exists(file):
        pd.DataFrame(columns=["WalletAddress", "ClaimAddress", "Status", "Response"]).to_csv(file, index=False)


# 发送请求的函数
def send_request(address, wallet_index, retries=3):
    """ 轮流使用不同的钱包地址进行 Claim 交易 """
    wallet = walletAddress[wallet_index % len(walletAddress)]  # 轮流使用钱包
    payload = json.dumps({"receiver": address, "quantity": "1"})

    # 更新 `X-Backend-Wallet-Address`
    headers = headers_template.copy()
    headers['X-Backend-Wallet-Address'] = wallet

    print(f"📤 发送请求 -> 钱包: {wallet} | 目标地址: {address}")

    for attempt in range(retries):
        try:
            response = requests.post(url, headers=headers, data=payload, timeout=10)
            status_code = response.status_code
            response_text = response.text

            print(f"✅ 成功 | 钱包: {wallet} | 目标: {address} | 状态码: {status_code} | 响应: {response_text}")

            result = {"WalletAddress": wallet, "ClaimAddress": address, "Status": status_code, "Response": response_text}
            df_result = pd.DataFrame([result])

            if status_code == 200:
                df_result.to_csv(success_file, mode='a', header=False, index=False, encoding="utf-8")
                print(f"💾 成功记录已保存 -> {success_file}")
            else:
                df_result.to_csv(failure_file, mode='a', header=False, index=False, encoding="utf-8")
                print(f"⚠️ 失败记录已保存 -> {failure_file}")

            return  # 交易成功，退出循环

        except Exception as e:
            print(f"❌ 请求失败: {address} | 钱包: {wallet} | 错误: {e}")

            if attempt < retries - 1:
                print(f"🔄 等待 3 秒后重试 ({attempt + 1}/{retries})...")
                time.sleep(3)
            else:
                result = {"WalletAddress": wallet, "ClaimAddress": address, "Status": "Failed", "Response": str(e)}
                pd.DataFrame([result]).to_csv(failure_file, mode='a', header=False, index=False, encoding="utf-8")
                print(f"⚠️ 最终失败记录已保存 -> {failure_file}")


# 处理请求的函数
def process_addresses():
    """ 读取 CSV 记录并发送 Claim 交易 """
    print("🔍 检查已处理的地址...")
    sent_addresses = set()

    try:
        df_success = pd.read_csv(success_file)
        df_failed = pd.read_csv(failure_file)

        print("📄 成功文件的列名:", df_success.columns)
        print("📄 失败文件的列名:", df_failed.columns)

        if "ClaimAddress" in df_success.columns:
            sent_addresses.update(df_success["ClaimAddress"].dropna().tolist())
        if "ClaimAddress" in df_failed.columns:
            sent_addresses.update(df_failed["ClaimAddress"].dropna().tolist())

        print(f"✅ 已处理地址总数: {len(sent_addresses)}")
    except FileNotFoundError:
        print("⚠️  没有找到成功或失败记录文件，可能是首次运行。")

    df = pd.read_csv(csv_file)

    if "Address" not in df.columns:
        raise KeyError("❌ CSV 文件里找不到 'Address' 列，请检查文件格式！")

    address_list = [addr for addr in df["Address"].dropna().tolist() if addr not in sent_addresses]
    print(f"📌 需要处理的地址数: {len(address_list)}")

    # 轮流使用钱包地址
    wallet_index = 0

    # for address in address_list:
    #     send_request(address, wallet_index)
    #     wallet_index += 1  # 切换下一个钱包地址
    #     print(f"请求完成，正在发送第{address.index}条数据")
    #     # time.sleep(1)  # 1 秒间隔，防止速率过快
    for idx, address in enumerate(address_list, start=1):
        send_request(address, wallet_index)
        wallet_index += 1  # 切换下一个钱包地址
        print(f"请求完成，正在发送第{idx}条数据")

    print("🎉 所有请求已完成！")


if __name__ == "__main__":
    print("🚀 启动任务...")
    process_addresses()
