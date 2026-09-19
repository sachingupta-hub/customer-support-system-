# Datastraw Customer Support Ticketing CRM System

[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas%20%2F%20Local-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

A modern, full-stack Customer Support Ticketing CRM web application built for the **Datastraw AI + Tech Intern Assessment Test**. This system enables support teams to create tickets, automatically generate sequential tracking IDs (`TKT-001`), search and filter issues across multiple fields, monitor live workload metrics, update ticket statuses, and log internal audit notes.

---

## 📌 Table of Contents
1. [Key Features](#-key-features)
2. [Bonus Feature](#-bonus-feature)
3. [Tech Stack & Architecture](#-tech-stack--architecture)
4. [Database Schema](#-database-schema)
5. [REST API Documentation](#-rest-api-documentation)
6. [Local Setup & Running Guide](#-local-setup--running-guide)
7. [Production Deployment Guide](#-production-deployment-guide)
8. [3–5 Minute Demo Video Script](#-35-minute-demo-video-script)
9. [Final Submission Email Template](#-final-submission-email-template)

---

## 🚀 Key Features

### 1. Create Ticket (`/create`)
- Captures Customer Name, Email, Issue Title/Subject, and Full Description.
- Client-side validation with real-time feedback.
- **Auto-generated Sequential ID**: Automatically generates clean identifiers (e.g., `TKT-001`, `TKT-002`, `TKT-003`) backed by an atomic MongoDB sequence counter.
- Sets default status to `Open` and redirects directly to the newly created ticket.

### 2. All Tickets Dashboard (`/`)
- Responsive, clean table displaying Ticket ID, Customer Name, Email, Subject, Status Badge, and Formatted Creation Date.
- Interactive status badges with distinctive colors (Amber for `Open`, Blue for `In Progress`, Emerald for `Closed`).
- Direct navigation into ticket details.

### 3. Comprehensive Search
- Search bar querying multiple fields simultaneously:
  - **Ticket ID** (e.g. `TKT-001`)
  - **Customer Name** (e.g. `Rahul`)
  - **Customer Email** (e.g. `rahul@gmail.com`)
  - **Subject / Description** (e.g. `Payment`)
- Real-time debounced search execution for smooth UX.

### 4. Status Filtering
- Dropdown filter with options: `All`, `Open`, `In Progress`, and `Closed`.
- Synchronized with stats cards: click on any metric card to instantly filter the list.
- One-click reset button to restore default view.

### 5. Ticket Details, Status Update & Notes Timeline (`/tickets/:ticketId`)
- View full customer information and unabridged issue description.
- **Instant Status Update**: Dropdown to toggle between `Open`, `In Progress`, and `Closed` with instant persistence and visual confirmation.
- **Internal Support Notes**: Chronological activity feed allowing support agents to log investigation steps, calls, and resolutions with timestamps.

---

## 🌟 Bonus Feature: Real-Time Workload Statistics
A dedicated dashboard metrics header displaying:
- **Total Tickets**
- **Open Tickets** (active attention required)
- **In Progress Tickets** (ongoing investigations)
- **Closed Tickets** (resolved issues)

Agents can click on any card to immediately filter the table to that subset.

---

## 🏗 Tech Stack & Architecture

```
                               ┌─────────────────────────┐
                               │     React Frontend      │
                               │  (Vite + Tailwind CSS)  │
                               │   Port: 5173 / Vercel   │
                               └────────────┬────────────┘
                                            │
                                      HTTP / REST API
                                            │
                               ┌────────────▼────────────┐
                               │   Express.js / Node.js  │
                               │   Port: 5000 / Render   │
                               └────────────┬────────────┘
                                            │
                                        Mongoose
                                            │
                               ┌────────────▼────────────┐
                               │      MongoDB Atlas      │
                               │      / Local Server     │
                               └─────────────────────────┘
```

- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons, React Router v7.
- **Backend**: Node.js, Express.js 5, CORS, Dotenv.
- **Database**: MongoDB & Mongoose ORM with atomic counter sequencing.

---

## 🗄 Database Schema

### `tickets` Collection
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | MongoDB unique document identifier |
| `ticket_id` | String | Formatted sequential ID (`TKT-001`, unique index) |
| `customer_name`| String | Customer's full name (required) |
| `customer_email`| String | Customer's email address (required, validated) |
| `subject` | String | Title / summary of issue (required) |
| `description` | String | Full issue details reported by customer (required) |
| `status` | String | Enum: `'Open'`, `'In Progress'`, `'Closed'` (default: `'Open'`) |
| `notes` | Array | Embedded array of support note objects |
| `created_at` | Date | Timestamp of creation (auto-managed) |
| `updated_at` | Date | Timestamp of last modification (auto-managed) |

### Embedded `notes` Schema
| Field | Type | Description |
|---|---|---|
| `_id` | ObjectId | Unique note ID |
| `note_text` | String | Content of the support agent remark |
| `created_at` | Date | Timestamp when note was recorded |

### `counters` Collection
Used for thread-safe sequential ticket numbering (`TKT-001`, `TKT-002`, ...).

---

## 📡 REST API Documentation

### Base URL: `http://localhost:5000/api`

#### 1. Create Ticket
- **Endpoint**: `POST /tickets`
- **Request Body**:
```json
{
  "customer_name": "Rahul Sharma",
  "customer_email": "rahul@gmail.com",
  "subject": "Payment Failed",
  "description": "Payment was deducted from bank account but order was not generated."
}
```
- **Response (201 Created)**:
```json
{
  "success": true,
  "message": "Ticket created successfully",
  "data": {
    "ticket_id": "TKT-001",
    "customer_name": "Rahul Sharma",
    "customer_email": "rahul@gmail.com",
    "subject": "Payment Failed",
    "description": "Payment was deducted from bank account but order was not generated.",
    "status": "Open",
    "notes": [],
    "created_at": "2026-09-19T12:31:50.856Z",
    "updated_at": "2026-09-19T12:31:50.856Z"
  }
}
```

#### 2. Get All Tickets (with Search & Status Filter)
- **Endpoint**: `GET /tickets?search=Payment&status=Open`
- **Response (200 OK)**:
```json
{
  "success": true,
  "count": 1,
  "data": [ ... ]
}
```

#### 3. Get Single Ticket Details
- **Endpoint**: `GET /tickets/TKT-001`
- **Response (200 OK)**: Full ticket object including notes array.

#### 4. Update Ticket Status & Details
- **Endpoint**: `PUT /tickets/TKT-001`
- **Request Body**:
```json
{
  "status": "In Progress",
  "note_text": "Support agent contacted customer to verify bank reference ID."
}
```
- **Response (200 OK)**: Updated ticket object.

#### 5. Add Note to Ticket
- **Endpoint**: `POST /tickets/TKT-001/notes`
- **Request Body**:
```json
{
  "note_text": "Refund approved and sent to finance team."
}
```
- **Response (201 Created)**: Updated ticket with newly appended note.

#### 6. Workload Statistics (Bonus)
- **Endpoint**: `GET /tickets/stats`
- **Response (200 OK)**:
```json
{
  "success": true,
  "data": {
    "total": 25,
    "open": 8,
    "inProgress": 10,
    "closed": 7
  }
}
```

---

## 💻 Local Setup & Running Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher, v22 recommended)
- [MongoDB](https://www.mongodb.com/) (local service running or free MongoDB Atlas URI)

### Step 1: Clone Repository
```bash
git clone https://github.com/your-username/datastraw-crm.git
cd datastraw-crm
```

### Step 2: Configure & Start Backend
```bash
cd server
npm install

# Check or edit .env
# PORT=5000
# MONGODB_URI=mongodb://127.0.0.1:27017/datastraw_crm

npm run dev
# Server will run at http://localhost:5000
```

### Step 3: Configure & Start Frontend
In a separate terminal:
```bash
cd client
npm install
npm run dev
# Frontend will run at http://localhost:5173
```

Open your browser at `http://localhost:5173` to test the CRM!

---

## 🌐 Production Deployment Guide

### 1. Database (MongoDB Atlas)
1. Sign in to [MongoDB Atlas](https://www.mongodb.com/atlas) and create a free Shared Cluster.
2. Under **Database Access**, create a database user and password.
3. Under **Network Access**, add `0.0.0.0/0` (allow access from anywhere).
4. Click **Connect** -> **Connect your application** and copy the URI string:
   `mongodb+srv://<username>:<password>@cluster0.mongodb.net/datastraw_crm?retryWrites=true&w=majority`

### 2. Backend (Render)
1. Push this repository to GitHub.
2. Sign in to [Render.com](https://render.com) and click **New Web Service**.
3. Connect your GitHub repository.
4. Set **Root Directory**: `server`
5. Set **Build Command**: `npm install`
6. Set **Start Command**: `npm start`
7. In **Environment Variables**, add:
   - `PORT`: `5000`
   - `NODE_ENV`: `production`
   - `MONGODB_URI`: `<Your MongoDB Atlas Connection String>`
8. Deploy! Render will provide your backend URL: `https://datastraw-crm-api.onrender.com`.

### 3. Frontend (Vercel)
1. Sign in to [Vercel.com](https://vercel.com) and click **Add New Project**.
2. Select your GitHub repository.
3. Set **Root Directory**: `client`
4. Set Framework Preset: `Vite`
5. In **Environment Variables**, add:
   - `VITE_API_URL`: `https://datastraw-crm-api.onrender.com/api`
6. Click **Deploy**. Vercel will build and provide your live production URL: `https://datastraw-crm.vercel.app`.

---

## 🎥 3–5 Minute Demo Video Script

| Time | Section | What to Say & Show |
|---|---|---|
| **0:00 - 0:25** | **Introduction** | "Hello! My name is [Your Name], and this is my submission for Datastraw's AI + Tech Intern Assessment Test. I have developed a full-stack Customer Support Ticketing CRM System built using React, Node.js, Express, and MongoDB." |
| **0:25 - 0:50** | **Dashboard & Workload Stats** | "Here is the main dashboard. At the top, we have our workload stats cards displaying real-time metrics: Total Tickets, Open, In Progress, and Closed. Below is the responsive tickets table with Ticket ID, customer name, issue subject, status badges, and creation dates." |
| **0:50 - 1:30** | **Creating a Ticket** | "Let's click '+ Create Ticket'. I'll fill in: Customer Name: Rahul Sharma, Email: rahul@gmail.com, Issue: Payment Failed, and Description: Payment deducted but order not created. Notice how when I click Submit, the system automatically assigns the sequential ID TKT-001 and sets its initial status to Open." |
| **1:30 - 2:00** | **Search & Real-time Filter** | "Back on the dashboard, let's test the search system. If I type 'Payment' or 'Rahul', the table filters instantaneously. We can also filter by status — for example selecting 'Open' or 'Closed' or simply clicking on any stats card above." |
| **2:00 - 2:45** | **Ticket Details & Status Update** | "Now let's click into TKT-001. Support agents can view customer details and the unabridged issue. Using this dropdown, I can change the status from 'Open' to 'In Progress'. Notice the instant save notification." |
| **2:45 - 3:15** | **Internal Notes Timeline** | "Under Support Notes, agents can log activity. Let's add: 'Customer contacted regarding payment issue, verifying bank transaction ID.' The note appears in the timeline with a real-time timestamp." |
| **3:15 - 3:50** | **Architecture & Best Practices** | "Under the hood, the backend follows an MVC pattern with Express controllers, routes, and Mongoose schemas. Ticket IDs use an atomic counter to prevent race conditions. The frontend is powered by React with Tailwind CSS and centralized API services." |
| **3:50 - 4:15** | **Conclusion** | "The application is deployed live, fully responsive, and the code is structured on GitHub. Thank you for this opportunity, and I look forward to your feedback!" |

---

## ✉️ Final Submission Email Template

**Subject**: Datastraw AI + Tech Intern Assessment Submission - [Your Full Name]

**Dear Datastraw Team,**

I am excited to submit my completed Customer Support Ticketing CRM System for the AI + Tech Intern assessment.

### Project Deliverables:
- **Live Web Application**: [Insert Vercel URL, e.g. https://datastraw-crm.vercel.app]
- **GitHub Repository**: [Insert GitHub URL, e.g. https://github.com/your-username/datastraw-crm]
- **3–5 Min Walkthrough Video**: [Insert Loom / YouTube / Drive Link]
- **LinkedIn Profile**: [Insert your LinkedIn URL]

### Technical Approach:
- **Frontend**: Designed with React 19, Tailwind CSS v4, and Lucide icons for an intuitive, accessible support agent interface. Implemented client-side validation and debounced search.
- **Backend**: Built RESTful APIs using Node.js and Express.js adhering to MVC separation of concerns.
- **Database & ID Generation**: MongoDB Mongoose schema with an atomic sequence counter (`Counter` collection) ensuring clean, collision-free `TKT-001`, `TKT-002` generation even under concurrent requests.
- **Bonus Feature**: Dynamic workload statistics cards offering one-click status filtering.

### Challenges & Solutions:
- **Sequential Ticket IDs**: Standard MongoDB ObjectId is not human-friendly. Created an atomic `$inc` sequence generator guaranteeing sequential ticket IDs without gaps or duplicates.
- **Search Optimization**: Designed combined regex and compound indexing across ticket ID, customer name, email, and issue descriptions to deliver instant search results.

### Future Improvements:
- Role-based authentication (Admin vs. Support Agent).
- Email notifications to customers upon status changes using SendGrid or Resend.
- Attachments upload (screenshots/receipts) via AWS S3 or Cloudinary.

Thank you for reviewing my submission. I look forward to the next steps!

Warm regards,  
**[Your Name]**  
[Your Phone Number]  
[Your Email Address]  
# customer-support-system-
