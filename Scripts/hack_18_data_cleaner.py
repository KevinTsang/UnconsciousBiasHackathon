# Python 3

from sys import argv
from csv import DictReader, DictWriter
from os import listdir
from pprint import pprint
from os.path import join as join_path
from itertools import groupby, chain
import json

def average_rows(rows, cols, interval=1000):
    result = []
    for ts, group in groupby(rows, key=lambda x: (int(x["TimeStamp (mS)"]) // interval) * interval):
        new_row = {}
        new_row["ts"] = ts
        group = list(group)
        for col in cols:
            vals = [float(x[col]) for x in group]
            new_row[col] = sum(vals) / len(vals)
        result.append(new_row)
    return result


def merge_rows(*iterable):
    result = []
    merged = sorted(chain.from_iterable(iterable), key=lambda x: x["ts"])
    for ts, group in groupby(merged, key=lambda x: x["ts"]):
        new_row = {}
        for dic in group:
            for k, v in dic.items():
                new_row[k] = v
        result.append(new_row)
    return result

if __name__ == "__main__":
    if len(argv) < 2:
        print("You need to provide a folder")
        exit(1)
    print()
    csvs = listdir(argv[1])
    bp_filename = next(filter(lambda x: x.startswith("cuffPressure"), csvs))
    vitals_filename = next(filter(lambda x: x.startswith("vitals"), csvs))
    bp_csv_path = join_path(argv[1], bp_filename)
    vitals_csv_path = join_path(argv[1], vitals_filename)
    result_csv_path = join_path(argv[1], "merged.ts")

    with open(bp_csv_path) as bp_f, \
        open(vitals_csv_path) as vital_f, \
        open(result_csv_path, "w", newline='') as result_f:
        bp_reader = DictReader(bp_f)
        vitals_reader = DictReader(vital_f)

        bp_rows = average_rows(bp_reader, ["Pressure (mmHg)"])
        vitals_rows = average_rows(vitals_reader, ["HeartRate (bpm)", "Respiration (Bpm)"])

        jString = json.dumps(merge_rows(bp_rows, vitals_rows))
        result_f.write("export const mergedData : string = '")
        result_f.write(jString)
        result_f.write("';")
