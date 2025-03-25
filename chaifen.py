import pandas as pd


def split_csv(file_path, chunk_size):
    # 读取CSV文件
    df = pd.read_csv(file_path, chunksize=chunk_size)

    for i, chunk in enumerate(df):
        # 保存拆分后的文件
        chunk.to_csv(f'token-holders-{i}.csv', index=False)


# 使用示例
split_csv('300000.csv', 130000)  # 每10万行拆分一个文件
