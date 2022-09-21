import React, { useState, useEffect } from "react";
import { useWebRTC } from "../../hooks/useWebRTC";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { getRoom } from "../../http";
import styles from "./Room.module.scss";
import Navigation from "../../components/shared/Navigation/Navigation";

const Room = () => {
    const { id: roomId } = useParams();
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);
    const [room, setRoom] = useState(null);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const { data } = await getRoom(roomId);
                setRoom((prev) => data);
                new Audio("/sound/join.wav").play();
            } catch (err) {
                navigate("/rooms");
            }
        };
        fetchRoom();
    }, [roomId]);

    const [isMuted, setMuted] = useState(true);
    const { clients, provideRef, handleMute } = useWebRTC(roomId, user);

    useEffect(() => {
        handleMute(isMuted, user?.id);
    }, [isMuted]);

    const handleMuteClick = (clientId) => {
        if (clientId !== user?.id) return;
        setMuted((prev) => !prev);
    };

    const handManualLeave = () => {
        new Audio("/sound/leave.mp3").play();
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
                        <button onClick={handManualLeave}>
                            <img src="/images/win.png" alt="win-icon" />
                            <span>Leave quietly</span>
                        </button>
                    </div>
                </div>
                <div className={styles.clientsList}>
                    {clients.map((client) => {
                        if (user.id === client.id) {
                            return (
                                <div key={client.id} className={styles.client}>
                                    <div className={styles.userHeadUser}>
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
                                            className={styles.micBtnUser}
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
                        } else {
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
                        }
                    })}
                </div>
            </div>
        </>
    );
};

export default Room;
