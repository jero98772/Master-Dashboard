// API Service - handles all backend communication
const API = {
    baseURL: window.location.origin,

    // Fetch user data from backend
    async getUserData() {
        try {
            const response = await fetch(`${this.baseURL}/api/user-data`);
            if (!response.ok) throw new Error('Failed to fetch user data');
            return await response.json();
        } catch (error) {
            console.error('Error fetching user data:', error);
            return null;
        }
    },

    // Update user data on backend
    async updateUserData(data) {
        try {
            const response = await fetch(`${this.baseURL}/api/user-data`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) throw new Error('Failed to update user data');
            return await response.json();
        } catch (error) {
            console.error('Error updating user data:', error);
            return null;
        }
    },

    // Save progress (FP, streaks, hearts, minutes, etc.)
    async saveProgress(progressData) {
        try {
            const response = await fetch(`${this.baseURL}/api/save-progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(progressData)
            });
            if (!response.ok) throw new Error('Failed to save progress');
            return await response.json();
        } catch (error) {
            console.error('Error saving progress:', error);
            return null;
        }
    },

    // Purchase item from store
    async purchaseItem(itemType, cost) {
        try {
            const response = await fetch(`${this.baseURL}/api/purchase`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: itemType, cost: cost })
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Purchase failed');
            }
            
            return data;
        } catch (error) {
            console.error('Error purchasing item:', error);
            throw error;
        }
    },

    // Increment streak
    async incrementStreak(streakType) {
        try {
            const response = await fetch(`${this.baseURL}/api/increment-streak`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ type: streakType })
            });
            if (!response.ok) throw new Error('Failed to increment streak');
            return await response.json();
        } catch (error) {
            console.error('Error incrementing streak:', error);
            return null;
        }
    },

    // Add FP (new endpoint)
    async addFP(amount, source) {
        try {
            const response = await fetch(`${this.baseURL}/api/add-fp`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: amount, source: source })
            });
            if (!response.ok) throw new Error('Failed to add FP');
            return await response.json();
        } catch (error) {
            console.error('Error adding FP:', error);
            return null;
        }
    },

    // Complete quick win
    async completeQuickWin(index, fp) {
        try {
            const response = await fetch(`${this.baseURL}/api/quick-win`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ index: index, fp: fp })
            });
            if (!response.ok) throw new Error('Failed to complete quick win');
            return await response.json();
        } catch (error) {
            console.error('Error completing quick win:', error);
            return null;
        }
    },

    // Update combo
    async updateCombo(combo, multiplier) {
        try {
            const response = await fetch(`${this.baseURL}/api/update-combo`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ combo: combo, multiplier: multiplier })
            });
            if (!response.ok) throw new Error('Failed to update combo');
            return await response.json();
        } catch (error) {
            console.error('Error updating combo:', error);
            return null;
        }
    },

    // Get Hacker News stories
    async getHackerNews() {
        try {
            const response = await fetch(`${this.baseURL}/api/hacker-news`);
            if (!response.ok) throw new Error('Failed to fetch Hacker News');
            return await response.json();
        } catch (error) {
            console.error('Error fetching Hacker News:', error);
            return null;
        }
    }
};