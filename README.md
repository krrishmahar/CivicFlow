# Smart CivicFlow 🚦

A citizen-first civic issue reporting platform powered by **Motia** and **Next.js**.  
Smart CivicFlow allows users to report issues like potholes, garbage, broken streetlights, and more — with images, location context, and transparent tracking — all handled via durable workflows.

---

## 🏗️ Project Structure

```text
Smart-CivicFlow/
├── backend/        # Motia backend (API, workflows, state)
├── frontend/       # Next.js frontend (UI)
└── README.md
```

---

## 🚀 Quick Start

### 1️⃣ Backend (Motia)

The backend handles:
- Complaint creation
- Workflow orchestration
- State persistence
- Notifications & background jobs

```bash
cd backend
npm install
cp .env.example .env
# Fill required keys (Motia, AI, storage if any)
npm run dev
```

Backend will start on:
```
http://localhost:3001
```

---

### 2️⃣ Frontend (Next.js)

The frontend provides:
- Simple complaint form
- Image upload
- Complaint tracking UI
- Real-time status updates

```bash
cd frontend
npm install
npm run dev
```

Frontend will be available at:
```
http://localhost:3000
```

---

## 🔁 How It Works (Flow)

1. User submits a civic complaint from the frontend
2. Next.js sends request to Motia API
3. Motia workflow:
   - Stores complaint in Motia State
   - Deduplicates nearby complaints
   - Assigns municipality
   - Generates complaint ID (e.g. #CIV-1234)
4. Complaint status updates over time
5. Users can view related complaints in the same area

---

## 🧠 Key Features

- **Simple Complaint Filing** – Minimal form, image-based reporting
- **Durable Workflows** – Complaints never get lost
- **Stateful Tracking** – Each complaint has a lifecycle
- **Deduplication** – Nearby complaints are grouped
- **Transparency** – Citizens see parallel complaints
- **Scalable by Design** – Can migrate to DB later

---

## 🛠️ Tech Stack

### Backend
- **Motia** – Durable workflows & state
- **TypeScript**
- **AI Agents** – Priority & deduplication (optional)

### Frontend
- **Next.js (App Router)**
- **Tailwind CSS**
- **Framer Motion**
- **Shadcn/ui (optional)**

---

## 🗄️ Data Storage Strategy

- **Motia State** – Primary storage for MVP & hackathon scale
- **Future Upgrade** – MongoDB / PostgreSQL as source of truth
- **Hybrid Approach** – Motia State + DB (recommended for production)

---

## 📖 Documentation

- Backend architecture → `/backend/README.md`
- Frontend components → `/frontend/README.md`

---

## 🧩 Use Cases

- Municipal civic reporting
- Smart city dashboards
- Hackathons & demos
- MVPs for government-tech platforms

---

## 📜 License

MIT License
