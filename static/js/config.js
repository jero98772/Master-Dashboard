// Configuration file for easy customization
const CONFIG = {
    // Reward System
    rewards: {
        perMinute: 1,           // FP earned per minute
        per5Minutes: 2,         // Bonus FP every 5 minutes
        per25Minutes: 5,        // Bonus FP for completing Pomodoro
        activeDay: 15           // FP for being active each day
    },

    // Pomodoro Settings
    pomodoro: {
        defaultDuration: 25,    // Work session minutes
        breakDuration: 5,       // Short break minutes
        longBreakDuration: 15,  // Long break minutes (after 4th pomodoro)
        cyclesBeforeLongBreak: 4 // Number of pomodoros before long break
    },

    // Multiplier System
    multiplier: {
        threshold3: 3,          // Activities for 1.5x multiplier
        threshold5: 5,          // Activities for 2.0x multiplier
        multiplier1_5: 1.5,
        multiplier2_0: 2.0,
        inactivityTimeout: 30   // Minutes before combo breaks
    },

    // Level System
    level: {
        pointsPerLevel: 100     // Minutes needed to level up
    },

    // Hearts System
    hearts: {
        maxHearts: 1,           // Maximum hearts allowed
        startingHearts: 1       // Starting hearts
    },

    // Store Prices
    store: {
        restoreHeart: 150,
        skipTask: 40,
        yuriPhoto: 70
    },

    // Quick Wins
    quickWins: [
        { text: 'Drank water', fp: 1 },
        { text: 'Stretched/Moved', fp: 3 },
        { text: 'Logged progress', fp: 2 },
        { text: 'Helped someone', fp: 3 }
    ],

    // Time Breakdown Categories
    timeCategories: [
        'Work 💼',
        'Coding 💻',
        'Learning 📚',
        'Exercise 🏃',
        'Other 📝'
    ],

    // Category Keywords (for auto-categorization)
    categoryKeywords: {
        work: ['work', 'meeting', 'call', 'email', 'task', 'project', 'planning', 'admin'],
        coding: ['code', 'coding', 'programming', 'debug', 'develop', 'script', 'app', 'website', 'software', 'python', 'javascript', 'react', 'css', 'html'],
        learning: ['learn', 'study', 'read', 'course', 'tutorial', 'book', 'research', 'documentation', 'docs'],
        exercise: ['exercise', 'workout', 'gym', 'run', 'walk', 'yoga', 'fitness', 'sport'],
        other: []
    },

    // Chat Commands
    chatCommands: {
        help: '/help',
        stats: '/stats',
        yuri: '/yuri',
        news: '/news'
    }
};