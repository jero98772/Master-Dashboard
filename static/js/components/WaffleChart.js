// Waffle Chart Component - Progressive 365 Days
const WaffleChart = ({ waffleData = {}, completedPomodoros = 0 }) => {
    // Generate last 365 days
    const generateDays = () => {
        const days = [];
        const today = new Date();
        const todayString = today.toISOString().split('T')[0];
        
        for (let i = 364; i >= 0; i--) {
            const date = new Date(today);
            date.setDate(date.getDate() - i);
            const dateString = date.toISOString().split('T')[0];
            
            // Check if user opened app this day
            const hasData = dateString in waffleData;
            
            // Get count - today is live, others from data
            const pomodorosCompleted = dateString === todayString
                ? completedPomodoros
                : (waffleData[dateString] || 0);
            
            days.push({
                date: dateString,
                count: pomodorosCompleted,
                hasData: hasData,  // User opened app
                active: hasData && pomodorosCompleted > 0,
                isToday: dateString === todayString
            });
        }
        
        return days;
    };

    const days = generateDays();

    // Get intensity level based on pomodoro count
    const getIntensity = (count) => {
        if (count === 0) return 'opened';  // Opened but no Pomodoros
        if (count <= 2) return 'low';
        if (count <= 5) return 'medium';
        if (count <= 8) return 'high';
        return 'extreme';
    };

    return (
        <div className="box box4">
            <div className="box-title"><h1>Activity</h1></div>
            <div className="waffle-info">
                {Object.keys(waffleData).length} days active
            </div>
            <div className="waffle-container">
                <div className="waffle-grid">
                    {days.map((day) => (
                        <div 
                            key={day.date}
                            className={`waffle-cell ${day.hasData ? (day.active ? 'active' : 'opened') : 'empty'} ${day.hasData ? getIntensity(day.count) : ''}`}
                            title={day.hasData 
                                ? `${day.date}: ${day.count} ${day.count === 1 ? 'Pomodoro' : 'Pomodoros'}${day.isToday ? ' (Live)' : ''}`
                                : `${day.date}: Not opened`
                            }
                        >
                            {day.isToday && day.hasData && (
                                <div className="today-indicator"></div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
            
            {/* Compact Legend */}
            <div className="waffle-legend">
                <div className="legend-item">
                    <div className="waffle-cell empty legend-cell"></div>
                    <span>-</span>
                </div>
                <div className="legend-item">
                    <div className="waffle-cell opened legend-cell"></div>
                    <span>0</span>
                </div>
                <div className="legend-item">
                    <div className="waffle-cell active low legend-cell"></div>
                    <span>1-2</span>
                </div>
                <div className="legend-item">
                    <div className="waffle-cell active medium legend-cell"></div>
                    <span>3-5</span>
                </div>
                <div className="legend-item">
                    <div className="waffle-cell active high legend-cell"></div>
                    <span>6-8</span>
                </div>
                <div className="legend-item">
                    <div className="waffle-cell active extreme legend-cell"></div>
                    <span>9+</span>
                </div>
            </div>
        </div>
    );
};