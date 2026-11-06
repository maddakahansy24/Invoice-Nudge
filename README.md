# Invoice Nudge
> **Never Miss a Payment Follow-up Again.**

A complete, production-grade MERN stack financial management application designed for freelancers, independent contractors, and small-to-medium businesses to track billings, record partial payments, and systematically prioritize overdue receivables.

---

## 📑 Table of Contents
1. [Problem Statement](#-problem-statement)
2. [Key Objectives](#-key-objectives)
3. [Differentiating Feature: Rule-Based Priority Follow-up Engine](#-differentiating-feature-rule-based-priority-follow-up-engine)
4. [Technology Stack](#-technology-stack)
5. [System Architecture](#-system-architecture)
6. [Database Design & Schema](#-database-design--schema)
7. [REST API Documentation](#-rest-api-documentation)
8. [Installation & Setup Guide](#-installation--setup-guide)
9. [Running the Application](#-running-the-application)
10. [Sample Data & Demonstration Guide](#-sample-data--demonstration-guide)
11. [Academic Project Report Outline](#-academic-project-report-outline)
12. [Future Enhancements](#-future-enhancements)

---

## 📌 Problem Statement
Freelancers and small businesses frequently struggle with cash flow bottlenecks caused by delayed client payments. Traditional invoicing systems act merely as passive repositories; they fail to advise business owners on **which overdue client must be nudged first** to maximize debt recovery while preserving client relationships.

**Invoice Nudge** solves this problem by introducing an intelligent, deterministic **Priority Scoring Engine** that combines overdue delinquency age and outstanding monetary exposure to rank past-due invoices for immediate follow-up.

---

## 🎯 Key Objectives
- **Accurate Invoicing Lifecycle:** Full CRUD management for client billings with unique numbering and date validation.
- **Granular Partial Payments:** Support multiple installments per invoice, recalculating outstanding balance in real time and automatically marking invoices as `PAID` once the balance hits zero.
- **Strict Financial Safeguards:** Prevent overpayments, negative inputs, and invalid date sequences.
- **Mathematical Follow-Up Prioritization:** Eliminate guesswork by ranking delinquent invoices using a transparent 60/40 multi-criteria decision algorithm.
- **Executive Analytics:** Deliver instant visual feedback on gross invoiced volume, collected revenue, outstanding balances, and aging distribution.

---

## 🚀 Differentiating Feature: Rule-Based Priority Follow-up Engine

Unlike vague "AI-powered" claims, Invoice Nudge implements a **deterministic, transparent multi-criteria decision algorithm**:

```
Age Score    = (Invoice Overdue Days / Maximum Overdue Days among all overdue invoices) × 100
Amount Score = (Invoice Outstanding Balance / Maximum Outstanding Balance among all overdue invoices) × 100

Priority Score = (Age Score × 0.60) + (Amount Score × 0.40)
```

### Priority Tiers & Suggested Actions:
| Tier | Score Range | Visual Indicator | Suggested Next Action |
| :--- | :---: | :---: | :--- |
| **HIGH** | `70 – 100` | 🔴 Red Badge | **Follow up immediately** (Phone call / Escalation) |
| **MEDIUM** | `40 – 69` | 🟡 Amber Badge | **Send a payment reminder** (Polite email reminder) |
| **LOW** | `< 40` | 🟢 Teal Badge | **Monitor and schedule follow-up** (Net terms observation) |

The UI also includes a **one-click "Nudge" template generator** that formats a polite, professional payment reminder tailored to the client and copies it directly to the clipboard.

---

## 💻 Technology Stack

| Layer | Technology | Purpose |
| :--- | :--- | :--- |
| **Frontend UI** | React 18, Vite | High-performance Single Page Application (SPA) |
| **Styling** | Custom CSS3 Design System | Responsive SaaS layout with Navy/Indigo/Violet theme |
| **Icons** | Lucide React | Modern, clean vector iconography |
| **Toasts** | React Hot Toast | Real-time user feedback notifications |
| **HTTP Client** | Axios | REST API communication with centralized error handling |
| **Backend API** | Node.js, Express.js | Modular RESTful architecture |
| **Database** | MongoDB Atlas / Local Engine | Document-oriented persistence with Mongoose ODM |
| **Data Modeling** | Mongoose | Schemas, virtual properties, subdocument payment arrays |

---

## 🏗️ System Architecture

```
Invoice-Nudge/
├── client/                     # React + Vite Frontend
│   ├── src/
│   │   ├── components/         # Modals, Badges, Navbar, Sidebar
│   │   ├── pages/              # Dashboard, Invoices, PriorityFollowUps
│   │   ├── services/           # Axios REST API client
│   │   ├── utils/              # Currency (₹ INR), date, and days formatters
│   │   ├── App.jsx             # Main application state orchestrator
│   │   └── index.css           # Custom design system tokens
│   ├── .env                    # Frontend environment variables
│   └── package.json
│
├── server/                     # Express REST API Backend
│   ├── config/                 # MongoDB connection handler
│   ├── controllers/            # Invoices, Payments, and Dashboard controllers
│   ├── middleware/             # Error handler and 404 router
│   ├── models/                 # Mongoose Invoice & Payment schema
│   ├── routes/                 # Express REST endpoint routers
│   ├── utils/                  # PriorityScorer algorithm & sample data seeder
│   ├── .env.example            # Environment variables template
│   ├── server.js               # Express entrypoint
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 🗄️ Database Design & Schema

### Invoice Document Structure
```json
{
  "_id": "ObjectId('...')",
  "invoiceNumber": "INV-2026-001",
  "clientName": "Acuity Tech Solutions",
  "clientEmail": "accounts@acuitytech.io",
  "invoiceDate": "2026-09-20T00:00:00.000Z",
  "dueDate": "2026-10-20T00:00:00.000Z",
  "amount": 45000,
  "description": "Cloud Infrastructure Migration",
  "notes": "Net-30 payment agreement.",
  "payments": [
    {
      "amount": 20000,
      "paymentDate": "2026-10-15T00:00:00.000Z",
      "paymentMethod": "Bank Transfer",
      "reference": "NEFT-88392101"
    },
    {
      "amount": 25000,
      "paymentDate": "2026-10-21T00:00:00.000Z",
      "paymentMethod": "UPI",
      "reference": "UPI-ACUITY-SETTLE"
    }
  ],
  "createdAt": "2026-11-04T00:00:00.000Z",
  "updatedAt": "2026-11-04T00:00:00.000Z"
}
```

### Calculated Virtuals (No Redundant Storage)
- **`totalPaid`**: `sum(payments[].amount)`
- **`outstandingBalance`**: `max(0, amount - totalPaid)`
- **`daysOverdue`**: Local midnight date comparison between current date and `dueDate`.
- **`paymentStatus`**:
  - `PAID`: `outstandingBalance === 0`
  - `OVERDUE`: `daysOverdue > 0` AND `outstandingBalance > 0`
  - `PARTIALLY_PAID`: `totalPaid > 0` AND not overdue
  - `PENDING`: No payments received AND not overdue

---

## 📡 REST API Documentation

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/health` | Service uptime and heartbeat check |
| `GET` | `/api/invoices` | List invoices (with search, filter, and sort params) |
| `GET` | `/api/invoices/:id` | Fetch single invoice details |
| `POST` | `/api/invoices` | Create a new invoice |
| `PUT` | `/api/invoices/:id` | Update invoice details |
| `DELETE` | `/api/invoices/:id` | Delete invoice |
| `POST` | `/api/invoices/:id/payments` | Record a partial or full payment |
| `GET` | `/api/invoices/overdue/priority` | **Differentiating Engine:** Ranked overdue invoices |
| `GET` | `/api/dashboard/summary` | Executive financial metrics and distribution |
| `POST` | `/api/invoices/seed` | Seed / refresh realistic sample invoices |

---

## ⚙️ Installation & Setup Guide

### Prerequisites
- Node.js (v18.x or newer, v26 supported)
- npm (v9.x or newer)

### Step 1: Clone or Open Workspace
```bash
cd "Invoice- Nudge"
```

### Step 2: Install Dependencies
```bash
# Install frontend packages
cd client
npm install

# Install backend packages
cd ../server
npm install
```

### Step 3: Configure Environment Variables
Inside `server/`, create a `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/invoicenudge?retryWrites=true&w=majority
NODE_ENV=development
```
*(Note: If `MONGODB_URI` is omitted, the application automatically uses an embedded local MongoDB engine, allowing immediate demonstration out of the box).*

---

## 🏃 Running the Application

### Option A: Running Backend & Frontend Together
In Terminal 1 (Backend):
```bash
cd server
node server.js
```
*Backend runs at: `http://localhost:5000`*

In Terminal 2 (Frontend):
```bash
cd client
npm run dev -- --host --port 5173
```
*Frontend runs at: `http://localhost:5173`*

---

## 📊 Sample Data & Demonstration Guide

The application comes pre-loaded with **8 realistic business scenarios** showcasing:
1. **Fully Paid Invoice:** Settled through multiple installments.
2. **Pending Invoice:** Clean balance well within payment window.
3. **Partially Paid Invoice:** Active project with milestone advance.
4. **Recently Overdue Invoice (4 days):** Low age penalty.
5. **Severely Overdue Invoice (42 days):** Maximum age penalty (**HIGH Priority**).
6. **High-Value Overdue Invoice (₹1,45,000):** Maximum monetary risk (**HIGH Priority**).
7. **Low-Value Overdue Invoice (₹9,500):** Moderate follow-up tier.
8. **Partially Paid Overdue Invoice:** Partial settlement with outstanding delinquent balance.

To reload sample data at any time, click **"Load Sample Data"** in the sidebar or send a POST request to `/api/invoices/seed`.

---

## 🎓 Academic Project Report Outline

### Chapter 1: Introduction
- 1.1 Background of Freelance Financial Management
- 1.2 Problem Statement & Motivation
- 1.3 Scope and Objectives

### Chapter 2: Literature Survey & Existing Systems
- 2.1 Analysis of Traditional Accounting Platforms (FreshBooks, QuickBooks)
- 2.2 Shortcomings in Follow-up Automation for Indian SMEs
- 2.3 Proposed Solution Advantages

### Chapter 3: System Requirements & Specifications
- 3.1 Hardware and Software Requirements
- 3.2 Functional Requirements (CRUD, Partial Payments, Ranking Engine)
- 3.3 Non-Functional Requirements (Security, Scalability, Responsiveness)

### Chapter 4: System Design & Architecture
- 4.1 High-Level Architecture (Client-Server REST model)
- 4.2 Data Flow Diagrams (Level 0, Level 1)
- 4.3 Database Entity-Relationship (ER) Modeling
- 4.4 Multi-Criteria Scoring Algorithm Formulation

### Chapter 5: Implementation Details
- 5.1 Frontend Architecture (React Components, State Management)
- 5.2 Backend API Controllers and Middleware Pipelines
- 5.3 Mongoose Virtuals vs. Persistent Schema Fields

### Chapter 6: Testing & Quality Assurance
- 6.1 Unit Testing: Overpayment rejection and boundary checks
- 6.2 Integration Testing: End-to-end payment settlement transitions
- 6.3 Mathematical Verification: Weighted scoring rankings

### Chapter 7: Conclusion & Future Scope
- 7.1 Summary of Contributions
- 7.2 Future Enhancements (Automated WhatsApp/Email Webhooks, Payment Gateways)

---

## 🔮 Future Enhancements
- Automated email and WhatsApp reminder dispatch via SendGrid and Twilio.
- UPI QR Code generation directly on generated PDF invoices.
- Recurring subscription invoice automation.
- Role-based multi-user access (Admin, Accountant, Client).
