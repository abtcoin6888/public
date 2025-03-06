import requests

url = "https://thirdweb-engine.apidocumentation.com/contract/8217/0x2Fd27032b5eE51b3430aC3EC32a2fB0EFB1702f6/write"

payload = {
    "functionName": "function lazyMint(uint256 _amount, string _baseURIForTokens, bytes _data) returns (uint256 batchId)",
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