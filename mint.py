import requests
import json
import time  # 用于添加延迟，防止请求过快导致 API 限制

url = "https://f9668c2b.engine-usw2.thirdweb.com/contract/8217/0xf76aF6f597C8C15Ae1e3dD8E0Aa146d97F616013/erc721/lazy-mint"

# 读取 JSON 文件
with open('mint.json', 'r', encoding='utf-8') as file:
    json_data = json.load(file)
    payload = json.dumps(json_data)

# 请求头
headers = {
    'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIweDUzNDAxYTVmMzlCNDQ5MThBRjk1ZDIxZTYzNEI2M0VlQzNlYzZlNWQiLCJzdWIiOiIweDA2NzUyY0Y5MTgyRmUwNTQ3NDI2QTlhRGU5ZkNmNjY4NzY1RTA3MjciLCJhdWQiOiJ0aGlyZHdlYi5jb20iLCJleHAiOjQ4OTQ5Mzc4MjUsIm5iZiI6MTc0MTMzNzgyNSwiaWF0IjoxNzQxMzM3ODI1LCJqdGkiOiJlN2UwOTcyZi1mN2YyLTQ4NmEtOTI1MC0yNDZmZTQ3NDM0NDYiLCJjdHgiOnsicGVybWlzc2lvbnMiOiJBRE1JTiJ9fQ.MHgzZWViMzk5ZjVkNDEzZmNiMjYzYmFlNzAyMGEyMGRmNjc5MTFlNjZiOTc1N2ZjNmZjMDJjNjYwOWM2ZTBjYjFkNzY3OGRkNjk3NDhmYmE2MzhlZWEyMGE3NGFkZmZhYTEzMDYxZGJmMjNmODc0OTFkNmVlZmExZGU2NGYyYzI3NzFi',
    'X-Backend-Wallet-Address': '0x06752cF9182Fe0547426A9aDe9fCf668765E0727',
    'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
    'Content-Type': 'application/json',
    'Accept': '*/*',
    'Host': 'f9668c2b.engine-usw2.thirdweb.com',
    'Connection': 'keep-alive',
    'Cookie': '_cfuvid=.8rry8oK72i.z8lcA244MszHGcd6n.3lBY12JTsPR9o-1741339656627-0.0.1.1-604800000'
}

# 执行 100 次
for i in range(10):
    response = requests.post(url, headers=headers, data=payload)

    print(f"第 {i + 1} 次请求，状态码: {response.status_code}")
    print(response.text)  # 打印返回结果

    # 可选：添加延迟，防止被 API 限制（如 0.5 秒）
    # time.sleep(0.5)
