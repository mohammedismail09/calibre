# Calibre 📊 

> **AI Hackathon 2025 Submission** — HR Cost Intelligence Engine

Calibre is an intelligent workforce analytics platform designed exclusively for HR administrators and organizational leadership. It automatically translates raw employee calendar activity into real-time project financial metrics. By analyzing meeting metadata, participant tracking rates, and global parameters, Calibre provides deep visibility into organizational expenditure without compromising individual data privacy rules.

---

## ✨ Core Product Capabilities

Our implementation addresses all 5 foundational problem statement challenges end-to-end:

1. **Calendar Intake Pipeline** — Emulates standard corporate calendar syncing via a clean REST framework to instantly ingest meeting data.
2. **AI-Powered Project Attribution** — Integrates with OpenAI (`gpt-4o-mini`) structured completion loops to evaluate meeting contexts (titles, descriptors, attendee counts) and match them natively to defined project taxonomy with an expected precision of $\ge85\%$.
3. **Personnel Management & Rates** — A full CRUD dashboard enabling HR leads to add team members, assign individual per-hour billing weights, or clear out obsolete personnel records.
4. **Interactive Cost Dashboards** — Displays a visual timeline of monthly progress trends and operating budget consumption graphs directly alongside folders for your active projects. Clicking any project block slides open an interactive specification drawer revealing detailed scope statements.
5. **Autonomous Anomaly Center** — Automatically scans incoming metrics to isolate and alert leadership to heavy overhead burns or dense employee group alignments.

---

## 🛠️ The Presentation "Reset Switch"

To facilitate a clean demonstration loop for the hackathon panel, we built a temporary presentation utility. Clicking the **Red Dustbin Button** next to the theme switcher fires a dedicated backend endpoint that clears the active meetings and personnel arrays from your local database. This allows you to show the judges how the engine parses, attributes, and tracks data fields completely from scratch.

---

## 🏗️ Technical Stack Architecture

* **Frontend Layout:** React.js (Vite configuration), Tailwind CSS, Lucide React Icons.
* **Backend Architecture:** Python, FastAPI, Pydantic (Strict data schemas), OpenAI API SDK.
* **Database Layer:** Persistent Local File-System JSON Database Engine (`db.json`).

---

## 🏃‍♂️ Local Development Setup

Follow these quick commands to spin up the local execution layers concurrently:

### 1. Fire up the Python FastAPI Server
```bash
cd calibre-backend
python -m venv venv

# Activate Virtual Environment (Windows PowerShell):
.\venv\Scripts\activate

# Install requirements
pip install fastapi uvicorn pydantic openai requests

# Boot the hot-reloader server
uvicorn main:app --reload --port 8000
Interactive Swagger Endpoint documentation sits at: http://127.0.0.1:8000/docs

# Open a second terminal window
cd calibre
npm install
npm run dev
Application workspace port sits at: http://localhost:5173