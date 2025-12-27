// Store Modal Component
const StoreModal = ({ isOpen, currentFP, onClose, onPurchase }) => {
    if (!isOpen) return null;

    const storeItems = [
        { 
            id: 'heart', 
            name: '❤️ Restore Heart (1 day)', 
            price: CONFIG.store.restoreHeart 
        },
        { 
            id: 'skip', 
            name: '⏭️ Skip a Task', 
            price: CONFIG.store.skipTask 
        },
        { 
            id: 'yuri', 
            name: '🖼️ Yuri Photo', 
            price: CONFIG.store.yuriPhoto 
        }
    ];

    return (
        <div className="modal active">
            <div className="modal-content">
                <div className="modal-title">⬢ FP STORE</div>
                {storeItems.map((item) => (
                    <div 
                        key={item.id}
                        className={`store-item ${currentFP < item.price ? 'disabled' : ''}`}
                        onClick={() => onPurchase(item.id, item.price)}
                    >
                        <span className="store-item-name">{item.name}</span>
                        <span className="store-item-price">{item.price} FP</span>
                    </div>
                ))}
                <button className="close-modal" onClick={onClose}>CLOSE</button>
            </div>
        </div>
    );
};
