import styles from "./RoomCardModal.module.scss";

const RoomCardModal = ({ roomTopic, onClose, confirmEnter }) => {
    return (
        <>
            <div className={styles.modalBackDrop} onClick={onClose}></div>
            <div className={styles.modalBody}>
                <div>
                    <h2>Join {roomTopic}?</h2>
                    <div>
                        <button onClick={onClose}>No</button>
                        <button onClick={confirmEnter}>Yes</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RoomCardModal;
