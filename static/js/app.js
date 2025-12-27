const { useState, useEffect, useRef } = React;

// Main App Component
function App() {
    // State management
    const [state, setState] = useState({
        fp: 0,
        minutes: 0,
        hearts: 1,
        privacy: false,
        streaks: { porn: 0, routine: 0, code: 0 },
        combo: 0,
        multiplier: 1.0,
        quickWins: [false, false, false, false],
        timerRunning: false,
        timeRemaining: 25 * 60,
        lastActivity: Date.now(),
        currentTask: 'No active task',
        chatMessages: [
            { type: 'system', text: '>> System initialized. Type /help for commands.' }
        ]
    });

    const [showStore, setShowStore] = useState(false);
    const [notification, setNotification] = useState({ show: false, text: '' });
    const [chatInput, setChatInput] = useState('');
    const [taskInput, setTaskInput] = useState('');
    const timerInterval = useRef(null);
    const comboCheckInterval = useRef(null);

    // Load state from localStorage on mount
    useEffect(() => {
        const savedState = localStorage.getItem('focusPointState');
        if (savedState) {
            const loaded = JSON.parse(savedState);
            setState(prev => ({ ...prev, ...loaded, chatMessages: prev.chatMessages }));
        }
    }, []);

    // Auto-save state
    useEffect(() => {
        const saveInterval = setInterval(() => {
            const { chatMessages, ...stateToSave } = state;
            localStorage.setItem('focusPointState', JSON.stringify(stateToSave));
        }, 30000);

        return () => clearInterval(saveInterval);
    }, [state]);

    // Check combo inactivity
    useEffect(() => {
        comboCheckInterval.current = setInterval(() => {
            const inactiveTime = Date.now() - state.lastActivity;
            if (inactiveTime > 30 * 60 * 1000 && state.combo > 0) {
                setState(prev => ({
                    ...prev,
                    combo: 0,
                    multiplier: 1.0
                }));
            }
        }, 60000);

        return () => clearInterval(comboCheckInterval.current);
    }, [state.lastActivity, state.combo]);

    // Add FP with multiplier
    const addFP = (amount) => {
        const earned = Math.floor(amount * state.multiplier);
        setState(prev => ({
            ...prev,
            fp: prev.fp + earned,
            minutes: prev.minutes + amount,
            lastActivity: Date.now()
        }));
        showNotificationMsg(`+${earned} FP earned!`);
    };

    // Update multiplier based on combo
    const updateMultiplier = (newCombo) => {
        let multiplier = 1.0;
        if (newCombo >= 5) {
            multiplier = 2.0;
        } else if (newCombo >= 3) {
            multiplier = 1.5;
        }
        return multiplier;
    };

    // Timer functions
    const startTimer = () => {
        if (state.timerRunning) return;

        const taskName = taskInput || 'Focus Session';
        
        setState(prev => ({
            ...prev,
            timerRunning: true,
            currentTask: taskName
        }));

        let elapsed = 0;

        timerInterval.current = setInterval(() => {
            setState(prev => {
                const newTimeRemaining = prev.timeRemaining - 1;
                elapsed++;

                // Reward system
                if (elapsed % 60 === 0) {
                    addFP(1); // Every minute
                }
                if (elapsed % 300 === 0) {
                    addFP(2); // Every 5 minutes
                }
                if (elapsed === 1500) {
                    addFP(5); // 25 minutes
                    showNotificationMsg('🎉 Pomodoro Complete! +5 FP Bonus!');
                    resetTimer();
                    const newCombo = prev.combo + 1;
                    return {
                        ...prev,
                        combo: newCombo,
                        multiplier: updateMultiplier(newCombo)
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
            timeRemaining: 25 * 60,
            currentTask: 'No active task'
        }));
    };

    // Quick wins
    const completeQuickWin = (index, fp) => {
        if (state.quickWins[index]) return;

        const newQuickWins = [...state.quickWins];
        newQuickWins[index] = true;
        const newCombo = state.combo + 1;

        setState(prev => ({
            ...prev,
            quickWins: newQuickWins,
            combo: newCombo,
            multiplier: updateMultiplier(newCombo)
        }));

        addFP(fp);
    };

    // Chat commands
    const sendCommand = () => {
        if (!chatInput.trim()) return;

        const newMessages = [...state.chatMessages, { type: 'user', text: `> ${chatInput}` }];

        let response = { type: 'system', text: '' };

        if (chatInput === '/help') {
            response.text = `>> Available commands:\n/help - Show commands\n/stats - Show your stats\n/yuri - Random Yuri photo (costs 70 FP)\n/news - Hacker news feed`;
        } else if (chatInput === '/stats') {
            response.text = `>> STATS:\nFP: ${state.fp}\nCombo: ${state.combo}x\nMultiplier: ${state.multiplier.toFixed(1)}x\nHearts: ${state.hearts}`;
        } else if (chatInput === '/yuri') {
            if (state.fp >= 70) {
                setState(prev => ({ ...prev, fp: prev.fp - 70 }));
                response.text = `>> Photo unlocked! 📸`;
                response.image = `https://picsum.photos/300/400?random=${Math.random()}`;
                response.type = 'reward';
            } else {
                response.text = '>> Insufficient FP. Need 70 FP.';
            }
        } else if (chatInput === '/news') {
            response.text = `>> Latest hacker news:\n• New productivity framework released\n• Pomodoro technique gains AI integration\n• Focus Point gamification trending`;
        } else {
            response.text = '>> Unknown command. Type /help for available commands.';
        }

        newMessages.push(response);

        setState(prev => ({
            ...prev,
            chatMessages: newMessages
        }));

        setChatInput('');
    };

    // Store functions
    const buyItem = (type, cost) => {
        if (state.fp < cost) {
            showNotificationMsg('❌ Not enough FP!');
            return;
        }

        setState(prev => ({ ...prev, fp: prev.fp - cost }));

        if (type === 'heart') {
            setState(prev => ({ ...prev, hearts: 1 }));
            showNotificationMsg('❤️ Heart restored!');
        } else if (type === 'skip') {
            showNotificationMsg('⏭️ Task skipped!');
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
            showNotificationMsg('🖼️ Photo unlocked!');
        }

        setShowStore(false);
    };

    // Notification
    const showNotificationMsg = (text) => {
        setNotification({ show: true, text });
        setTimeout(() => {
            setNotification({ show: false, text: '' });
        }, 3000);
    };

    // Format time
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    // Calculate progress percentages
    const levelProgress = (state.minutes % 100) / 100 * 100;
    const activityProgress = state.timerRunning ? ((25 * 60 - state.timeRemaining) / (25 * 60) * 100) : 0;
    const circleCircumference = 326.73;
    const circleOffset = circleCircumference - (activityProgress / 100) * circleCircumference;
    const comboProgress = Math.min(state.combo / 5, 1) * 100;

    return (
        <div className="container">
            {/* Top Menu */}
            <div className="top-menu">
                <div className="fp-display">
                    <span className="fp-icon">⬢</span>
                    <span>{state.fp}</span> FP
                </div>
                <div className="level-progress">
                    <div className="level-label">Level Progress</div>
                    <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${levelProgress}%` }}></div>
                        <div className="progress-text">{state.minutes % 100} / 100 min</div>
                    </div>
                </div>
                <div className="hearts">
                    <div className={`heart ${state.hearts === 0 ? 'empty' : ''}`}>❤️</div>
                </div>
                <div className="privacy-toggle">
                    <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Privacy</span>
                    <div 
                        className={`toggle-switch ${state.privacy ? 'active' : ''}`}
                        onClick={() => setState(prev => ({ ...prev, privacy: !prev.privacy }))}
                    >
                        <div className="toggle-slider"></div>
                    </div>
                </div>
            </div>

            {/* Grid Layout */}
            <div className="grid">
                {/* Box 1 - Streaks */}
                <div className="box box1">
                    <div className="box-title">Streaks</div>
                    <div className={`streak-item ${!state.privacy ? 'privacy-hidden' : ''}`}>
                        <span className="streak-name">Porn-Free</span>
                        <span className="streak-count">{state.streaks.porn}</span>
                    </div>
                    <div className="streak-item">
                        <span className="streak-name">Routine</span>
                        <span className="streak-count">{state.streaks.routine}</span>
                    </div>
                    <div className="streak-item">
                        <span className="streak-name">Code</span>
                        <span className="streak-count">{state.streaks.code}</span>
                    </div>
                </div>

                {/* Box 2 - Time Breakdown */}
                <div className="box box2">
                    <div className="box-title">Time Breakdown</div>
                    {['Coding', 'Learning', 'Exercise', 'Other'].map((category, i) => (
                        <div key={category}>
                            <div className="time-item">
                                <span className="time-category">{category}</span>
                                <span className="time-value">0h 0m</span>
                            </div>
                            <div className="time-bar">
                                <div className="time-bar-fill" style={{ width: '0%' }}></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Box 3 - Chat */}
                <div className="box box3">
                    <div className="box-title">Hacker Terminal</div>
                    <div className="chat-container">
                        <div className="chat-messages">
                            {state.chatMessages.map((msg, i) => (
                                <div key={i} className={`chat-message ${msg.type}`}>
                                    {msg.text.split('\n').map((line, j) => (
                                        <div key={j}>{line}</div>
                                    ))}
                                    {msg.image && (
                                        <img 
                                            src={msg.image} 
                                            style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} 
                                            alt="Yuri"
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className="chat-input">
                            <input
                                type="text"
                                value={chatInput}
                                onChange={(e) => setChatInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && sendCommand()}
                                placeholder="Enter command..."
                            />
                            <button onClick={sendCommand}>SEND</button>
                        </div>
                    </div>
                </div>

                {/* Box 4 - Waffle Chart */}
                <div className="box box4">
                    <div className="box-title">Activity Waffle</div>
                    <div className="waffle-grid">
                        {Array.from({ length: 28 }, (_, i) => (
                            <div 
                                key={i} 
                                className={`waffle-cell ${i === 27 ? 'active' : ''}`}
                            ></div>
                        ))}
                    </div>
                </div>

                {/* Box 5 - Pomodoro */}
                <div className="box box5">
                    <div className="box-title">Pomodoro Timer</div>
                    <div className="pomodoro-timer">
                        <div className="timer-display">{formatTime(state.timeRemaining)}</div>
                        <div className="circular-progress">
                            <svg width="120" height="120">
                                <circle className="circle-bg" cx="60" cy="60" r="52"></circle>
                                <circle 
                                    className="circle-progress" 
                                    cx="60" 
                                    cy="60" 
                                    r="52"
                                    strokeDasharray={circleCircumference}
                                    strokeDashoffset={circleOffset}
                                ></circle>
                            </svg>
                        </div>
                        <input
                            type="text"
                            className="timer-input"
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            placeholder="What are you working on?"
                        />
                        <div className="timer-controls">
                            <button className="timer-button" onClick={startTimer}>START</button>
                            <button className="timer-button" onClick={resetTimer}>RESET</button>
                        </div>
                    </div>
                </div>

                {/* Box 6 - Current Activity */}
                <div className="box box6">
                    <div className="box-title">Current Activity</div>
                    <div className="activity-name">{state.currentTask}</div>
                    <div className="activity-progress">
                        <div className="activity-bar">
                            <div className="activity-bar-fill" style={{ width: `${activityProgress}%` }}></div>
                        </div>
                    </div>
                    <div className="activity-next">
                        {state.timerRunning ? `${formatTime(state.timeRemaining)} remaining` : 'Start a Pomodoro session'}
                    </div>
                </div>

                {/* Box 7 - Momentum Multiplier */}
                <div className="box box7">
                    <div className="box-title">Momentum Multiplier</div>
                    <div className="multiplier-display">
                        <div className="multiplier-value">{state.multiplier.toFixed(1)}x</div>
                        <div className="combo-count">Combo: {state.combo} activities</div>
                    </div>
                    <div className="combo-bar">
                        <div className="combo-bar-fill" style={{ width: `${comboProgress}%` }}></div>
                    </div>
                </div>

                {/* Box 8 - Quick Wins */}
                <div className="box box8">
                    <div className="box-title">Quick Wins</div>
                    {[
                        { text: 'Drank water', fp: 1 },
                        { text: 'Stretched/Moved', fp: 3 },
                        { text: 'Logged progress', fp: 2 },
                        { text: 'Helped someone', fp: 3 }
                    ].map((win, i) => (
                        <div 
                            key={i}
                            className={`quick-win ${state.quickWins[i] ? 'completed' : ''}`}
                            onClick={() => completeQuickWin(i, win.fp)}
                        >
                            <div className="checkbox">{state.quickWins[i] ? '✓' : ''}</div>
                            <div className="quick-win-text">{win.text}</div>
                            <div className="quick-win-fp">+{win.fp} FP</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Store Button */}
            <button className="store-button" onClick={() => setShowStore(true)}>🛒</button>

            {/* Store Modal */}
            {showStore && (
                <div className="modal active">
                    <div className="modal-content">
                        <div className="modal-title">⬢ FP STORE</div>
                        <div className="store-item" onClick={() => buyItem('heart', 150)}>
                            <span className="store-item-name">❤️ Restore Heart (1 day)</span>
                            <span className="store-item-price">150 FP</span>
                        </div>
                        <div className="store-item" onClick={() => buyItem('skip', 40)}>
                            <span className="store-item-name">⏭️ Skip a Task</span>
                            <span className="store-item-price">40 FP</span>
                        </div>
                        <div className="store-item" onClick={() => buyItem('yuri', 70)}>
                            <span className="store-item-name">🖼️ Yuri Photo</span>
                            <span className="store-item-price">70 FP</span>
                        </div>
                        <button className="close-modal" onClick={() => setShowStore(false)}>CLOSE</button>
                    </div>
                </div>
            )}

            {/* Notification */}
            <div className={`notification ${notification.show ? 'show' : ''}`}>
                {notification.text}
            </div>
        </div>
    );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);