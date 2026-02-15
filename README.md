<div align="center">
  <br />
    <a href="https://ai-ticket-assistant-4qfw.vercel.app/" target="_blank">
      <img src="https://github.com/Jasan-Aj/AI-Ticket-assistant/blob/main/front-end/public/Gemini_Generated_Image_v2rx9iv2rx9iv2rx.png" alt="Tick Flow Banner">
    </a>
  <br />

  <div>
    <img src="https://img.shields.io/badge/-React-black?style=for-the-badge&logoColor=61DAFB&logo=react&color=20232a"/>
    <img src="https://img.shields.io/badge/-Node.js-black?style=for-the-badge&logoColor=339933&logo=node.js&color=black"/>
    <img src="https://img.shields.io/badge/-MongoDB-black?style=for-the-badge&logoColor=47A248&logo=mongodb&color=black"/>
    <img src="https://img.shields.io/badge/Gemini_2.5_Flash-4285F4?style=for-the-badge&logo=google-gemini&logoColor=white">
    <br/>
    <img src="https://img.shields.io/badge/Inngest-black?style=for-the-badge&logo=inngest&logoColor=white&color=000000">
    <img src="https://img.shields.io/badge/-Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/-JWT-black?style=for-the-badge&logoColor=white&logo=json-web-tokens&color=black"/>
  </div>

  <h3 align="center">Tick Flow: AI-Powered Ticketing Assistant</h3>

  <div align="center">
    An intelligent helpdesk solution that bridges the gap between AI automation and human moderation.
  </div>
</div>

---

## 📋 Table of Contents

1. ✨ [Introduction](#-introduction)
2. ⚙️ [Tech Stack](#-tech-stack)
3. 🔋 [Features](#-features)
4. 🤸 [Installation & Setup](#-installation--setup)
5. 📁 [Project Structure](#-project-structure)

## ✨ <a name="introduction">Introduction</a>

**Tick Flow** is a high-performance, AI-driven ticketing system designed to streamline customer support. When a user submits a "doubt," the system triggers a background workflow using **Inngest** and **Gemini 2.5 Flash**. The AI instantly analyzes the query to generate a suggested solution and key "helpful points." 

The ticket is then automatically assigned to an available moderator who reviews the AI's insights to provide a fast, accurate response. With real-time progress tracking and role-based access control, Tick Flow ensures that every user query is handled with both AI efficiency and human expertise.

## ⚙️ <a name="tech-stack">Tech Stack</a>

- **Gemini 2.5 Flash**: Acts as the primary intelligence engine for ticket analysis and draft generation.
- **Inngest**: Manages event-driven background tasks like AI analysis and auto-assignment.
- **MERN Stack**: (MongoDB, Express, React, Node.js) Provides a scalable full-stack foundation.
- **TailwindCSS**: Powers the modern, responsive dashboard UI.
- **JWT & Bcrypt**: Handles secure, role-based authentication and password salting.


## 🔋 <a name="features">Features</a>

👉 **Landing Page**: A fast, engaging homepage that introduces your brand and products with smooth animations and clear calls to action.

👉 **Product Listing Page**: Browse all products with filters, sorting, and real-time availability—powered by Devin AI-generated content for dynamic updates.

👉 **Product Details Page**: Detailed product info, images, and reviews with AI-enhanced descriptions to help customers make confident buying decisions.

👉 **Auth Pages**: Secure and seamless user signup, login, and password recovery using Better Auth, ensuring smooth access without backend hassles.
## 🤸 <a name="installation--setup">Installation & Setup</a>

Follow these steps to get the project running locally.

### 1. Prerequisites
- [Git](https://git-scm.com/), [Node.js](https://nodejs.org/), and [MongoDB](https://www.mongodb.com/) installed.
- A **Gemini API Key** from [Google AI Studio](https://aistudio.google.com/).

### 2. Cloning & Installation
```bash
# Clone the repository
git clone [https://github.com/your-username/tick-flow.git](https://github.com/your-username/tick-flow.git)
cd tick-flow

# Install Back-end dependencies
cd back-end
npm install

# Install Front-end dependencies
cd ../front-end
npm install

### 3. Install Back-end dependencies
```bash
cd back-end
npm install
```

### 4. Install Front-end dependencies
```bash
cd ../front-end
npm install
```

### 3. env back-end
```bash
PORT=5000
MONGODB_URI="your_mongodb_connection_string"
JWT_SECRET="your_secret_key"
GEMINI_API_KEY="your_google_gemini_api_key"
NODE_ENV = "local"
FRONT_END_URL = "http://localhost:5173"   

INNGEST_EVENT_KEY ="Your key"
INNGEST_SIGNING_KEY ="Your key"

MAILTRAP_SMTP_HOST ="Your key"
MAILTRAP_SMTP_PORT ="Your key"
MAILTRAP_SMTP_USER ="Your key"
MAILTRAP_SMTP_PASS ="Your key"

GEMINI_API_KEY= AIzaSyCs2MaIUlYMsgzWCAEeRBjqSnmzjVFCY7U
```

### 3. env front-end
```bash
VITE_URL = "your back-end url/api"
```
### 4. Running the Project

```bash
# Start Back-end (In back-end terminal)
npm start

# Start Front-end (In front-end terminal)
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser to view the project.

## 📁 Project Structure
```
.
├── back-end/
│   ├── controllers/         # Logic for tickets and users
│   ├── database/            # MongoDB connection config
│   ├── inngest/             # Background workers & AI event functions
│   ├── middlewares/         # JWT & Role-based auth protection
│   ├── models/              # Mongoose schemas (Ticket, User)
│   ├── routers/             # API Route definitions
│   └── utils/               # AI Agents (Gemini) and Mailer services
└── front-end/
    ├── src/
    │   ├── components/      # Reusable UI (Navbar, Header, Ticket Cards)
    │   ├── pages/           # Admin, Mod, and User specific views
    │   └── main.jsx         # React entry point
    └── vite.config.js       # Frontend build configuration
```


