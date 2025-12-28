// Enhanced Pomodoro Timer Component with cycles
const PomodoroTimer = ({ 
    timeRemaining, 
    isRunning,
    isBreak,
    cycleCount,
    taskInput,
    category,
    onTaskInputChange,
    onCategoryChange,
    onStart,
    onPause,
    onReset,
    onSkipBreak
}) => {
    const circleCircumference = 326.73;
    
    // Calculate progress based on current mode
    const totalDuration = isBreak 
        ? (cycleCount === 4 ? CONFIG.pomodoro.longBreakDuration : CONFIG.pomodoro.breakDuration) * 60
        : CONFIG.pomodoro.defaultDuration * 60;
    
    const progress = isRunning ? ((totalDuration - timeRemaining) / totalDuration * 100) : 0;
    const circleOffset = circleCircumference - (progress / 100) * circleCircumference;

    // Get cycle info text
    const getCycleText = () => {
        if (isBreak) {
            return cycleCount === 4 ? 'Long Break' : 'Short Break';
        }
        return `Pomodoro ${cycleCount}/4`;
    };

    return (
        <div className="box box5">
            <div className="box-title"><h1>Pomodoro Timer</h1></div>
            <div className="pomodoro-timer">
                {/* Cycle indicator */}
                <div style={{ 
                    fontSize: '11px', 
                    color: 'var(--text-secondary)', 
                    marginBottom: '10px',
                    textAlign: 'center'
                }}>
                    {getCycleText()}
                </div>

                <div className="timer-display" style={{
                    color: isBreak ? 'var(--accent-green)' : 'var(--accent-cyan)'
                }}>
                    {Utils.formatTime(timeRemaining)}
                </div>

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
                            style={{
                                stroke: isBreak ? 'var(--accent-green)' : 'var(--accent-cyan)'
                            }}
                        ></circle>
                    </svg>
                </div>

                {!isBreak && (
                    <>
                        <input
                            type="text"
                            className="timer-input"
                            value={taskInput}
                            onChange={(e) => onTaskInputChange(e.target.value)}
                            placeholder="What are you working on?"
                            disabled={isRunning}
                        />
                        
                        {/* Category selector */}
                        <select 
                            className="timer-input"
                            value={category}
                            onChange={(e) => onCategoryChange(e.target.value)}
                            disabled={isRunning}
                            style={{ marginBottom: '15px', cursor: 'pointer' }}
                        >
                            {CONFIG.timeCategories.map((cat) => {
                                const key = cat.split(' ')[0].toLowerCase();
                                return (
                                    <option key={key} value={key}>
                                        {cat}
                                    </option>
                                );
                            })}
                        </select>
                    </>
                )}

                {isBreak && (
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        color: 'var(--accent-green)',
                        fontSize: '14px'
                    }}>
                        ☕ Take a break!
                    </div>
                )}

                <div className="timer-controls">
                    {!isRunning ? (
                        <>
                            <button className="timer-button" onClick={onStart}>
                                {isBreak ? 'START BREAK' : 'START'}
                            </button>
                            <button className="timer-button" onClick={onReset}>RESET</button>
                        </>
                    ) : (
                        <>
                            <button 
                                className="timer-button" 
                                onClick={onPause}
                                style={{
                                    borderColor: 'var(--accent-yellow)',
                                    color: 'var(--accent-yellow)'
                                }}
                            >
                                PAUSE
                            </button>
                            <button className="timer-button" onClick={onReset}>RESET</button>
                            {isBreak && (
                                <button 
                                    className="timer-button"
                                    onClick={onSkipBreak}
                                    style={{
                                        borderColor: 'var(--accent-green)',
                                        color: 'var(--accent-green)'
                                    }}
                                >
                                    SKIP
                                </button>
                            )}
                        </>
                    )}
                </div>

                {/* Cycle dots indicator */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '15px'
                }}>
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} style={{
                            width: '12px',
                            height: '12px',
                            borderRadius: '50%',
                            background: i <= cycleCount 
                                ? 'var(--accent-cyan)' 
                                : 'rgba(255, 255, 255, 0.1)',
                            boxShadow: i <= cycleCount 
                                ? '0 0 8px var(--glow-cyan)' 
                                : 'none',
                            transition: 'all 0.3s'
                        }}></div>
                    ))}
                </div>
            </div>
        </div>
    );
};