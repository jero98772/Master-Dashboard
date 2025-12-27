const { useState, useEffect, useRef } = React;

// Chat Command Handler
const useChatCommands = (state, setState, showNotificationMsg) => {
    const processCommand = (command) => {
        let response = { type: 'system', text: '' };

        if (command === CONFIG.chatCommands.help) {
            response.text = `>> Available commands:\n${CONFIG.chatCommands.help} - Show commands\n${CONFIG.chatCommands.stats} - Show your stats\n${CONFIG.chatCommands.yuri} - Random Yuri photo (costs ${CONFIG.store.yuriPhoto} FP)\n${CONFIG.chatCommands.news} - Hacker news feed`;
        } else if (command === CONFIG.chatCommands.stats) {
            response.text = `>> STATS:\nFP: ${state.fp}\nCombo: ${state.combo}x\nMultiplier: ${state.multiplier.toFixed(1)}x\nHearts: ${state.hearts}`;
        } else if (command === CONFIG.chatCommands.yuri) {
            if (state.fp >= CONFIG.store.yuriPhoto) {
                response.needsPurchase = true;
                response.type = 'reward';
            } else {
                response.text = `>> Insufficient FP. Need ${CONFIG.store.yuriPhoto} FP.`;
            }
        } else if (command === CONFIG.chatCommands.news) {
            response.text = `>> Latest hacker news:\n• New productivity framework released\n• Pomodoro technique gains AI integration\n• Focus Point gamification trending`;
        } else {
            response.text = `>> Unknown command. Type ${CONFIG.chatCommands.help} for available commands.`;
        }

        return response;
    };

    return { processCommand };
};

// Timer Hook
const useTimer = (state, setState, addFP, showNotificationMsg, syncToBackend) => {
    const timerInterval = useRef(null);

    const startTimer = (taskName) => {
        if (state.timerRunning) return;

        setState(prev => ({
            ...prev,
            timerRunning: true,
            currentTask: taskName || 'Focus Session'
        }));

        let elapsed = 0;

        timerInterval.current = setInterval(() => {
            setState(prev => {
                const newTimeRemaining = prev.timeRemaining - 1;
                elapsed++;

                // Reward system
                if (elapsed % 60 === 0) {
                    addFP(CONFIG.rewards.perMinute, 'pomodoro_minute');
                }
                if (elapsed % 300 === 0) {
                    addFP(CONFIG.rewards.per5Minutes, 'pomodoro_5min');
                }
                if (elapsed === CONFIG.pomodoro.defaultDuration * 60) {
                    addFP(CONFIG.rewards.per25Minutes, 'pomodoro_complete');
                    showNotificationMsg(`🎉 Pomodoro Complete! +${CONFIG.rewards.per25Minutes} FP Bonus!`);
                    resetTimer();
                    
                    const newCombo = prev.combo + 1;
                    const newMultiplier = Utils.calculateMultiplier(newCombo);
                    
                    // Sync combo to backend
                    API.updateCombo(newCombo, newMultiplier);
                    
                    return {
                        ...prev,
                        combo: newCombo,
                        multiplier: newMultiplier
                    };
                }

                return {
                    ...prev,
                    timeRemaining: newTimeRemaining,
                    lastActivity: Date.now()
                };
            });
        }, 1000);
    };

    const resetTimer = () => {
        clearInterval(timerInterval.current);
        setState(prev => ({
            ...prev,
            timerRunning: false,
            timeRemaining: CONFIG.pomodoro.defaultDuration * 60,
            currentTask: 'No active task'
        }));
    };

    useEffect(() => {
        return () => clearInterval(timerInterval.current);
    }, []);

    return { startTimer, resetTimer };
};

// Main App Component
function App() {
    // Initial state
    const [state, setState] = useState({
        fp: 0,
        minutes: 0,
        hearts: CONFIG.hearts.startingHearts,
        privacy: false,
        streaks: { porn: 0, routine: 0, code: 0 },
        combo: 0,
        multiplier: 1.0,
        quickWins: [false, false, false, false],
        timerRunning: false,
        timeRemaining: CONFIG.pomodoro.defaultDuration * 60,
        lastActivity: Date.now(),
        currentTask: 'No active task',
        chatMessages: [
            { type: 'system', text: '>> System initialized. Type /help for commands.' }
        ],
        timeData: {
            coding: { minutes: 0, percentage: 0 },
            learning: { minutes: 0, percentage: 0 },
            exercise: { minutes: 0, percentage: 0 },
            other: { minutes: 0, percentage: 0 }
        },
        loading: true
    });

    const [showStore, setShowStore] = useState(false);
    const [notification, setNotification] = useState({ show: false, text: '' });
    const [chatInput, setChatInput] = useState('');
    const [taskInput, setTaskInput] = useState('');

    // Load data from backend on mount
    useEffect(() => {
        loadFromBackend();
    }, []);

    const loadFromBackend = async () => {
        const data = await API.getUserData();
        if (data) {
            setState(prev => ({
                ...prev,
                fp: data.fp || 0,
                minutes: data.minutes || 0,
                hearts: data.hearts || CONFIG.hearts.startingHearts,
                privacy: data.privacy || false,
                streaks: data.streaks || { porn: 0, routine: 0, code: 0 },
                combo: data.combo || 0,
                multiplier: data.multiplier || 1.0,
                quickWins: data.quickWins || [false, false, false, false],
                timeData: data.timeData || prev.timeData,
                loading: false
            }));
        } else {
            setState(prev => ({ ...prev, loading: false }));
        }
    };

    // Sync state to backend periodically
    useEffect(() => {
        if (state.loading) return;

        const syncInterval = setInterval(() => {
            syncToBackend();
        }, 30000); // Sync every 30 seconds

        return () => clearInterval(syncInterval);
    }, [state]);

    const syncToBackend = async () => {
        const dataToSync = {
            fp: state.fp,
            minutes: state.minutes,
            hearts: state.hearts,
            privacy: state.privacy,
            streaks: state.streaks,
            combo: state.combo,
            multiplier: state.multiplier,
            quickWins: state.quickWins,
            timeData: state.timeData
        };

        await API.saveProgress(dataToSync);
    };

    // Check combo inactivity
    useEffect(() => {
        const comboCheckInterval = setInterval(() => {
            if (Utils.shouldBreakCombo(state.lastActivity) && state.combo > 0) {
                setState(prev => ({
                    ...prev,
                    combo: 0,
                    multiplier: 1.0
                }));
                API.updateCombo(0, 1.0);
            }
        }, 60000);

        return () => clearInterval(comboCheckInterval);
    }, [state.lastActivity, state.combo]);

    // Add FP with multiplier and sync to backend
    const addFP = async (amount, source = 'manual') => {
        const earned = Math.floor(amount * state.multiplier);
        
        // Update local state immediately
        setState(prev => ({
            ...prev,
            fp: prev.fp + earned,
            minutes: prev.minutes + amount,
            lastActivity: Date.now()
        }));
        
        // Sync to backend
        await API.addFP(earned, source);
        
        Utils.showNotification(`+${earned} FP earned!`, setNotification);
    };

    // Custom hooks
    const { processCommand } = useChatCommands(state, setState, (msg) => Utils.showNotification(msg, setNotification));
    const { startTimer, resetTimer } = useTimer(state, setState, addFP, (msg) => Utils.showNotification(msg, setNotification), syncToBackend);

    // Quick wins
    const completeQuickWin = async (index, fp) => {
        if (state.quickWins[index]) return;

        // Call backend to complete quick win
        const result = await API.completeQuickWin(index, fp);
        
        if (result && result.success) {
            // Update local state with backend data
            setState(prev => ({
                ...prev,
                quickWins: result.data.quickWins,
                fp: result.data.fp,
                combo: result.data.combo,
                multiplier: result.data.multiplier
            }));
            
            Utils.showNotification(`+${fp} FP earned!`, setNotification);
        }
    };

    // Chat commands
    const sendCommand = async () => {
        if (!chatInput.trim()) return;

        const newMessages = [...state.chatMessages, { type: 'user', text: `> ${chatInput}` }];
        const response = processCommand(chatInput);
        
        // Handle /yuri purchase
        if (response.needsPurchase) {
            try {
                const result = await API.purchaseItem('yuri', CONFIG.store.yuriPhoto);
                if (result.success) {
                    response.text = `>> Photo unlocked! 📸`;
                    response.image = `https://picsum.photos/300/400?random=${Math.random()}`;
                    setState(prev => ({ 
                        ...prev, 
                        fp: result.data.fp 
                    }));
                }
            } catch (error) {
                response.text = `>> ${error.message}`;
                response.type = 'system';
            }
        }
        
        newMessages.push(response);

        setState(prev => ({
            ...prev,
            chatMessages: newMessages
        }));

        setChatInput('');
    };

    // Store functions
    const buyItem = async (type, cost) => {
        try {
            const result = await API.purchaseItem(type, cost);
            
            if (result.success) {
                // Update local state with backend data
                setState(prev => ({
                    ...prev,
                    fp: result.data.fp,
                    hearts: result.data.hearts
                }));

                if (type === 'heart') {
                    Utils.showNotification('❤️ Heart restored!', setNotification);
                } else if (type === 'skip') {
                    Utils.showNotification('⏭️ Task skipped!', setNotification);
                } else if (type === 'yuri') {
                    const photoMsg = {
                        type: 'reward',
                        text: '>> Yuri photo unlocked!',
                        image: `https://picsum.photos/300/400?random=${Math.random()}`
                    };
                    setState(prev => ({
                        ...prev,
                        chatMessages: [...prev.chatMessages, photoMsg]
                    }));
                    Utils.showNotification('🖼️ Photo unlocked!', setNotification);
                }

                setShowStore(false);
            }
        } catch (error) {
            Utils.showNotification(error.message, setNotification);
        }
    };

    // Privacy toggle with backend sync
    const togglePrivacy = () => {
        const newPrivacy = !state.privacy;
        setState(prev => ({ ...prev, privacy: newPrivacy }));
        API.saveProgress({ privacy: newPrivacy });
    };

    // Calculate activity progress
    const activityProgress = state.timerRunning 
        ? ((CONFIG.pomodoro.defaultDuration * 60 - state.timeRemaining) / (CONFIG.pomodoro.defaultDuration * 60) * 100) 
        : 0;

    if (state.loading) {
        return (
            <div className="container" style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '100vh' 
            }}>
                <div style={{ fontSize: '24px', color: 'var(--accent-cyan)' }}>
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="container">
            <TopMenu 
                state={state}
                onPrivacyToggle={togglePrivacy}
            />

            <div className="grid">
                <Streaks streaks={state.streaks} privacy={state.privacy} />
                
                <TimeBreakdown timeData={state.timeData} />
                
                <ChatTerminal 
                    messages={state.chatMessages}
                    input={chatInput}
                    onInputChange={setChatInput}
                    onSendCommand={sendCommand}
                />
                
                <WaffleChart />
                
                <PomodoroTimer 
                    timeRemaining={state.timeRemaining}
                    isRunning={state.timerRunning}
                    taskInput={taskInput}
                    onTaskInputChange={setTaskInput}
                    onStart={() => startTimer(taskInput)}
                    onReset={resetTimer}
                />
                
                <CurrentActivity 
                    taskName={state.currentTask}
                    progress={activityProgress}
                    timeRemaining={state.timeRemaining}
                    isRunning={state.timerRunning}
                />
                
                <MomentumMultiplier 
                    multiplier={state.multiplier}
                    combo={state.combo}
                />
                
                <QuickWins 
                    completedWins={state.quickWins}
                    onComplete={completeQuickWin}
                />
            </div>

            <button className="store-button" onClick={() => setShowStore(true)}>🛒</button>

            <StoreModal 
                isOpen={showStore}
                currentFP={state.fp}
                onClose={() => setShowStore(false)}
                onPurchase={buyItem}
            />

            <Notification show={notification.show} text={notification.text} />
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);