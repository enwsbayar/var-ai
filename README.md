# ⚽ var-mı? — AI Football Position Analyzer

Upload football match clips or paste a YouTube link — let the AI analyze it like a VAR referee.

---

## 🎯 Features

- 📁 **Video Upload** — Drag & drop or select a file (MP4, MOV, AVI, WebM)
- ▶️ **YouTube Link** — Paste a YouTube URL and instantly preview the thumbnail
- 🤖 **AI Analysis** — Foul, penalty, offside, and card decisions
- 📋 **Referee Commentary** — Detailed VAR report based on FIFA rules
- ⏱️ **Timeline** — Jump to key moments in the video with a single click
- 📤 **Share & Download** — Copy results as text or download as JSON

---

## 📸 Screenshots

| Upload Page | Analysis Results |
|:-----------:|:----------------:|
| ![Upload Page](assets/screenshot-upload.png) | ![Analysis Page](assets/screenshot-analysis.png) |

---

## 🚀 Getting Started

### Requirements
- [Node.js](https://nodejs.org/) v18 or higher
- npm

### Steps

```bash
# 1. Clone the repository
git clone https://github.com/enwsbayar/var-ai.git
cd var-ai

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev
```

Open **http://localhost:5173** in your browser.

---

## 🏗️ Project Structure

```
src/
├── pages/
│   ├── Home.jsx          # Landing page
│   ├── Upload.jsx        # Video upload (file + YouTube)
│   └── Analysis.jsx      # Analysis results
├── components/
│   └── Navbar.jsx
└── services/
    └── aiAnalysis.js     # AI analysis service (mock → ready for Gemini)
```

---

## 🤖 AI Integration

The app currently uses a **simulated** (mock) AI service.  
The recommended solution for real AI integration is **Google Gemini Video API**:

- Directly analyzes YouTube links (no download needed)
- Processes video files frame by frame
- Generates referee commentary based on FIFA rules

For real integration, connect the functions in `src/services/aiAnalysis.js` to a backend endpoint.

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | React 18 + Vite |
| Routing | React Router v6 |
| Styling | Vanilla CSS (custom dark mode) |
| Icons | Lucide React |
| Font | Inter + Bebas Neue (Google Fonts) |

---

