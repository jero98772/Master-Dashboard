// Enhanced Current Activity Component
const CurrentActivity = ({ 
    taskName, 
    category,
    progress, 
    timeRemaining, 
    isRunning,
    isBreak,
    cycleCount,
    timeSpent,
    totalSessionTime
}) => {
    // Calculate time spent in current session
    const minutesSpent = isRunning && !isBreak 
        ? Math.floor((CONFIG.pomodoro.defaultDuration * 60 - timeRemaining) / 60)
        : 0;
    
    const secondsSpent = isRunning && !isBreak
        ? (CONFIG.pomodoro.defaultDuration * 60 - timeRemaining) % 60
        : 0;

    // Get next activity info
    const getNextActivity = () => {
        if (isBreak) {
            return {
                name: 'Work Session',
                time: Utils.formatTime(timeRemaining)
            };
        } else if (isRunning) {
            const nextBreakDuration = (cycleCount + 1) === 4 
                ? CONFIG.pomodoro.longBreakDuration 
                : CONFIG.pomodoro.breakDuration;
            const breakType = (cycleCount + 1) === 4 ? 'Long Break' : 'Short Break';
            return {
                name: breakType,
                time: `${nextBreakDuration} min`
            };
        } else {
            return {
                name: 'Ready to start',
                time: ''
            };
        }
    };

    const nextActivity = getNextActivity();

    // Get category display
    const getCategoryDisplay = () => {
        const cat = CONFIG.timeCategories.find(c => c.split(' ')[0].toLowerCase() === category);
        return cat || '📝 Task';
    };

    return (
        <div className="box box6">
            <div className="box-title">Current Activity</div>
            
            {/* Task name and category */}
            <div className="activity-name" style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '10px'
            }}>
                <span>{taskName}</span>
                {!isBreak && isRunning && (
                    <span style={{ 
                        fontSize: '11px', 
                        color: 'var(--accent-cyan)',
                        background: 'rgba(0, 255, 255, 0.1)',
                        padding: '4px 8px',
                        borderRadius: '4px'
                    }}>
                        {getCategoryDisplay()}
                    </span>
                )}
            </div>

            {/* Progress bar */}
            <div className="activity-progress">
                <div className="activity-bar">
                    <div className="activity-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </div>

            {/* Time information */}
            {isRunning && !isBreak ? (
                <div style={{ 
                    marginTop: '15px',
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '10px'
                }}>
                    <div style={{
                        background: 'rgba(0, 255, 255, 0.1)',
                        padding: '10px',
                        borderRadius: '6px',
                        borderLeft: '3px solid var(--accent-cyan)'
                    }}>
                        <div style={{ 
                            fontSize: '10px', 
                            color: 'var(--text-secondary)',
                            marginBottom: '4px'
                        }}>
                            Time Spent
                        </div>
                        <div style={{ 
                            fontSize: '16px', 
                            fontWeight: '700',
                            color: 'var(--accent-cyan)',
                            fontFamily: 'Orbitron, sans-serif'
                        }}>
                            {minutesSpent}:{String(secondsSpent).padStart(2, '0')}
                        </div>
                    </div>

                    <div style={{
                        background: 'rgba(255, 234, 0, 0.1)',
                        padding: '10px',
                        borderRadius: '6px',
                        borderLeft: '3px solid var(--accent-yellow)'
                    }}>
                        <div style={{ 
                            fontSize: '10px', 
                            color: 'var(--text-secondary)',
                            marginBottom: '4px'
                        }}>
                            Remaining
                        </div>
                        <div style={{ 
                            fontSize: '16px', 
                            fontWeight: '700',
                            color: 'var(--accent-yellow)',
                            fontFamily: 'Orbitron, sans-serif'
                        }}>
                            {Utils.formatTime(timeRemaining)}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="activity-next" style={{ marginTop: '10px' }}>
                    {isBreak 
                        ? `${Utils.formatTime(timeRemaining)} break remaining` 
                        : 'Start a Pomodoro session'}
                </div>
            )}

            {/* Next activity */}
            <div style={{
                marginTop: '15px',
                padding: '12px',
                background: 'rgba(0, 255, 136, 0.1)',
                borderRadius: '6px',
                borderLeft: '3px solid var(--accent-green)'
            }}>
                <div style={{ 
                    fontSize: '10px', 
                    color: 'var(--text-secondary)',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    Next Up
                </div>
                <div style={{ 
                    fontSize: '13px', 
                    color: 'var(--accent-green)',
                    fontWeight: '600',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <span>{nextActivity.name}</span>
                    {nextActivity.time && (
                        <span style={{ 
                            fontSize: '11px',
                            opacity: 0.8
                        }}>
                            {nextActivity.time}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};