import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./PrivateRoomModal.module.scss";
import TextInput from "../shared/TextInput/TextInput";

import Alerts from "../shared/Alerts/Alerts";
import { getRoomBySecretToken } from "../../http";
import { useDispatch } from "react-redux";
import { setTokenValue } from "../../store/privateRoomSlice";

const PrivateRoomModal = ({ onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [token, setToken] = useState("");
    const [isAlert, setIsAlert] = useState(false);
    const [alertmessage, setAlertMessage] = useState("");

    async function enterRoom() {
        try {
            if (!token || !token.trim()) {
                setAlertMessage("Invalid token!");
                setIsAlert(true);
                return;
            }

            setIsAlert(false);
            const { data } = await getRoomBySecretToken({
                token: token.trim(),
            });

            dispatch(setTokenValue(token.trim()));

            navigate(`/room/${data}`);
        } catch (err) {
            setToken("");
            setAlertMessage("Invalid token!");
            setIsAlert(true);
        }
    }

    return (
        <>
            <div className={styles.modalBackDrop} onClick={onClose}></div>
            {isAlert && (
                <Alerts
                    message={alertmessage}
                    isAlert={isAlert}
                    setIsAlert={setIsAlert}
                />
            )}
            <div className={styles.modalBody}>
                <button onClick={onClose} className={styles.closeButton}>
                    <img src="/images/close.png" alt="close" />
                </button>
                <div className={styles.modalHeader}>
                    <h3 className={styles.heading}>
                        Enter the Secret room token
                    </h3>
                    <TextInput
                        fullwidth="true"
                        value={token}
                        onChange={(e) => setToken(e.target.value)}
                        style={{
                            letterSpacing: "10px",
                        }}
                    />
                </div>

                <img src="/images/joinus.png" alt="" />

                <div className={styles.modalFooter}>
                    <button onClick={enterRoom} className={styles.footerButton}>
                        <img src="/images/celebration.png" alt="celebration" />
                        <span>Let's go</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default PrivateRoomModal;
