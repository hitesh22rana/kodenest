import { useState } from "react";
import styles from "./RoomModal.module.scss";
import TextInput from "../shared/TextInput/TextInput";
import Alerts from "../shared/Alerts/Alerts";
import { createRoom as create } from "../../http";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTokenValue } from "../../store/privateRoomSlice";

const RoomModal = ({ onClose }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [roomType, setRoomType] = useState("open");
    const [topic, setTopic] = useState("");
    const [isAlert, setIsAlert] = useState(false);
    const [alertmessage, setAlertMessage] = useState("");

    async function createRoom() {
        try {
            if (!topic || !topic.trim()) {
                setAlertMessage("Invalid topic name!");
                setIsAlert(true);
                return;
            }

            setIsAlert(false);
            const { data } = await create({
                topic: topic.trim(),
                roomType: roomType,
            });

            if (data.roomType === "private") {
                dispatch(setTokenValue(data.secretToken));
            }
            navigate(`/room/${data?.id}`);
        } catch (err) {
            setAlertMessage("Unable to create room!");
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
                        Enter the topic to be disscussed
                    </h3>
                    <TextInput
                        fullwidth="true"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                    />
                    <h2 className={styles.subHeading}>Room types</h2>
                    <div className={styles.roomTypes}>
                        <div
                            onClick={() => setRoomType("open")}
                            className={`${styles.typeBox} ${
                                roomType === "open" ? styles.active : ""
                            }`}
                        >
                            <img src="/images/globe.png" alt="globe" />
                            <span>Open</span>
                        </div>
                        <div
                            onClick={() => setRoomType("private")}
                            className={`${styles.typeBox} ${
                                roomType === "private" ? styles.active : ""
                            }`}
                        >
                            <img src="/images/lock.png" alt="lock" />
                            <span>Private</span>
                        </div>
                    </div>
                </div>
                <div className={styles.modalFooter}>
                    {roomType === "open" ? (
                        <h2>Start a room, open for everyone</h2>
                    ) : (
                        <h2>Start a private room.</h2>
                    )}

                    <button
                        onClick={createRoom}
                        className={styles.footerButton}
                    >
                        <img src="/images/celebration.png" alt="celebration" />
                        <span>Let's go</span>
                    </button>
                </div>
            </div>
        </>
    );
};

export default RoomModal;
