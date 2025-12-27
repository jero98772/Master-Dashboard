// Momentum Multiplier Component
const MomentumMultiplier = ({ multiplier, combo }) => {
    const comboProgress = Math.min(combo / CONFIG.multiplier.threshold5, 1) * 100;

    return (
        <div className="box box7">
            <div className="box-title">Momentum Multiplier</div>
            <div className="multiplier-display">
                <div className="multiplier-value">{multiplier.toFixed(1)}x</div>
                <div className="combo-count">Combo: {combo} activities</div>
            </div>
            <div className="combo-bar">
                <div className="combo-bar-fill" style={{ width: `${comboProgress}%` }}></div>
            </div>
        </div>
    );
};
