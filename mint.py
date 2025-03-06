import requests

url = "https://thirdweb-engine.apidocumentation.com/contract/80002/0x000000000000000000000000000000000000dead/write"

payload = {
    "functionName": "function mintTo(address to, uint256 amount)",
    "args": [1730380951, "0x09530565aC1Ce08C3621f5B24Fca6d9a76574620", ["a", "b", "c"]],
    "txOverrides": {
        "gas": "530000",
        "gasPrice": "50000000000",
        "maxFeePerGas": "50000000000",
        "maxPriorityFeePerGas": "50000000000",
        "timeoutSeconds": "7200",
        "value": "50000000000"
    },
    "abi": [
        {
            "type": "",
            "inputs": [{ "components": [None] }],
            "outputs": [{ "components": [None] }]
        }
    ]
}
headers = {
    "X-Backend-Wallet-Address": "0x000000000000000000000000000000000000dead",
    "Content-Type": "application/json",
    "Authorization": "Bearer YOUR_SECRET_TOKEN"
}

response = requests.post(url, json=payload, headers=headers)

print(response.json())