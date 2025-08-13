import json
import pandas as pd
import os

def save_to_csv(data: dict, filename: str = "appointments.csv"):
    if not isinstance(data, dict):
        print("Invalid input: data must be a dictionary.")
        return

    try:
        df = pd.DataFrame([data])
        write_header = not os.path.exists(filename) or os.path.getsize(filename) == 0
        df.to_csv(filename, mode='a', header=write_header, index=False)
        print(f"Appointment saved to {filename}.")
    except Exception as e:
        print(f"Failed to save appointment: {e}")

def process_data_and_save(data_str: str, filename="appointments.csv"):
    data_str = data_str.strip()

    # Remove Markdown-style code block if present
    if data_str.startswith("```json"):
        data_str = data_str.replace("```json", "").replace("```", "").strip()
    elif data_str.startswith("```"):
        data_str = data_str.replace("```", "").strip()

    try:
        data_dict = json.loads(data_str)
        print("Parsed data:", data_dict)
        save_to_csv(data_dict, filename)
    except json.JSONDecodeError as e:
        print("JSON decode error:", e)



