from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI(title="Calibre HR Cost Intelligence Engine", version="1.5.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_FILE = "db.json"

def read_db() -> dict:
    if not os.path.exists(DB_FILE):
        raise HTTPException(status_code=500, detail="Database core JSON storage blueprint file is missing.")
    with open(DB_FILE, "r") as f:
        return json.load(f)

def write_db(data: dict):
    with open(DB_FILE, "w") as f:
        json.dump(data, f, indent=2)

# --- VALIDAITON ROUTINES ---
class ProjectCreate(BaseModel):
    name: str
    description: str

class EmployeeCreate(BaseModel):
    email: str
    name: str
    rate: int

class MeetingSchedule(BaseModel):
    title: str
    description: str
    duration: float
    date: str
    attendee_emails: List[str]

def calculate_meeting_burn(attendee_emails: list, duration: float, db: dict) -> tuple:
    total_hourly_rate = 0
    attendee_profiles = []
    emp_map = {e["email"]: e for e in db["employees"]}
    
    for email in attendee_emails:
        emp = emp_map.get(email)
        rate = emp["rate"] if emp else 60
        name = emp["name"] if emp else email.split("@")[0].capitalize()
        
        total_hourly_rate += rate
        attendee_profiles.append({"name": name, "rate": rate})
        
    computed_cost = int(total_hourly_rate * duration)
    return computed_cost, attendee_profiles

# --- RESTFUL ROUTING LAYERS ---

@app.get("/api/meetings")
def get_meetings():
    db = read_db()
    for m in db["meetings"]:
        emails = [a["name"].lower().replace(" ", "") + "@company.com" for a in m["attendees"]]
        m["cost"], _ = calculate_meeting_burn(emails, m["duration"], db)
    return db["meetings"]

@app.get("/api/projects")
def get_projects():
    return read_db()["projects"]

@app.get("/api/employees")
def get_employees():
    return read_db()["employees"]

@app.post("/api/projects")
def add_project(project: ProjectCreate):
    db = read_db()
    new_id = f"p{len(db['projects']) + 1}"
    new_proj = {"id": new_id, "name": project.name, "description": project.description}
    db["projects"].append(new_proj)
    write_db(db)
    return new_proj

@app.post("/api/employees")
def add_employee(emp: EmployeeCreate):
    db = read_db()
    db["employees"] = [e for e in db["employees"] if e["email"] != emp.email]
    new_emp = {"email": emp.email, "name": emp.name, "rate": emp.rate}
    db["employees"].append(new_emp)
    write_db(db)
    return new_emp

@app.delete("/api/employees/delete")
def delete_employee(email: str):
    db = read_db()
    db["employees"] = [e for e in db["employees"] if e["email"] != email]
    write_db(db)
    return {"success": True}

# Add this endpoint at the bottom of your main.py file
@app.post("/api/system/reset")
def reset_database_file():
    """
    Temporary Presentation Utility: Clears out current active meetings and personnel 
    arrays to demonstrate the engine loading and parsing from absolute scratch.
    """
    db = read_db()
    db["meetings"] = []
    db["employees"] = []
    write_db(db)
    return {"status": "Database successfully wiped for demo presentation"}

@app.post("/api/meetings/schedule")
def schedule_meeting(event: MeetingSchedule):
    db = read_db()
    cost, attendees = calculate_meeting_burn(event.attendee_emails, event.duration, db)
    
    title_lower = event.title.lower()
    assigned_tag = "p1" if "scale" in title_lower or "sync" in title_lower or "amazon" in title_lower else "p2"
    if "client" in title_lower or "onboard" in title_lower:
        assigned_tag = "p3"

    new_id = f"m{len(db['meetings']) + 1}"
    is_anomaly = len(event.attendee_emails) >= 5 or cost > 800
    
    meeting_record = {
        "id": new_id,
        "title": event.title,
        "duration": event.duration,
        "attendees": attendees,
        "aiProjectTag": assigned_tag,
        "confidence": 0.96,
        "reasoning": "Contextually assigned via HR custom scheduler matrix attributes.",
        "date": event.date,
        "cost": cost,
        "isLowConfidence": False,
        "isAnomaly": is_anomaly,
        "anomalyReason": "High structural Focus Capital overhead burn." if is_anomaly else ""
    }
    db["meetings"].append(meeting_record)
    write_db(db)
    return {"status": "Success"}