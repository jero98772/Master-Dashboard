// Enhanced Current Activity Component with Schedule
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
    const [currentScheduledTask, setCurrentScheduledTask] = React.useState(null);
    const [nextScheduledTask, setNextScheduledTask] = React.useState(null);

    // Update scheduled tasks every minute
    React.useEffect(() => {
        const updateSchedule = () => {
            setCurrentScheduledTask(Utils.getCurrentScheduledTask());
            setNextScheduledTask(Utils.getNextScheduledTask());
        };

        updateSchedule();
        const interval = setInterval(updateSchedule, 60000); // Update every minute

        return () => clearInterval(interval);
    }, []);

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
                time: Utils.formatTime(timeRemaining),
                isScheduled: false
            };
        } else if (isRunning) {
            const nextBreakDuration = (cycleCount + 1) === 4 
                ? CONFIG.pomodoro.longBreakDuration 
                : CONFIG.pomodoro.breakDuration;
            const breakType = (cycleCount + 1) === 4 ? 'Long Break' : 'Short Break';
            return {
                name: breakType,
                time: `${nextBreakDuration} min`,
                isScheduled: false
            };
        } else if (nextScheduledTask) {
            return {
                name: nextScheduledTask.task,
                time: Utils.getTimeUntilTask(nextScheduledTask.start),
                isScheduled: true,
                scheduledTime: nextScheduledTask.start
            };
        } else {
            return {
                name: 'Ready to start',
                time: '',
                isScheduled: false
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
            <div className="box-title"><h1>Current Activity</h1></div>
            
            {/* Current Scheduled Task */}
            {currentScheduledTask && !isRunning && (
                <div style={{
                    marginBottom: '15px',
                    padding: '12px',
                    background: 'rgba(0, 255, 255, 0.1)',
                    borderRadius: '6px',
                    borderLeft: '3px solid var(--accent-cyan)',
                    animation: 'slideInFromLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1)'
                }}>
                    <div style={{ 
                        fontSize: '10px', 
                        color: 'var(--text-secondary)',
                        marginBottom: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        📅 Scheduled Now ({currentScheduledTask.start} - {currentScheduledTask.end})
                    </div>
                    <div style={{ 
                        fontSize: '14px', 
                        color: 'var(--accent-cyan)',
                        fontWeight: '600',
                        animation: 'fadeIn 0.8s ease'
                    }}>
                        {currentScheduledTask.task}
                    </div>
                </div>
            )}

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
                        borderLeft: '3px solid var(--accent-cyan)',
                        animation: 'slideInFromLeft 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transition: 'all 0.3s ease'
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
                        borderLeft: '3px solid var(--accent-yellow)',
                        animation: 'slideInFromRight 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        transition: 'all 0.3s ease'
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
                <div className="activity-next" style={{ 
                    marginTop: '10px',
                    animation: 'fadeIn 0.5s ease'
                }}>
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
                borderLeft: '3px solid var(--accent-green)',
                animation: 'scaleIn 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                transition: 'all 0.3s ease'
            }}>
                <div style={{ 
                    fontSize: '10px', 
                    color: 'var(--text-secondary)',
                    marginBottom: '4px',
                    textTransform: 'uppercase',
                    letterSpacing: '1px'
                }}>
                    {nextActivity.isScheduled ? '📅 Next Scheduled' : 'Next Up'}
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
                            {nextActivity.isScheduled && nextActivity.scheduledTime && (
                                <span style={{ marginRight: '8px', opacity: 0.6 }}>
                                    {nextActivity.scheduledTime}
                                </span>
                            )}
                            {nextActivity.time}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
};