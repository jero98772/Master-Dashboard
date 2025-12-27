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
    }
};
