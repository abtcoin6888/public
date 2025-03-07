import requests
import pandas as pd
import json
import time  # 添加请求间隔，防止 API 速率限制

# CSV 文件路径
csv_file = "filtered_addresses.csv"

# 读取 CSV 文件
df = pd.read_csv(csv_file)

# API URL
url = "https://f9668c2b.engine-usw2.thirdweb.com/contract/8217/0xf76aF6f597C8C15Ae1e3dD8E0Aa146d97F616013/erc721/claim-to"

# 请求头
headers = {
    'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIweDUzNDAxYTVmMzlCNDQ5MThBRjk1ZDIxZTYzNEI2M0VlQzNlYzZlNWQiLCJzdWIiOiIweDA2NzUyY0Y5MTgyRmUwNTQ3NDI2QTlhRGU5ZkNmNjY4NzY1RTA3MjciLCJhdWQiOiJ0aGlyZHdlYi5jb20iLCJleHAiOjQ4OTQ5Mzc4MjUsIm5iZiI6MTc0MTMzNzgyNSwiaWF0IjoxNzQxMzM3ODI1LCJqdGkiOiJlN2UwOTcyZi1mN2YyLTQ4NmEtOTI1MC0yNDZmZTQ3NDM0NDYiLCJjdHgiOnsicGVybWlzc2lvbnMiOiJBRE1JTiJ9fQ.MHgzZWViMzk5ZjVkNDEzZmNiMjYzYmFlNzAyMGEyMGRmNjc5MTFlNjZiOTc1N2ZjNmZjMDJjNjYwOWM2ZTBjYjFkNzY3OGRkNjk3NDhmYmE2MzhlZWEyMGE3NGFkZmZhYTEzMDYxZGJmMjNmODc0OTFkNmVlZmExZGU2NGYyYzI3NzFi',
    'X-Backend-Wallet-Address': '0x06752cF9182Fe0547426A9aDe9fCf668765E0727',
    'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Host': 'f9668c2b.engine-usw2.thirdweb.com',
    'Connection': 'keep-alive'
}


# 发送请求的同步函数
def send_request(address):
    payload = json.dumps({"receiver": address, "quantity": "1"})
    try:
        response = requests.post(url, headers=headers, data=payload, timeout=10)
        print(f"Address: {address}, 状态码: {response.status_code}, 响应: {response.text}")
        return response.status_code, response.text
    except requests.exceptions.RequestException as e:
        print(f"⚠️  请求失败: {address}, 错误: {e}")
        return None, str(e)


# 遍历 CSV 文件并发送请求
results = []
for index, row in df.iterrows():
    address = row["Address"]
    status, response = send_request(address)
    results.append({"Address": address, "Status": status, "Response": response})

    time.sleep(0.5)  # 添加 2 秒延迟，防止 API 速率限制（可调整）

# 结果保存到 CSV 文件
output_file = "claim_results.csv"
df_results = pd.DataFrame(results)
df_results.to_csv(output_file, index=False, encoding="utf-8")

print(f"✅ 处理完成，已保存结果到 {output_file}")
