
# 📄 Project Name:
**Watch Dealer Inventory Portal**

## 🎯 Purpose:
Deliver a clean, mobile-friendly, and secure inventory portal to replace spreadsheet-based workflows. The portal is designed specifically for logged-in wholesale watch dealers. Admins can manage the inventory with minimal tech skills through Airtable or a simple admin form.

## 👤 Target Users:
- **Wholesale Watch Dealers**: Authenticated users with private access
- **Admins**: Manage inventory visibility and updates

## 💡 Client Priorities:
- Easy to update & maintain (Airtable or simple CMS backend)
- Fast, mobile-optimized UI
- Secure login with at least 2–3 test accounts
- Ability to filter/search inventory quickly
- Favoriting/memo tagging is optional
- No checkout or payment integration

## 🖥️ Features

### 🔐 Authentication
- Secure login via Supabase (email + Google support)
- At least 2–3 test dealer accounts set up

### 🕰️ Inventory Display
- Grid/List view of inventory
- Fields: Image, Reference Number, Brand, Size, Material, Price
- Mobile responsive design (Tailwind CSS)
- Filtering: Size, Brand, Material, Price

### 🌟 Optional: Favorites / Memo Tagging
- Dealers can mark favorite or memo items
- Stored per user

### 🛠️ Admin Panel
- Airtable integration OR custom React form
- Admin-only CRUD access
- Admin access protected by auth role

## ⚙️ Tech Stack

| Layer         | Technology                          |
|---------------|--------------------------------------|
| Frontend      | React + TypeScript                   |
| Styling       | Tailwind CSS                         |
| Auth          | Supabase (OAuth + email)             |
| State Mgmt    | Redux Toolkit (if needed)            |
| Server State  | React Query                          |
| DB            | Supabase PostgreSQL or Airtable API  |
| Backend API   | Node.js + Express (only if Airtable not used) |
| Hosting       | Replit (dev) + Vercel (prod)         |
| Dev Tools     | Docker + GitHub Actions              |

## 📦 Deliverables

- Responsive React portal with clean UI
- 10–15 sample watches uploaded
- Dealer login with test accounts
- Admin interface or Airtable config
- Short README or recorded walkthrough for client

## 🗂️ Suggested Folder Structure

```
/watch-portal/
├── frontend/                 # React + Tailwind
│   └── src/
│       └── App.tsx
├── backend/ (optional)       # Express API if not using Airtable
│   └── src/
│       └── server.ts
├── airtable/                 # Optional Airtable API logic
│   └── airtableClient.ts
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── .github/
│   └── workflows/ci.yml
├── .env
├── PRD.md
└── README.md
```

## 🧠 Notes

- Airtable preferred for ease unless client requests full DB control
- Favoriting and view customization are stretch goals
- Dev stack kept clean and minimal for client handoff
- Replit used for dev preview, production can be moved to Vercel or Fly.io
