import asyncio
from web3 import AsyncWeb3, WebSocketProvider


async def example():
    # connect to a node:
    async with AsyncWeb3(WebSocketProvider("wss://public-en.node.kaia.io/ws")) as w3:


        subscription_id = await w3.eth.subscribe("newHeads")
        print(subscription_id)

        # listen for events as they occur:
        async for response in w3.socket.process_subscriptions():
        # handle each event:
            print(response)

        # unsubscribe:
            if response:
                await w3.eth.unsubscribe(subscription_id)
                break


asyncio.run(example())
