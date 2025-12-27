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

    return (
        <div className="box box3">
            <div className="box-title">Hacker Terminal</div>
            <div className="chat-container">
                <div className="chat-messages">
                    {messages.map((msg, i) => (
                        <div key={i} className={`chat-message ${msg.type}`}>
                            {msg.text.split('\n').map((line, j) => (
                                <div key={j}>{line}</div>
                            ))}
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
