from fastapi import FastAPI, Query
from pydantic import BaseModel
from src.bookk import booking
from src.data2 import changing

app = FastAPI()

# Temporary in-memory storage for the example
temp_storage = {}

# Step 1 — GET endpoint (collect details via query parameters)
@app.get("/collect/")
def collect_details(
    name: str = Query(..., description="User's full name"),
    email: str = Query(..., description="User's email ID"),
    action: str = Query(..., description="BOOK or change")
):
    # Validate email domain (optional, you can skip this if not needed)
    # Example: Ensure ends with @google.com
    # if not email.lower().endswith("@google.com"):
    #     return {"error": "Email must end with @google.com"}

    # Store temporarily (in real code you'd use DB/session)
    temp_storage["name"] = name
    temp_storage["email"] = email
    temp_storage["action"] = action.strip().upper()

    return {
        "message": "Details collected. Now send a POST to /process/ to proceed.",
        "stored_data": temp_storage
    }


# Step 2 — POST endpoint (process the collected details)
class OperationRequest(BaseModel):
    message: str = None  # Optional user message for booking/change process

@app.post("/process/")
def process_action(request: OperationRequest):
    action = temp_storage.get("action")

    if not action:
        return {"error": "No action found. Call /collect/ first."}

    if action == "BOOK":
        result = booking("book")
    elif action == "CHANGE":
        result = changing("change")
    else:
        return {"error": "Invalid action stored."}

    return {
        "name": temp_storage.get("name"),
        "email": temp_storage.get("email"),
        "action": action,
        "message": request.message,
        "result": result
    }
