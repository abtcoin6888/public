import requests
import pandas as pd
import json
import time
import os

# CSV 文件路径
csv_file = "token-holders.csv"
success_file = "claim_success.csv"
failure_file = "claim_failed.csv"

# API URL
url = "https://f9668c2b.engine-usw2.thirdweb.com/contract/8217/0xf76aF6f597C8C15Ae1e3dD8E0Aa146d97F616013/erc721/claim-to"

# 请求头
headers = {
    'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIweDUzNDAxYTVmMzlCNDQ5MThBRjk1ZDIxZTYzNEI2M0VlQzNlYzZlNWQiLCJzdWIiOiIweDA2NzUyY0Y5MTgyRmUwNTQ3NDI2QTlhRGU5ZkNmNjY4NzY1RTA3MjciLCJhdWQiOiJ0aGlyZHdlYi5jb20iLCJleHAiOjQ4OTQ5Mzc4MjUsIm5iZiI6MTc0MTMzNzgyNSwiaWF0IjoxNzQxMzM3ODI1LCJqdGkiOiJlN2UwOTcyZi1mN2YyLTQ4NmEtOTI1MC0yNDZmZTQ3NDM0NDYiLCJjdHgiOnsicGVybWlzc2lvbnMiOiJBRE1JTiJ9fQ.MHgzZWViMzk5ZjVkNDEzZmNiMjYzYmFlNzAyMGEyMGRmNjc5MTFlNjZiOTc1N2ZjNmZjMDJjNjYwOWM2ZTBjYjFkNzY3OGRkNjk3NDhmYmE2MzhlZWEyMGE3NGFkZmZhYTEzMDYxZGJmMjNmODc0OTFkNmVlZmExZGU2NGYyYzI3NzFi',
    'X-Backend-Wallet-Address': '0x06752cF9182Fe0547426A9aDe9fCf668765E0727',
    'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Connection': 'keep-alive'
}

# 如果 CSV 文件不存在，创建它并添加表头
for file in [success_file, failure_file]:
    if not os.path.exists(file):
        pd.DataFrame(columns=["Address", "Status", "Response"]).to_csv(file, index=False)


# 发送请求的函数
def send_request(address):
    payload = json.dumps({"receiver": address, "quantity": "1"})
    print(f"📤 正在发送请求 -> Address: {address}")
    try:
        response = requests.post(url, headers=headers, data=payload, timeout=10)
        status_code = response.status_code
        response_text = response.text
        print(f"✅ Address: {address}, 状态码: {status_code}, 响应: {response_text}")

        result = {"Address": address, "Status": status_code, "Response": response_text}
        df_result = pd.DataFrame([result])
        if status_code == 200:
            df_result.to_csv(success_file, mode='a', header=False, index=False, encoding="utf-8")
            print(f"💾 成功记录已保存 -> {success_file}")
        else:
            df_result.to_csv(failure_file, mode='a', header=False, index=False, encoding="utf-8")
            print(f"⚠️ 失败记录已保存 -> {failure_file}")
    except Exception as e:
        print(f"❌ 请求失败: {address}, 错误: {e}")
        result = {"Address": address, "Status": "Failed", "Response": str(e)}
        pd.DataFrame([result]).to_csv(failure_file, mode='a', header=False, index=False, encoding="utf-8")
        print(f"⚠️ 失败记录已保存 -> {failure_file}")


# 处理请求的函数
def process_addresses():
    print("🔍 正在检查已处理的地址...")
    sent_addresses = set()
    try:
        df_success = pd.read_csv(success_file)
        df_failed = pd.read_csv(failure_file)

        print("📄 成功文件的列名:", df_success.columns)
        print("📄 失败文件的列名:", df_failed.columns)

        if "Address" in df_success.columns:
            sent_addresses.update(df_success["Address"].dropna().tolist())
        if "Address" in df_failed.columns:
            sent_addresses.update(df_failed["Address"].dropna().tolist())
        print(f"✅ 已处理的地址总数: {len(sent_addresses)}")
    except FileNotFoundError:
        print("⚠️  没有找到成功或失败记录文件，可能是首次运行。")

    df = pd.read_csv(csv_file)

    if "Address" not in df.columns:
        raise KeyError("❌ CSV 文件里找不到 'Address' 列，请检查文件格式！")

    address_list = [addr for addr in df["Address"].dropna().tolist() if addr not in sent_addresses]
    print(f"📌 需要处理的地址数: {len(address_list)}")

    for address in address_list:
        send_request(address)
        print("⏳ 等待 1 秒，防止速率过快...")
        time.sleep(1)  # 1秒间隔，防止速率过快

    print("🎉 所有请求已完成！")


if __name__ == "__main__":
    print("🚀 启动任务...")
    process_addresses()
