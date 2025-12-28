// Time Breakdown Component
const TimeBreakdown = ({ timeData }) => {
    return (
        <div className="box box2">
            <div className="box-title"><h1>Time Breakdown</h1></div>
            {CONFIG.timeCategories.map((cat) => {
                const key = cat.split(' ')[0].toLowerCase();
                const data = timeData[key] || { minutes: 0, percentage: 0 };
                return (
                    <div key={key}>
                        <div className="time-item">
                            <span className="time-category">{cat}</span>
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