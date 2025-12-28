# 🚀 FlowForge - Gamified Productivity Tracker (i dont  know the name)

A cyberpunk-themed productivity app that combines the Pomodoro Technique with gamification, rewards, and real-time progress tracking.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Python](https://img.shields.io/badge/python-3.8+-blue.svg)
![React](https://img.shields.io/badge/react-18-blue.svg)
![Flask](https://img.shields.io/badge/flask-2.0+-green.svg)

## ✨ Features

### 🎯 Core Productivity
- **Full Pomodoro Technique** - Complete 25-5-25-5-25-5-25-15 cycle implementation
- **Automatic Time Tracking** - Smart categorization by Work, Coding, Learning, Exercise
- **Daily Schedule Integration** - Shows current and next scheduled tasks
- **Visual Progress** - 365-day waffle chart of your journey
- **Multi-Category Streaks** - Track consistency across different areas

### 🎮 Gamification
- **Focus Points (FP)** - Earn points for every completed Pomodoro
- **Combo System** - Multiply your points with consistency (up to 5x!)
- **Level Progression** - Level up and unlock new features
- **Heart System** - Lives that reset daily
- **Reward Store** - Themes, power-ups, and unlockables
- **Quick Wins** - Daily micro-tasks for bonus points

### 🎨 Design & UX
- **Cyberpunk Aesthetic** - Neon colors, glowing effects, smooth animations
- **Fully Responsive** - Perfect on desktop (1920px+), tablet (768px), and mobile (320px+)
- **Touch Optimized** - 44px touch targets, no-zoom inputs, landscape support
- **Dark Mode Native** - Easy on the eyes for extended work sessions
- **GPU-Accelerated Animations** - Buttery smooth at 60fps

### 🔧 Advanced Features
- **Hacker News Integration** - Latest tech news on startup + `/news` command
- **Chat Terminal** - Command system (`/help`, `/stats`, `/news`)
- **Backend Persistence** - JSON file storage (no database required!)
- **Category Auto-Detection** - Smart keyword matching for task types
- **Privacy Mode** - Blur screen content with one click

## 📸 Preview

```
┌─────────────────────────────────────────────────────────┐
│  🎯 1,250 FP  ❤️❤️❤️  Level 5 ████████░░ 80%  [Store]  │
├──────────────────┬──────────────────┬───────────────────┤
│                  │                  │                   │
│  ⏰ POMODORO     │  📊 TIME         │  💬 HACKER        │
│     25:00        │     Work: 2h 30m │     > /news       │
│  [START] [RESET] │     Code: 1h 15m │     Latest...     │
│                  │                  │                   │
│  🔥 STREAKS      │  📅 WAFFLE       │  ⚡ COMBO         │
│     Work:   7🔥  │  [365-day grid]  │     3.5x          │
│     Code:   14🔥 │                  │                   │
└──────────────────┴──────────────────┴───────────────────┘
```

## 🚀 Quick Start

### Installation (30 seconds!)

```bash
# 1. Clone repository
git clone https://github.com/yourusername/flowforge.git
cd flowforge

# 2. Install dependencies
pip install flask requests

# 3. Run!
python app.py

# 4. Open browser
http://localhost:5000
```

That's it! No database, no complex setup. 🎉

### Mobile Access

Same WiFi network? Access from your phone:

```bash
# Find your IP
ipconfig      # Windows
ifconfig      # Mac/Linux

# Open on phone
http://YOUR_IP:5000
```

## 📂 Project Structure

```
flowforge/
├── app.py                    # Flask backend
├── user_data.json           # Auto-generated data file
├── templates/
│   └── index.html           # Main HTML
├── static/
│   ├── css/
│   │   └── style.css        # All styles (responsive included)
│   └── js/
│       ├── config.js        # Settings & schedule
│       ├── utils.js         # Helper functions
│       ├── api.js           # Backend API
│       ├── app-connected.js # Main React app
│       └── components/      # 11 React components
└── docs/                    # Guides
```

## ⚙️ Configuration

### Edit Your Daily Schedule

`static/js/config.js`:

```javascript
schedule: [
    { start: '06:00', end: '06:30', task: 'Morning routine', category: 'other' },
    { start: '09:00', end: '12:00', task: 'Deep Work', category: 'work' },
    { start: '13:00', end: '17:00', task: 'Coding', category: 'coding' },
    { start: '19:00', end: '20:00', task: 'Exercise', category: 'exercise' },
]
```

### Customize Categories

```javascript
timeCategories: [
    'Work 💼',
    'Coding 💻',
    'Design 🎨',    // Add your category
    'Learning 📚',
    'Other 📝'
],

categoryKeywords: {
    work: ['work', 'meeting', 'email'],
    coding: ['code', 'programming', 'debug'],
    design: ['design', 'ui', 'figma'],  // Add keywords
    // ...
}
```

### Adjust Pomodoro Timer

```javascript
pomodoro: {
    defaultDuration: 25,       // Work session (minutes)
    breakDuration: 5,          // Short break
    longBreakDuration: 15,     // Long break (every 4th)
    cyclesBeforeLongBreak: 4   // Number before long break
}
```

## 🎮 How to Use

### Basic Workflow

1. **Start Timer**
   - Enter task: "Build login feature"
   - Category auto-detects: Coding 💻
   - Click START

2. **Work 25 Minutes**
   - Earn +1 FP per minute
   - Bonus: +2 FP every 5 min
   - Complete: +5 FP bonus

3. **Take Break**
   - Short break: 5 minutes (sessions 1-3)
   - Long break: 15 minutes (session 4)

4. **Build Streaks**
   - Daily consistency = combo multiplier
   - Up to 5x your points!

### Chat Commands

```bash
/help    # Show all commands
/stats   # Your statistics  
/news    # Latest Hacker News
/yuri    # Random photo (70 FP)
```

### Earning FP (Focus Points)

| Action | Points |
|--------|--------|
| Every minute | +1 FP |
| Every 5 minutes | +2 FP bonus |
| Complete 25-min session | +5 FP bonus |
| Daily login | +10 FP |
| 7-day streak | +50 FP |
| Quick Wins (each) | +10 FP |
| Combo multiplier | Up to 5x! |

**Example**: 25-min session = 25 + 10 + 5 = 40 FP (or 200 FP with 5x combo!)

### Store Items

- ❤️ **Restore Heart** (150 FP) - Get a life back
- ⏭️ **Skip Task** (40 FP) - Skip current Pomodoro
- 🖼️ **Random Photo** (70 FP) - Motivational image

*More items coming soon!*

## 📊 Data & Privacy

### Local Storage Only
- All data in `user_data.json`
- No cloud sync
- No user accounts
- Single-user app

### Backup Your Data

```bash
# Backup
cp user_data.json backup_$(date +%Y%m%d).json

# Restore
cp backup_20241227.json user_data.json
```

## 🛠️ Development

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18 (CDN), Vanilla JS |
| Backend | Flask (Python) |
| Styling | Pure CSS (no frameworks) |
| Storage | JSON files |
| API | Hacker News Firebase API |

### Adding a Component

```javascript
// 1. Create: static/js/components/MyComponent.js
const MyComponent = ({ data }) => {
    return (
        <div className="box">
            <div className="box-title">My Component</div>
            {data}
        </div>
    );
};

// 2. Load in index.html
<script type="text/babel" src=".../MyComponent.js"></script>

// 3. Use in app-connected.js
<MyComponent data={state.myData} />
```

### Adding Store Items

```javascript
// config.js
store: {
    newItem: 100  // Price in FP
}

// StoreModal.js
{ name: 'New Item', emoji: '🎁', price: 100, id: 'newItem' }

// app-connected.js
case 'newItem':
    // Handle purchase
    break;
```

## 🎨 Customization

### Theme Colors

`static/css/style.css`:

```css
:root {
    --bg-dark: #0a0e1a;       /* Change background */
    --accent-cyan: #00ffff;   /* Change primary color */
    --accent-pink: #ff006e;   /* Change secondary */
    /* Edit all colors here */
}
```

### Fonts

```css
body {
    font-family: 'YourFont', monospace;
}
```

Import in `index.html`:
```html
<link href="https://fonts.googleapis.com/.../YourFont" rel="stylesheet">
```

## 📱 Responsive Design

| Device | Width | Layout |
|--------|-------|--------|
| Desktop | 1400px+ | 3 columns |
| Laptop | 1024-1400px | 2 columns |
| Tablet | 768-1024px | 2 columns |
| Mobile | 481-768px | 1 column |
| Small | 320-480px | 1 column (compact) |

**Mobile Priority Order:**
1. Timer (most important)
2. Current Activity
3. Streaks
4. Multiplier
5. Time Breakdown
6. Quick Wins
7. Waffle Chart
8. Chat (scroll to access)

## 🐛 Troubleshooting

### Port in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9  # Mac/Linux
netstat -ano | findstr :5000   # Windows
```

### Data Not Saving
1. Check `user_data.json` permissions
2. Check Flask console for errors
3. Verify browser console (F12)

### News Not Loading
```bash
# Install requests
pip install requests

# Check internet connection
# Check browser console
```

### Mobile Issues
1. Same WiFi network ✓
2. Firewall allows port 5000 ✓
3. Hard refresh (Ctrl+Shift+R) ✓

## 🚀 Production Deployment

⚠️ **Not recommended** - This is designed for local/personal use.

For production, you'd need:
- User authentication system
- Database (PostgreSQL/MySQL)
- WSGI server (Gunicorn)
- Reverse proxy (Nginx)
- SSL certificate

## 🤝 Contributing

Contributions welcome!

1. Fork the repo
2. Create feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open Pull Request

## 📝 License

GLPv3 License - See [LICENSE](LICENSE) file


## ⭐ Show Your Support

Give a ⭐ if this project helped you!

## 📧 Contact

Questions? Issues? Suggestions?

- Open an [Issue](https://github.com/yourusername/flowforge/issues)
- Start a [Discussion](https://github.com/yourusername/flowforge/discussions)

---

**Built with ❤️ and ☕ using the Pomodoro Technique**

*Stay focused. Level up. Achieve your goals.* 🚀

Made with productivity in mind 🎯