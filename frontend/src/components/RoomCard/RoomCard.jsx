import { useState } from "react";
import styles from "./RoomCard.module.scss";
import { useNavigate } from "react-router-dom";

import RoomCardModal from "../RoomCardModal/RoomCardModal";

const RoomCard = ({ room }) => {
    const navigate = useNavigate();
    const [showModal, setShowModal] = useState(false);

    function handleEnterRoom() {
        setShowModal((prev) => !prev);
    }

    function confirmEnter() {
        navigate(`/room/${room.id}`, { replace: true });
    }

    return (
        <>
            <div onClick={handleEnterRoom} className={styles.card}>
                <h3 className={styles.topic}>{room.topic}</h3>
                <div
                    className={`${styles.speakers} ${
                        room.speakers.length === 1 ? styles.singleSpeaker : ""
                    }`}
                >
                    <div className={styles.avatars}>
                        {room.speakers.map((speaker) => (
                            <img
                                key={speaker.id}
                                src={speaker.avatar}
                                alt="speaker-avatar"
                            />
                        ))}
                    </div>
                    <div className={styles.names}>
                        {room.speakers.map((speaker) => (
                            <div
                                key={speaker.id}
                                className={styles.nameWrapper}
                            >
                                <span>{speaker.name}</span>
                                <img
                                    src="/images/chat-bubble.png"
                                    alt="chat-bubble"
                                />
                            </div>
                        ))}
                    </div>
                </div>
                <div className={styles.peopleCount}>
                    <span>{room.totalPeople}</span>
                    <img src="/images/user-icon.png" alt="user-icon" />
                </div>
            </div>
            {showModal && (
                <RoomCardModal
                    roomTopic={room.topic}
                    onClose={() => setShowModal((prev) => !prev)}
                    confirmEnter={confirmEnter}
                />
            )}
        </>
    );
};

export default RoomCard;
