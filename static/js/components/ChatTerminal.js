// Chat Terminal Component
const ChatTerminal = ({ messages, input, onInputChange, onSendCommand }) => {
    const messagesEndRef = React.useRef(null);

    React.useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            onSendCommand();
        }
    };

    // Render message text with HTML support for links
    const renderMessageText = (text) => {
        const lines = text.split('\n');
        return lines.map((line, j) => {
            // Check if line contains a URL pattern
            const urlMatch = line.match(/(https?:\/\/[^\s]+)/);
            
            if (urlMatch) {
                const url = urlMatch[1];
                const beforeUrl = line.substring(0, urlMatch.index);
                const afterUrl = line.substring(urlMatch.index + url.length);
                
                return (
                    <div key={j}>
                        {beforeUrl}
                        <a 
                            href={url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            style={{
                                color: 'var(--accent-cyan)',
                                textDecoration: 'none',
                                borderBottom: '1px solid var(--accent-cyan)',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.color = 'var(--accent-green)';
                                e.target.style.borderColor = 'var(--accent-green)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.color = 'var(--accent-cyan)';
                                e.target.style.borderColor = 'var(--accent-cyan)';
                            }}
                        >
                            {url}
                        </a>
                        {afterUrl}
                    </div>
                );
            }
            
            // Check if line starts with a number (story title)
            const titleMatch = line.match(/^(\d+\.\s)(.+)/);
            if (titleMatch) {
                return (
                    <div key={j}>
                        {titleMatch[1]}
                        <strong style={{ color: 'var(--text-primary)' }}>
                            {titleMatch[2]}
                        </strong>
                    </div>
                );
            }
            
            return <div key={j}>{line}</div>;
        });
    };

    return (
        <div className="box box3">
            <div className="box-title"><h1>Hacker Terminal</h1></div>
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`chat-message ${msg.type}`}>
                            {renderMessageText(msg.text)}
                            {msg.image && (
                                <img 
                                    src={msg.image} 
                                    style={{ width: '100%', borderRadius: '8px', marginTop: '10px' }} 
                                    alt="Reward"
                                />
                            )}
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>
                <div className="chat-input">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter command..."
                    />
                    <button onClick={onSendCommand}>SEND</button>
                </div>
            </div>
        </div>
    );
};