
# 🛠️ Project Name:
**Watch Dealer Inventory Portal**

## 🎯 Purpose:
Develop a scalable, full-stack inventory portal for watch dealers. Authenticated users can browse a fancy, filterable product list. Admins manage inventory. The app uses microfrontend architecture to support future expansion.

## 👤 Target Users:
- **Dealers:** Authenticated via email/password or Google
- **Admins:** Same login, extra privileges (CRUD access)

## 🚀 Core Features

### 🔐 Authentication
- Firebase or Supabase OAuth (Google login)
- Email/password login
- Role-based access control (Dealer / Admin)

### 📦 Inventory View
- Display watches in card/grid layout
- Fields: Image, Ref #, Brand, Size, Material, Price
- Filter by brand, size, price, material
- Mobile-friendly UI using **Tailwind CSS**

### 🌟 Favorites
- Users can favorite items (stored per user in DB)

### 🛠️ Admin Area
- Admin-only dashboard (accessible after login)
- Add/Edit/Delete watch items
- Inventory stored in PostgreSQL

### 🧩 Microfrontend Architecture
- App built as a shell + microfrontends using **Webpack 5 Module Federation**
- Initial MFE: **Inventory MFE**
- Codebase prepared to scale (e.g. `mfe-auth`, `mfe-dashboard`, etc.)

## ⚙️ Tech Stack

| Category        | Technology                          |
|-----------------|--------------------------------------|
| Frontend        | React.js + TypeScript               |
| Styling         | Tailwind CSS                        |
| State Mgmt      | Redux Toolkit                       |
| Server State    | React Query                         |
| Auth            | Firebase Auth / Supabase Auth       |
| Backend         | Node.js + Express                   |
| Database        | PostgreSQL (via Supabase/Neon)      |
| MFE Framework   | Webpack 5 Module Federation         |
| DevOps / CI/CD  | Docker + GitHub Actions             |
| Hosting         | Replit (dev), Vercel/Railway (prod) |

## 🧪 MVP Requirements

- [ ] Secure login (Google + email/password)
- [ ] Role-based routing (Dealer/Admin)
- [ ] Inventory UI with fancy Tailwind layout
- [ ] Filter system: brand, price, size, material
- [ ] Favorite system (user-specific)
- [ ] Admin panel (CRUD with PostgreSQL)
- [ ] React Query for data fetching/caching
- [ ] Redux Toolkit for global/MFE state
- [ ] Dockerized for DevOps and CI/CD
- [ ] Microfrontend setup with Inventory MFE

## 🗂️ Folder Structure

```
/watch-portal/
├── shell-app/              # Main host app (React + TS)
│   ├── src/
│   │   └── App.tsx
├── mfe-inventory/          # First MFE: inventory dashboard
│   ├── src/
│   │   └── Inventory.tsx
├── backend/                # Express API server
│   ├── src/
│   │   └── server.ts
├── docker/
│   ├── Dockerfile
│   └── docker-compose.yml
├── .github/
│   └── workflows/ci.yml
├── .env
├── PRD.md
└── README.md
```

## 🧭 Dev Notes & Best Practices

- All HTTP data fetching via **React Query**
- Global auth + role state via **Redux Toolkit**
- All frontend state and logic must use **TypeScript**
- Every component must be styled with **Tailwind CSS** (no inline styles)
- Microfrontend shell should dynamically import all MFEs
- Add detailed **README.md** instructions for future MFE developers
- Setup **Docker + GitHub Actions** for CI/CD

## 🧠 Scalability Preparedness

- MFE ready for plug-and-play architecture
- Add future MFEs: `mfe-auth`, `mfe-orders`, `mfe-reports`
- Use Redux Toolkit as cross-MFE state layer
- Future database migration handled via Supabase CLI or Prisma
