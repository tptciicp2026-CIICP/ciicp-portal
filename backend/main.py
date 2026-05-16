from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI()

# Enable CORS so React can communicate with FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Change this to your React app URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)

# --- Pydantic Models ---
class UserLogin(BaseModel):
    email: str
    password: str

class UserRegister(BaseModel):
    email: str
    password: str
    role: str = "student"

class CourseCreate(BaseModel):
    name: str
    hrs: int
    fee: int
    total_fee: int

class PaymentCreate(BaseModel):
    amount: int
    payment_method: str

# --- API Endpoints ---

@app.get("/")
def read_root():
    return {"message": "FastAPI CIICP Backend is running!"}

# 1. AUTHENTICATION
@app.post("/api/register")
def register_user(user: UserRegister):
    # Check if user exists
    existing = supabase.table("users").select("*").eq("email", user.email).execute()
    if len(existing.data) > 0:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Insert new user
    res = supabase.table("users").insert({
        "email": user.email,
        "password": user.password, # In production, hash this password!
        "role": user.role
    }).execute()
    return {"message": "User registered successfully", "user": res.data[0]}

@app.post("/api/login")
def login_user(user: UserLogin):
    # Admin hardcode fallback
    if user.email == "tptciicp2026@gmail.com" and user.password == "prabhakaran@2026":
        return {"role": "admin", "email": user.email}

    # Verify student
    res = supabase.table("users").select("*").eq("email", user.email).execute()
    if len(res.data) == 0:
        raise HTTPException(status_code=404, detail="No account found with this email")
    
    db_user = res.data[0]
    if db_user["password"] != user.password:
        raise HTTPException(status_code=401, detail="Incorrect password")
    
    return {"role": db_user["role"], "email": db_user["email"]}

# 2. COURSES
@app.get("/api/courses")
def get_courses():
    res = supabase.table("courses").select("*").execute()
    return res.data

@app.post("/api/courses")
def add_course(course: CourseCreate):
    res = supabase.table("courses").insert(course.model_dump()).execute()
    return res.data[0]

@app.delete("/api/courses/{course_id}")
def delete_course(course_id: int):
    res = supabase.table("courses").delete().eq("id", course_id).execute()
    return {"message": "Course deleted successfully"}

@app.put("/api/courses/{course_id}")
def update_course(course_id: int, course: CourseCreate):
    res = supabase.table("courses").update(course.model_dump()).eq("id", course_id).execute()
    return res.data[0]

# 3. APPLICATIONS
@app.post("/api/applications")
def submit_application(application: dict):
    res = supabase.table("applications").insert(application).execute()
    return res.data[0]

@app.get("/api/applications")
def get_all_applications():
    res = supabase.table("applications").select("*").execute()
    return res.data

@app.get("/api/applications/{email}")
def get_student_application(email: str):
    res = supabase.table("applications").select("*").eq("user_email", email).execute()
    if len(res.data) == 0:
        return {"application": None}
    return {"application": res.data[0]}

@app.put("/api/applications/{app_id}/approve")
def toggle_approval(app_id: str, id_approved: bool):
    res = supabase.table("applications").update({"id_approved": id_approved}).eq("id", app_id).execute()
    return res.data[0]

@app.put("/api/applications/{app_id}/payment")
def update_payment(app_id: str, amount_paid: int, payment_status: str):
    res = supabase.table("applications").update({
        "amount_paid": amount_paid,
        "payment_status": payment_status
    }).eq("id", app_id).execute()
    return res.data[0]

# 4. PAYMENTS
@app.post("/api/applications/{app_id}/payments")
def add_payment(app_id: str, payment: PaymentCreate):
    app_res = supabase.table("applications").select("*").eq("id", app_id).execute()
    if len(app_res.data) == 0:
        raise HTTPException(status_code=404, detail="Application not found")
    
    app_data = app_res.data[0]
    
    payments_res = supabase.table("payments").select("*").eq("application_id", app_id).execute()
    installment_number = len(payments_res.data) + 1
    
    new_payment = {
        "application_id": app_id,
        "amount": payment.amount,
        "payment_method": payment.payment_method,
        "installment_number": installment_number
    }
    inserted = supabase.table("payments").insert(new_payment).execute()
    
    new_total = app_data["amount_paid"] + payment.amount
    new_status = "partial"
    if new_total >= app_data["course_fee"]:
        new_status = "paid"
        
    supabase.table("applications").update({
        "amount_paid": new_total,
        "payment_status": new_status
    }).eq("id", app_id).execute()
    
    return inserted.data[0]

@app.get("/api/applications/{app_id}/payments")
def get_payments(app_id: str):
    res = supabase.table("payments").select("*").eq("application_id", app_id).order("created_at").execute()
    return res.data
