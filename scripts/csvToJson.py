

import pandas as pd
import json

# Read the CSV file
df = pd.read_csv("../first2hours.csv")

# Turn CSV into JSON

# Create a list
data = []

# For each row in the CSV:
for index, row in df.iterrows():
    # Create a dictionary
    data.append({
        "startTime": row["Start"],
        "endTime": row["End"],
        "text": row["Text"]
    })

# Read the second CSV file
df = pd.read_csv("../second2hours.csv")

# For each row in the CSV:
for index, row in df.iterrows():
    # Create a dictionary
    data.append({
        "startTime": row["Start"] + 7200,
        "endTime": row["End"] + 7200,
        "text": row["Text"]
    })

# Write JSON file
with open("../fe/src/data/subtitles.json", "w") as outfile:
    # make encoding utf8
    json.dump(data, outfile, ensure_ascii=False, indent=4)


