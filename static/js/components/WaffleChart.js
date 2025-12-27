// Waffle Chart Component
const WaffleChart = ({ activedays = [] }) => {
    // Generate 28 days (4 weeks)
    const days = Array.from({ length: 28 }, (_, i) => {
        const isActive = activedays.includes(i);
        const isToday = i === 27; // Last cell is today
        return { index: i, active: isActive || isToday };
    });

    return (
        <div className="box box4">
            <div className="box-title">Activity Waffle</div>
            <div className="waffle-grid">
                {days.map((day) => (
                    <div 
                        key={day.index} 
                        className={`waffle-cell ${day.active ? 'active' : ''}`}
                    ></div>
                ))}
            </div>
        </div>
    );
};
