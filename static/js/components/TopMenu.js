// Top Menu Component
const TopMenu = ({ state, onPrivacyToggle }) => {
    const levelProgress = Utils.calculateLevelProgress(state.minutes);
    
    return (
        <div className="top-menu">
            <div className="fp-display">
                <span className="fp-icon">⬢</span>
                <span>{state.fp}</span> FP
            </div>
            <div className="level-progress">
                <div className="level-label">Level Progress</div>
                <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${levelProgress}%` }}></div>
                    <div className="progress-text">
                        {state.minutes % CONFIG.level.pointsPerLevel} / {CONFIG.level.pointsPerLevel} min
                    </div>
                </div>
            </div>
            <div className="hearts">
                <div className={`heart ${state.hearts === 0 ? 'empty' : ''}`}>❤️</div>
            </div>
            <div className="privacy-toggle">
                <span style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Privacy</span>
                <div 
                    className={`toggle-switch ${state.privacy ? 'active' : ''}`}
                    onClick={onPrivacyToggle}
                >
                    <div className="toggle-slider"></div>
                </div>
            </div>
        </div>
    );
};
