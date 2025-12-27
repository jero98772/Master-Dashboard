// Utility functions

const Utils = {
    // Format seconds to MM:SS
    formatTime: (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    },

    // Format minutes to hours and minutes
    formatMinutes: (minutes) => {
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hours}h ${mins}m`;
    },

    // Calculate multiplier based on combo
    calculateMultiplier: (combo) => {
        if (combo >= CONFIG.multiplier.threshold5) {
            return CONFIG.multiplier.multiplier2_0;
        } else if (combo >= CONFIG.multiplier.threshold3) {
            return CONFIG.multiplier.multiplier1_5;
        }
        return 1.0;
    },

    // Calculate level progress percentage
    calculateLevelProgress: (minutes) => {
        return (minutes % CONFIG.level.pointsPerLevel) / CONFIG.level.pointsPerLevel * 100;
    },

    // Detect category from task name
    detectCategory: (taskName) => {
        if (!taskName) return 'other';
        
        const lowerTask = taskName.toLowerCase();
        
        // Check each category's keywords
        for (const [key, keywords] of Object.entries(CONFIG.categoryKeywords)) {
            if (key === 'other') continue;
            
            for (const keyword of keywords) {
                if (lowerTask.includes(keyword)) {
                    return key;
                }
            }
        }
        
        return 'other';
    },

    // Update time breakdown data
    updateTimeBreakdown: (timeData, category, minutes) => {
        const newTimeData = { ...timeData };
        
        // Add minutes to the category
        if (newTimeData[category]) {
            newTimeData[category].minutes += minutes;
        } else {
            newTimeData[category] = { minutes: minutes, percentage: 0 };
        }
        
        // Calculate total minutes
        const totalMinutes = Object.values(newTimeData).reduce((sum, cat) => sum + cat.minutes, 0);
        
        // Calculate percentages
        if (totalMinutes > 0) {
            for (const cat in newTimeData) {
                newTimeData[cat].percentage = Math.round((newTimeData[cat].minutes / totalMinutes) * 100);
            }
        }
        
        return newTimeData;
    },

    // Save state to localStorage
    saveState: (state) => {
        const { chatMessages, ...stateToSave } = state;
        localStorage.setItem('focusPointState', JSON.stringify(stateToSave));
    },

    // Load state from localStorage
    loadState: () => {
        const savedState = localStorage.getItem('focusPointState');
        return savedState ? JSON.parse(savedState) : null;
    },

    // Show notification
    showNotification: (message, setNotification) => {
        setNotification({ show: true, text: message });
        setTimeout(() => {
            setNotification({ show: false, text: '' });
        }, 3000);
    },

    // Check if combo should break due to inactivity
    shouldBreakCombo: (lastActivity) => {
        const inactiveTime = Date.now() - lastActivity;
        const timeoutMs = CONFIG.multiplier.inactivityTimeout * 60 * 1000;
        return inactiveTime > timeoutMs;
    },

    // Play notification sound (optional)
    playSound: (type) => {
        // You can add audio elements here
        // const audio = new Audio(`/static/sounds/${type}.mp3`);
        // audio.play();
    },

    // Get current scheduled task
    getCurrentScheduledTask: () => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        for (const item of CONFIG.schedule) {
            if (Utils.isTimeBetween(currentTime, item.start, item.end)) {
                return item;
            }
        }
        return null;
    },

    // Get next scheduled task
    getNextScheduledTask: () => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        
        // Find next task
        for (const item of CONFIG.schedule) {
            if (currentTime < item.start) {
                return item;
            }
        }
        
        // If no task found (past midnight), return first task of tomorrow
        return CONFIG.schedule[0];
    },

    // Check if current time is between start and end
    isTimeBetween: (current, start, end) => {
        // Handle overnight times (like 22:00 to 06:00)
        if (end < start) {
            return current >= start || current < end;
        }
        return current >= start && current < end;
    },

    // Calculate time until next task
    getTimeUntilTask: (taskTime) => {
        const now = new Date();
        const [hours, minutes] = taskTime.split(':').map(Number);
        
        const taskDate = new Date();
        taskDate.setHours(hours, minutes, 0, 0);
        
        // If task time has passed today, it's tomorrow
        if (taskDate < now) {
            taskDate.setDate(taskDate.getDate() + 1);
        }
        
        const diff = taskDate - now;
        const diffMinutes = Math.floor(diff / 60000);
        const diffHours = Math.floor(diffMinutes / 60);
        const remainingMinutes = diffMinutes % 60;
        
        if (diffHours > 0) {
            return `${diffHours}h ${remainingMinutes}m`;
        }
        return `${remainingMinutes}m`;
    }
};