import requests
import json

url = "https://f9668c2b.engine-usw2.thirdweb.com/contract/8217/0x0622a3bf0570dD3947D95EffC6223251883c5494/erc721/claim-to"

payload = json.dumps({
   "receiver": "0xeC03fD9b0b8AB054B1a44830c89ff290b2D487f7",
   "quantity": "1"
})
headers = {
   'Authorization': 'Bearer eyJhbGciOiJFUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiIweDUzNDAxYTVmMzlCNDQ5MThBRjk1ZDIxZTYzNEI2M0VlQzNlYzZlNWQiLCJzdWIiOiIweDA2NzUyY0Y5MTgyRmUwNTQ3NDI2QTlhRGU5ZkNmNjY4NzY1RTA3MjciLCJhdWQiOiJ0aGlyZHdlYi5jb20iLCJleHAiOjQ4OTQ5Mzc4MjUsIm5iZiI6MTc0MTMzNzgyNSwiaWF0IjoxNzQxMzM3ODI1LCJqdGkiOiJlN2UwOTcyZi1mN2YyLTQ4NmEtOTI1MC0yNDZmZTQ3NDM0NDYiLCJjdHgiOnsicGVybWlzc2lvbnMiOiJBRE1JTiJ9fQ.MHgzZWViMzk5ZjVkNDEzZmNiMjYzYmFlNzAyMGEyMGRmNjc5MTFlNjZiOTc1N2ZjNmZjMDJjNjYwOWM2ZTBjYjFkNzY3OGRkNjk3NDhmYmE2MzhlZWEyMGE3NGFkZmZhYTEzMDYxZGJmMjNmODc0OTFkNmVlZmExZGU2NGYyYzI3NzFi',
   'X-Backend-Wallet-Address': '0x06752cF9182Fe0547426A9aDe9fCf668765E0727',
   'User-Agent': 'Apifox/1.0.0 (https://apifox.com)',
   'Content-Type': 'application/json',
   'Accept': '*/*',
   'Host': 'f9668c2b.engine-usw2.thirdweb.com',
   'Connection': 'keep-alive',
   'Cookie': '_cfuvid=_EKO8k2kWLsRyAgW_waQhLT15yAGCwEqbDP3kA.rmc4-1741337866076-0.0.1.1-604800000'
}

response = requests.request("POST", url, headers=headers, data=payload)

print(response.text)