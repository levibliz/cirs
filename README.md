🌍 Community Issue Reporting Platform (CIRP) – Community Problem Reporting System

🚀 Features

User Portal (Reporter)

📝 Submit new reports (title, description, category, location)

📌 View all submitted reports

🖼️ Optional: Upload image (placeholder logic supported)

🔍 View the status of each report (Pending → In Progress → Resolved)

🕒 Track creation timeline


Admin Portal

👀 View all reports from users

🔧 Update report status (workflow-based)

🗑️ Delete or archive reports

📊 Monitor report trends and categories

🗂️ Filter reports by status/category


Super Admin Portal (Optional for Expansion)

👔 Manage admin accounts

🎛️ Full control over system settings

🎯 Access logs and maintenance tools

🛡️ Configure security & roles



---

🛠️ Tech Stack

Frontend: Next.js 15 (App Router), React, TailwindCSS

Backend: NestJS (Controllers → Services → Repositories)

Database: PostgreSQL

Authentication (optional): JWT (Admin login)

Realtime Updates (optional): Socket.io

Deployment: Vercel (Frontend), Supabase / Railway / Render (Backend)

Language: TypeScript



---

📦 Quick Start

Prerequisites

Node.js 18+

PostgreSQL installed locally or cloud database

(Optional) Docker for easy setup


Installation

1. Clone repository & install dependencies:



npm install

2. Configure environment variables:

`cp .env.example .env`

Then edit .env with your database credentials:

DATABASE_URL=postgres://user:password@localhost:5432/irp
JWT_SECRET=your_secret_key
PORT=3000

3. Set up PostgreSQL database:

manually run SQL from database/schema.sql


4. Run backend server:


``` bash
npm run start:dev
```

5. Run frontend server:

`npm run dev`

Then open:
👉 http://localhost:3000/


---

📁 Project Structure

```
issue-reporting-platform/
├── backend/
│   ├── src/
│   │   ├── modules/
│   │   │   └── reports/
│   │   │       ├── controllers/
│   │   │       ├── services/
│   │   │       ├── repositories/
│   │   │       ├── dto/
│   │   │       └── entities/
│   │   ├── config/
│   │   └── main.ts
│   ├── test/
│   └── README.md
│
├── frontend/
│   ├── app/               # Next.js App Router
│   ├── components/        # UI Components
│   ├── lib/               # Helpers, API clients
│   └── styles/
│
├── database/
│   ├── schema.sql         # Main database schema
│   └── seed.sql           # Sample data (optional)
│
└── .env.example
```


---

🗄️ Database Schema

reports

Column	    Type	    Description

```
-- Create reports table
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view all reports (public read)
CREATE POLICY "Anyone can view reports"
  ON reports FOR SELECT
  USING (true);

-- Policy: Users can insert their own reports
CREATE POLICY "Users can insert their own reports"
  ON reports FOR INSERT
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can update their own reports
CREATE POLICY "Users can update their own reports"
  ON reports FOR UPDATE
  USING (auth.uid()::text = user_id)
  WITH CHECK (auth.uid()::text = user_id);

-- Policy: Users can delete their own reports
CREATE POLICY "Users can delete their own reports"
  ON reports FOR DELETE
  USING (auth.uid()::text = user_id);

-- Optional: Create index on user_id for faster queries
CREATE INDEX reports_user_id_idx ON reports(user_id);
CREATE INDEX reports_created_at_idx ON reports(created_at DESC);
```


See database/schema.sql for full schema.


---

🔐 Authentication (Bonus Feature)

User Roles

1. User (Reporter) – Create & view reports


2. Admin – Manage reports


3. Super Admin – Manage admins + full control



JWT-based login for Admin (optional enhancement).


---

🧭 API Endpoints

POST /api/report

Create a new report

GET /api/report

Fetch all reports

GET /api/report/:id

Fetch single report by ID

PATCH /api/report/:id/status

Update report status

DELETE /api/report/:id

Delete or archive report

All responses return structured JSON.


---

🚢 Deployment

Frontend (Next.js) → Deploy to Vercel

vercel

Add environment variables to Vercel dashboard


Backend (NextJS) → Deploy to Render / Railway / Supabase

Add environment variables

Connect PostgreSQL instance

Build & deploy



---

📝 Development Timeline

✅ Week 1: Project scaffolding, DB design, backend modules

🔄 Week 2: API development, frontend pages

⏳ Week 3: Admin panel + workflows

⏳ Week 4: Testing, optimization, documentation, deployment



---

👨‍💻 Author

Ugwoke Levi Soromto (Levibliz)

GitHub: (Add your GitHub link here)

Email: levisoromto1m@gmail.com



---

Built with NestJS & Next.js | Powered by PostgreSQL

