// Current Activity Component
const CurrentActivity = ({ taskName, progress, timeRemaining, isRunning }) => {
    return (
        <div className="box box6">
            <div className="box-title">Current Activity</div>
            <div className="activity-name">{taskName}</div>
            <div className="activity-progress">
                <div className="activity-bar">
                    <div className="activity-bar-fill" style={{ width: `${progress}%` }}></div>
                </div>
            </div>
            <div className="activity-next">
                {isRunning ? `${Utils.formatTime(timeRemaining)} remaining` : 'Start a Pomodoro session'}
            </div>
        </div>
    );
};
