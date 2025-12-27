// Time Breakdown Component
const TimeBreakdown = ({ timeData }) => {
    return (
        <div className="box box2">
            <div className="box-title">Time Breakdown</div>
            {CONFIG.timeCategories.map((category, i) => {
                const data = timeData[category.toLowerCase()] || { minutes: 0, percentage: 0 };
                return (
                    <div key={category}>
                        <div className="time-item">
                            <span className="time-category">{category}</span>
                            <span className="time-value">{Utils.formatMinutes(data.minutes)}</span>
                        </div>
                        <div className="time-bar">
                            <div className="time-bar-fill" style={{ width: `${data.percentage}%` }}></div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};
