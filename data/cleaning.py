import pandas as pd
import numpy as np

dataset = pd.read_csv(
    'C:/Users/dybef/OneDrive/Desktop/CS1951A/hw6/data/football.csv', parse_dates=True)
dataset2 = dataset[dataset["tournament"] == "FIFA World Cup"]
dataset2 = dataset2[dataset["date"] >= "2014-01-01"]
dataset2.to_csv(
    'C:/Users/dybef/OneDrive/Desktop/CS1951A/hw6/data/worldcup.csv', index=True)

dataset['date'] = pd.to_datetime(dataset['date'], errors='coerce')

dataset['num_games'] = 1


recent = dataset[dataset["date"] >= "2015-01-01"]

recent = recent[['date', 'num_games']].groupby(recent.date.dt.year).sum()

ancient = dataset[dataset["date"] >= "1900-01-01"]

ancient = ancient[ancient["date"] < "1906-01-01"]

ancient = ancient[['date', 'num_games']].groupby(ancient.date.dt.year).sum()


recent.to_csv(
    'C:/Users/dybef/OneDrive/Desktop/CS1951A/hw6/data/recent.csv', index=True)

ancient.to_csv(
    'C:/Users/dybef/OneDrive/Desktop/CS1951A/hw6/data/ancient.csv', index=True)
