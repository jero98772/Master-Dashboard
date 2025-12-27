// Notification Component
const Notification = ({ show, text }) => {
    return (
        <div className={`notification ${show ? 'show' : ''}`}>
            {text}
        </div>
    );
};
