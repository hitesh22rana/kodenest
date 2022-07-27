import React, { useState, useEffect } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRoom } from "../../http";
import styles from "./Room.module.scss";
import Navigation from "../../components/shared/Navigation/Navigation";

const Room = () => {
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const { id: roomId } = useParams();
    const [room, setRoom] = useState(null);
    const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
    const [isMuted, setMuted] = useState(true);

    useEffect(() => {
        const fetchRoom = async () => {
            const { data } = await getRoom(roomId);
            setRoom((prev) => data);
        };
        fetchRoom();
    }, [roomId]);

    useEffect(() => {
        handleMute(isMuted, user?.id);
    }, [isMuted]);

    const handleMuteClick = (clientId) => {
        // can show alert to improve UI
        if (clientId !== user?.id) return;
        setMuted((prev) => !prev);
    };

    const handManualLeave = () => {
        navigate("/rooms");
    };

    return (
        <>
            <Navigation />
            <div className={styles.container}>
                <button onClick={handManualLeave}>
                    <img src="/images/arrow-left.png" alt="arrow-left" />
                    <span>All rooms</span>
                </button>
            </div>
            <div className={styles.clientsWrap}>
                <div className={styles.header}>
                    {room && <h2 className={styles.topic}>{room.topic}</h2>}
                    <div className={styles.actions}>
                        <button>
                            <img src="/images/palm.png" alt="palm-icon" />
                        </button>
                        <button onClick={handManualLeave}>
                            <img src="/images/win.png" alt="win-icon" />
                            <span>Leave quietly</span>
                        </button>
                    </div>
                </div>
                <div className={styles.clientsList}>
                    {clients.map((client) => {
                        return (
                            <div key={client.id} className={styles.client}>
                                <div className={styles.userHead}>
                                    <img
                                        className={styles.userAvatar}
                                        src={client.avatar}
                                        alt=""
                                    />
                                    <audio
                                        autoPlay
                                        playsInline
                                        ref={(instance) => {
                                            provideRef(instance, client.id);
                                        }}
                                    />
                                    <button
                                        onClick={() =>
                                            handleMuteClick(client.id)
                                        }
                                        className={styles.micBtn}
                                    >
                                        {client.muted ? (
                                            <img
                                                src="/images/mic-mute.png"
                                                alt="mic"
                                            />
                                        ) : (
                                            <img
                                                src="/images/mic.png"
                                                alt="mic"
                                            />
                                        )}
                                    </button>
                                </div>
                                <h4>{client.name}</h4>
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
};

export default Room;
