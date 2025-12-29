// Enhanced Streaks Component with Daily Tracking
const Streaks = ({ streaks, hearts, yesterdayStreaks, onCompleteYesterday, showYesterdayButtons, privacy }) => {
    return (
        <div className="box box1">
            <div className="box-title">
                <h1>Streaks {hearts > 0 && `❤️`.repeat(hearts)}</h1>
            </div>

            {/* Yesterday's completion (if applicable) */}
            {showYesterdayButtons && yesterdayStreaks && (
                <div style={{
                    background: 'rgba(255, 234, 0, 0.1)',
                    padding: '12px',
                    borderRadius: '8px',
                    marginBottom: '15px',
                    borderLeft: '3px solid var(--accent-yellow)'
                }}>
                    <div style={{
                        fontSize: '11px',
                        color: 'var(--accent-yellow)',
                        marginBottom: '10px',
                        fontWeight: '600',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        ⏰ Complete Yesterday's Tasks
                    </div>

                    {/* Porn-Free */}
                    {!privacy && (
                        <div className="streak-item" style={{ marginBottom: '10px' }}>
                            <span className="streak-name">Porn-Free</span>
                            {yesterdayStreaks.porn === null ? (
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button
                                        onClick={() => onCompleteYesterday('porn', true)}
                                        style={{
                                            padding: '4px 10px',
                                            fontSize: '11px',
                                            background: 'rgba(0, 255, 136, 0.2)',
                                            border: '1px solid var(--accent-green)',
                                            color: 'var(--accent-green)',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        ✅ Yes
                                    </button>
                                    <button
                                        onClick={() => onCompleteYesterday('porn', false)}
                                        style={{
                                            padding: '4px 10px',
                                            fontSize: '11px',
                                            background: 'rgba(255, 0, 110, 0.2)',
                                            border: '1px solid var(--accent-pink)',
                                            color: 'var(--accent-pink)',
                                            borderRadius: '4px',
                                            cursor: 'pointer',
                                            fontFamily: 'inherit',
                                            transition: 'all 0.3s'
                                        }}
                                    >
                                        ❌ No
                                    </button>
                                </div>
                            ) : (
                                <span style={{
                                    color: yesterdayStreaks.porn ? 'var(--accent-green)' : 'var(--accent-pink)',
                                    fontWeight: '700',
                                    fontSize: '12px'
                                }}>
                                    {yesterdayStreaks.porn ? '✅ Done' : '❌ Missed'}
                                </span>
                            )}
                        </div>
                    )}

                    {/* Routine */}
                    <div className="streak-item" style={{ marginBottom: '10px' }}>
                        <span className="streak-name">Routine</span>
                        {yesterdayStreaks.routine === null ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                    onClick={() => onCompleteYesterday('routine', true)}
                                    style={{
                                        padding: '4px 10px',
                                        fontSize: '11px',
                                        background: 'rgba(0, 255, 136, 0.2)',
                                        border: '1px solid var(--accent-green)',
                                        color: 'var(--accent-green)',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    ✅ Yes
                                </button>
                                <button
                                    onClick={() => onCompleteYesterday('routine', false)}
                                    style={{
                                        padding: '4px 10px',
                                        fontSize: '11px',
                                        background: 'rgba(255, 0, 110, 0.2)',
                                        border: '1px solid var(--accent-pink)',
                                        color: 'var(--accent-pink)',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    ❌ No
                                </button>
                            </div>
                        ) : (
                            <span style={{
                                color: yesterdayStreaks.routine ? 'var(--accent-green)' : 'var(--accent-pink)',
                                fontWeight: '700',
                                fontSize: '12px'
                            }}>
                                {yesterdayStreaks.routine ? '✅ Done' : '❌ Missed'}
                            </span>
                        )}
                    </div>

                    {/* Code */}
                    <div className="streak-item" style={{ marginBottom: '6px' }}>
                        <span className="streak-name">Code</span>
                        {yesterdayStreaks.code === null ? (
                            <div style={{ display: 'flex', gap: '6px' }}>
                                <button
                                    onClick={() => onCompleteYesterday('code', true)}
                                    style={{
                                        padding: '4px 10px',
                                        fontSize: '11px',
                                        background: 'rgba(0, 255, 136, 0.2)',
                                        border: '1px solid var(--accent-green)',
                                        color: 'var(--accent-green)',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    ✅ Yes
                                </button>
                                <button
                                    onClick={() => onCompleteYesterday('code', false)}
                                    style={{
                                        padding: '4px 10px',
                                        fontSize: '11px',
                                        background: 'rgba(255, 0, 110, 0.2)',
                                        border: '1px solid var(--accent-pink)',
                                        color: 'var(--accent-pink)',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        fontFamily: 'inherit',
                                        transition: 'all 0.3s'
                                    }}
                                >
                                    ❌ No
                                </button>
                            </div>
                        ) : (
                            <span style={{
                                color: yesterdayStreaks.code ? 'var(--accent-green)' : 'var(--accent-pink)',
                                fontWeight: '700',
                                fontSize: '12px'
                            }}>
                                {yesterdayStreaks.code ? '✅ Done' : '❌ Missed'}
                            </span>
                        )}
                    </div>

                    <div style={{
                        fontSize: '10px',
                        color: 'var(--text-secondary)',
                        marginTop: '8px',
                        textAlign: 'center'
                    }}>
                        💡 Missing a day costs 1 ❤️ per streak
                    </div>
                </div>
            )}

            {/* Current streaks */}
            <div className={`streak-item ${!privacy ? 'privacy-hidden' : ''}`}>
                <span className="streak-name">Porn-Free</span>
                <span className="streak-count">{streaks.porn || 0}</span>
            </div>
            <div className="streak-item">
                <span className="streak-name">Routine</span>
                <span className="streak-count">{streaks.routine || 0}</span>
            </div>
            <div className="streak-item">
                <span className="streak-name">Code</span>
                <span className="streak-count">{streaks.code || 0}</span>
            </div>

            {/* Hearts warning */}
            {hearts <= 1 && (
                <div style={{
                    marginTop: '12px',
                    padding: '8px',
                    background: 'rgba(255, 0, 110, 0.1)',
                    borderRadius: '6px',
                    fontSize: '11px',
                    color: 'var(--accent-pink)',
                    textAlign: 'center',
                    borderLeft: '3px solid var(--accent-pink)'
                }}>
                    ⚠️ Low hearts! Keep your streaks alive!
                </div>
            )}
        </div>
    );
};