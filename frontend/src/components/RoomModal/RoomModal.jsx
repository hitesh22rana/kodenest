import React, { useState } from "react";
import styles from "./RoomModal.module.scss";
import TextInput from "../shared/TextInput/TextInput";
import Alerts from "../shared/Alerts/Alerts";
import { createRoom as create } from "../../http";
import { useNavigate } from "react-router-dom";

const RoomModal = ({ onClose }) => {
    const navigate = useNavigate();

    const [roomType, setRoomType] = useState("open");
    const [topic, setTopic] = useState("");
    const [isAlert, setIsAlert] = useState(false);
    const [alertmessage, setAlertMessage] = useState("");

    async function createRoom() {
        try {
            if (!topic) {
                setAlertMessage("Invalid topic name!");
                setIsAlert(true);
                return;
            }

            setIsAlert(false);
            const { data } = await create({
                topic: topic.trim(),
                roomType: roomType,
            });
            navigate(`/room/${data?.id}`);
        } catch (err) {
            console.log(err?.message);
        }
    }

    return (
        <div className={styles.modalMask}>
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
                            onClick={() => setRoomType("social")}
                            className={`${styles.typeBox} ${
                                roomType === "social" ? styles.active : ""
                            }`}
                        >
                            <img src="/images/social.png" alt="social" />
                            <span>Social</span>
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
                    <h2>Start a room, open to everyone</h2>
                    <button
                        onClick={createRoom}
                        className={styles.footerButton}
                    >
                        <img src="/images/celebration.png" alt="celebration" />
                        <span>Let's go</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RoomModal;
