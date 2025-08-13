import pandas as pd
import os
import json

def clean_and_parse_json(data_str: str):
    """Remove markdown and safely parse JSON string."""
    data_str = data_str.strip()

    if not data_str:
        print("❌ Empty input string.")
        return None

    # Remove markdown code blocks if present
    if data_str.startswith("```"):
        data_str = data_str.replace("```json", "").replace("```", "").strip()

    try:
        return json.loads(data_str)
    except json.JSONDecodeError as e:
        print("❌ JSON decode error:", e)
        return None

import pandas as pd

def update_appointment_from_dict(data: dict, csv_path="appointments.csv"):
    """Update the appointment time in the CSV based on provided dictionary data."""
    if not isinstance(data, dict):
        print("❌ Input must be a dictionary.")
        return

    # Extract fields
    full_name = data.get("full_name", "").strip()
    appointment_date = data.get("appointment_date", "").strip()
    doctor_name = data.get("doctor_name", "").strip()
    new_time = data.get("new_preferred_time", "").strip()

    if not all([full_name, appointment_date, doctor_name, new_time]):
        print("❌ Missing required fields in JSON.")
        return

    try:
        df = pd.read_csv(csv_path)
    except FileNotFoundError:
        print(f"❌ File '{csv_path}' not found.")
        return

    df.columns = [col.strip().lower().replace(" ", "_") for col in df.columns]
    print("📋 CSV Columns:", df.columns.tolist())

    # Ensure required columns exist
    required_cols = ['patient_name', 'appointment_date', 'preferred_doctor', 'preferred_time']
    for col in required_cols:
        if col not in df.columns:
            print(f"❌ Missing column in CSV: '{col}'")
            return

    # Normalize values
    match = (
        (df['patient_name'].str.lower() == full_name.lower()) &
        (df['appointment_date'].astype(str).str.lower() == appointment_date.lower()) &
        (df['preferred_doctor'].str.lower() == doctor_name.lower())
    )

    if not match.any():
        print("⚠️ No matching appointment found.")
        return

    df.loc[match, 'preferred_time'] = new_time

    try:
        df.to_csv(csv_path, index=False)
        print("✅ Appointment time updated successfully.")
    except Exception as e:
        print(f"❌ Failed to save CSV: {e}")
