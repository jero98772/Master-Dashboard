// Quick Wins Component
const QuickWins = ({ completedWins, onComplete }) => {
    return (
        <div className="box box8">
            <div className="box-title">Quick Wins</div>
            {CONFIG.quickWins.map((win, i) => (
                <div 
                    key={i}
                    className={`quick-win ${completedWins[i] ? 'completed' : ''}`}
                    onClick={() => onComplete(i, win.fp)}
                >
                    <div className="checkbox">{completedWins[i] ? '✓' : ''}</div>
                    <div className="quick-win-text">{win.text}</div>
                    <div className="quick-win-fp">+{win.fp} FP</div>
                </div>
            ))}
        </div>
    );
};
