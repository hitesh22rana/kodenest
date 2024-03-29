import styles from "./LogoutModal.module.scss";

const LogoutModal = ({ onClose, confirmLogout }) => {
    return (
        <>
            <div className={styles.modalBackDrop} onClick={onClose}></div>
            <div className={styles.modalBody}>
                <div>
                    <h2>Log out?</h2>
                    <span>Are you sure you want to log out?</span>
                    <div>
                        <button onClick={onClose}>Cancel</button>
                        <button onClick={confirmLogout}>Log Out</button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LogoutModal;
