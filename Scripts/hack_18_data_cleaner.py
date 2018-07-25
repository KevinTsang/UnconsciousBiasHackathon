# Python 3

from sys import argv
from csv import DictReader, DictWriter
from os import listdir
from pprint import pprint
from os.path import join as join_path
from itertools import groupby, chain
import json
from datetime import datetime

def decorate_with_ts(datapoint):
    date_str = datapoint["Date"]
    time_str = datapoint["Time"]
    time_part, mill_part = time_str.split(".")
    microsecond_str = "000" + mill_part
    full_string = date_str + " " + time_part + "." + microsecond_str + " -0400"
    datapoint["ts"] = datetime.strptime(full_string, "%d %b %Y %H:%M:%S.%f %z").timestamp()
    return datapoint

def decorate_gaze_with_ts(datapoint):
    result = {}
    date_str, tag_str = datapoint.split(",")
    result["ts"] = int(datetime.strptime(date_str + " -0000", "%m/%d/%Y %I:%M:%S %p %z").timestamp())
    result["tag"] = tag_str.lower()
    return result

def collapse_gaze_data(data):
    results = []
    items = [decorate_gaze_with_ts(line) for line in data if line != ""]
    for ts, group in groupby(items, key=lambda x: int(x["ts"])):
        results.append(next(group))
    return results

def average_rows(rows, cols, interval=1000):
    result = []
    rows = [decorate_with_ts(row) for row in rows]
    for ts, group in groupby(rows, key=lambda x: int(x["ts"])):
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
    gaze_filename = next(filter(lambda x: x.startswith("Gaze"), csvs))
    bp_csv_path = join_path(argv[1], bp_filename)
    vitals_csv_path = join_path(argv[1], vitals_filename)
    gaze_path = join_path(argv[1], gaze_filename)
    result_csv_path = join_path(argv[1], "merged.ts")

    with open(bp_csv_path) as bp_f, \
        open(vitals_csv_path) as vital_f, \
        open(gaze_path) as gaze_f, \
        open(result_csv_path, "w", newline='') as result_f:
        bp_reader = DictReader(bp_f)
        vitals_reader = DictReader(vital_f)

        bp_rows = average_rows(bp_reader, ["Pressure (mmHg)"])
        vitals_rows = average_rows(vitals_reader, ["HeartRate (bpm)", "Respiration (Bpm)"])
        gaze_data = collapse_gaze_data(gaze_f.read().split("\n"))

        jString = json.dumps(merge_rows(bp_rows, vitals_rows, gaze_data), indent="\t")
        # result_f.write("export const mergedData : string = '")
        result_f.write(jString)
        # result_f.write("';")