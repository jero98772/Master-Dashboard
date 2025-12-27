// Pomodoro Timer Component
const PomodoroTimer = ({ 
    timeRemaining, 
    isRunning, 
    taskInput, 
    onTaskInputChange,
    onStart,
    onReset 
}) => {
    const circleCircumference = 326.73;
    const progress = isRunning ? ((CONFIG.pomodoro.defaultDuration * 60 - timeRemaining) / (CONFIG.pomodoro.defaultDuration * 60) * 100) : 0;
    const circleOffset = circleCircumference - (progress / 100) * circleCircumference;

    return (
        <div className="box box5">
            <div className="box-title">Pomodoro Timer</div>
            <div className="pomodoro-timer">
                <div className="timer-display">{Utils.formatTime(timeRemaining)}</div>
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
                    onChange={(e) => onTaskInputChange(e.target.value)}
                    placeholder="What are you working on?"
                />
                <div className="timer-controls">
                    <button className="timer-button" onClick={onStart}>START</button>
                    <button className="timer-button" onClick={onReset}>RESET</button>
                </div>
            </div>
        </div>
    );
};
