# 🌸 GlowMind AI — AI-Powered MERN Notes Workspace
![GlowMind AI Preview](./assets/image.png)

GlowMind AI is a full-stack MERN application that combines intelligent note-taking, secure authentication, and a calming productivity-focused user experience. Built using MongoDB, Express.js, React, and Node.js, the platform allows users to securely create, manage, and organize notes in a modern glassmorphism-inspired workspace.

The application features JWT-based authentication, Google OAuth integration, MongoDB Atlas cloud storage, cloud-synced notes across all devices, a Chrome Extension that floats over any website, responsive design, and an AI-ready architecture for future integration with LLMs such as OpenAI GPT and Google Gemini.

## 🚀 Live Deployment

### Frontend
https://glowmind-mkql.vercel.app/

### Backend API
https://glowmind.onrender.com/

---

## ✨ Features

* 🔐 Secure Authentication (JWT + Google OAuth)
* 📝 Personal Note Management per Website
* ☁️ Cloud Sync — notes saved to MongoDB Atlas and available on every device
* 🌐 Chrome Extension — a ✨ button that floats over every site you visit
* 🎨 Glassmorphism & Pastel-Themed UI
* 📱 Fully Responsive Design
* ⚡ Fast React + Vite Frontend
* 🔄 REST API with Express.js
* 🤖 AI-Ready Architecture for Future LLM Integration

---

## ☁️ Cloud Sync

Notes are stored directly in MongoDB Atlas linked to your account — not in your browser. This means:

- ✅ Sign in on your laptop, phone, or any other device and see all your notes
- ✅ Notes saved from the Chrome Extension on one machine appear on another
- ✅ Clearing browser data never wipes your notes
- ✅ Each website you visit gets its own separate notebook, all backed by the cloud

---

## 🧩 Chrome Extension

![Extension UI](./assets/img2.png)

GlowMind AI comes as a Chrome Extension that injects a ✨ floating button on every website you visit. Click it to open your notes sidebar without ever leaving the page.

## 🧩 How to Install Chrome Extension 
1. Clone or download the repository
2. Open Chrome and go to :chrome://extensions/
3. Enable **Developer Mode** (top right corner)
4.  Click **Load Unpacked**
5. Navigate to the folder: GlowMind Extension/ 
6. Select the folder and load it 
7. Pin the extension to your toolbar ✨
---

## 🛠️ Tech Stack

### Frontend
* React.js
* Vite
* React Router DOM
* Context API
* CSS3

### Backend
* Node.js
* Express.js
* JWT Authentication
* Google OAuth
* Express Validator
* Bcrypt.js

### Database
* MongoDB Atlas
* Mongoose ODM

### Deployment & Cloud
* Vercel (Frontend Hosting)
* Render (Backend Hosting)
* MongoDB Atlas (Database + Cloud Sync)

---

## 📂 Project Structure

```text
glowmind-ai/
├── src/
│   ├── pages/            
│   ├── auth/             
│   ├── components/       
│   ├── hooks/            
│   ├── utils/            
│   └── styles/           
│
├── server/
│   ├── middleware/       
│   ├── models/           
│   ├── routes/          
│   ├── db.js
│   └── index.js
│
└── README.md
```

---

## 👩‍💻 Author

**Apurva Jain**

GitHub: https://github.com/APURVA122

LinkedIn: https://www.linkedin.com/in/apurva-jain-9462a7330/

---

⭐ If you found this project interesting, consider giving it a star on GitHub.
