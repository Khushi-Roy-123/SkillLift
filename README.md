
# SkillLift - Empowering Women in STEM

SkillLift is a comprehensive, AI-powered web application designed to empower, support, and inspire women in STEM (Science, Technology, Engineering, and Mathematics) fields. 

Beyond just career growth, SkillLift recognizes the importance of holistic success. It combines professional mentorship, gamified learning, and community support with essential **life balance tools** to help users thrive personally and professionally.

Live Link : ["https://stem-verse-1.onrender.com"]

## ✨ Features

### 🚀 Career & Growth
- **AI Mentor (Ask SkillLift)**: A 24/7 AI companion powered by Google Gemini. Ask technical questions, get career advice, or find specific scholarships using its Retrieval-Augmented Generation (RAG) capabilities.
- **SkillQuest Gamification**: Turn your career path into an RPG. Choose a track (e.g., Software Developer, Data Scientist), complete quests, earn XP, level up, and unlock exclusive badges.
- **Opportunities Hub**: A searchable, filterable database of scholarships, internships, grants, and conferences. Save your favorites and track deadlines.
- **AI Resume Analyzer**: Paste your resume to get instant, AI-driven feedback with a score, strengths, and actionable improvements tailored for STEM roles.
- **Inspiration Hub**: Explore profiles of pioneering women in history. Includes video features, biographies, and an AI-powered "Surprise Me" search.

### 🧘‍♀️ Life Balance & Wellbeing
- **Life Balance Hub**: A dashboard dedicated to personal productivity and health.
    - **Smart Tasks**: Organize to-dos with 'Home', 'Work', and 'Personal' categories and visual tags.
    - **Focus Zone**: A built-in Pomodoro timer (25m Focus / 5m Break) to manage deep work sessions.
    - **Hydration Station**: A gamified tracker to ensure you drink enough water throughout the day.
    - **Zen Breath**: An interactive breathing widget for instant stress relief.
    - **Meal Genius**: Enter your available ingredients, and our AI will suggest a healthy, quick recipe.
    - **Life Hacks**: Get daily tips for productivity, sleep hygiene, and stress management.
- **Wellbeing Hub**: Track your daily mood and receive gentle, AI-generated mental wellness tips. Chat with "Aura", a supportive AI listener.

### 🤝 Community
- **Community Forum**: A safe space to ask questions, share knowledge, and connect with peers. Features include tagging, upvoting, and threading.
- **User Dashboard**: A personalized home screen showing your gamification progress, recent notifications, and quick access to all tools.

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **AI Integration**: Google Gemini API (`@google/genai`)
- **State Management**: React Hooks & Context
- **Data Persistence**: LocalStorage (Client-side)
- **Icons**: Custom SVG Component System

## ⚙️ Configuration

To enable the AI features, you need to configure your environment variables.

1.  Open the `.env` file in the project root.
2.  Add your Google Gemini API key:

```env
API_KEY=your_actual_api_key_here
MONGODB_URI=your_mongodb_connection_string_here
```

*Note: The `MONGODB_URI` is currently a placeholder. This version of SkillLift runs entirely in the browser using LocalStorage for data persistence. A backend service is required to utilize MongoDB.*

## 🚀 Getting Started

Follow these instructions to run the project locally.

### Prerequisites

- [Visual Studio Code](https://code.visualstudio.com/)
- [Git](https://git-scm.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/skill-lift.git
    cd skill-lift
    ```

2.  **Open in VS Code:**
    ```bash
    code .
    ```

3.  **Install "Live Server":**
    - Go to Extensions (`Ctrl+Shift+X`).
    - Search for **Live Server** by Ritwick Dey.
    - Install it.

4.  **Run the App:**
    - Right-click `index.html`.
    - Select **Open with Live Server**.
    - The app will launch in your default browser at `http://127.0.0.1:5500`.

## 📂 Project Structure

```
/
├── .env                # Environment variables
├── public/             # Static assets (icons, manifest)
├── src/
│   ├── components/     # Reusable UI components
│   │   ├── icons/      # SVG Icon system
│   │   └── ...
│   ├── pages/          # Main application pages
│   │   ├── LifeBalancePage.tsx  # Productivity tools
│   │   ├── SkillQuestPage.tsx   # Gamification logic
│   │   └── ...
│   ├── services/       # API and Data logic
│   │   ├── geminiService.ts     # AI integration
│   │   └── ...
│   ├── utils/          # Helpers (Auth, Dates, Gamification)
│   ├── App.tsx         # Routing and Global State
│   └── types.ts        # TypeScript definitions
└── index.html          # Entry point
```

---
*SkillLift is an open-source initiative to bridge the gender gap in tech.*
