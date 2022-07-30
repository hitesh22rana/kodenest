import React from "react";
import styles from "./LogoutModal.module.scss";

const LogoutModal = ({ onClose, confirmLogout }) => {
    return (
        <div className={styles.modalMask}>
            <div className={styles.modalBody}>
                <h2>Log out?</h2>
                <span>Are you sure you want to log out?</span>
                <div>
                    <button onClick={onClose}>CANCEL</button>
                    <button onClick={confirmLogout}>LOG OUT</button>
                </div>
            </div>
        </div>
    );
};

export default LogoutModal;
