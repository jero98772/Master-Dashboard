// Streaks Component
const Streaks = ({ streaks, privacy }) => {
    return (
        <div className="box box1">
            <div className="box-title">Streaks</div>
            <div className={`streak-item ${!privacy ? 'privacy-hidden' : ''}`}>
                <span className="streak-name">Porn-Free</span>
                <span className="streak-count">{streaks.porn}</span>
            </div>
            <div className="streak-item">
                <span className="streak-name">Routine</span>
                <span className="streak-count">{streaks.routine}</span>
            </div>
            <div className="streak-item">
                <span className="streak-name">Code</span>
                <span className="streak-count">{streaks.code}</span>
            </div>
        </div>
    );
};
