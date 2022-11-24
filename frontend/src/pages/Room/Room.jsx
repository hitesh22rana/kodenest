import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useWebRTC } from "../../hooks/useWebRTC";
import { getRoom } from "../../http";
import styles from "./Room.module.scss";
import Navigation from "../../components/shared/Navigation/Navigation";
import { setPopUp, setTokenValue } from "../../store/privateRoomSlice";
import Alerts from "../../components/shared/Alerts/Alerts";

const Room = () => {
    const { id: roomId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const { token } = useSelector((state) => state.privateRoom);
    const [room, setRoom] = useState(null);
    const [copyToClipBoard, setCopyToClipBoard] = useState(false);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const { data } = await getRoom(roomId);

                if (data.secretToken !== token) {
                    dispatch(setPopUp(true));
                    throw new Error("Unauthorized!");
                }

                setRoom((prev) => data);
                new Audio("/sound/join.wav").play();

                if (user?.id === data?.ownerId && token !== "") {
                    navigator.clipboard.writeText(token);
                    setCopyToClipBoard(true);
                }
            } catch (err) {
                dispatch(setTokenValue(""));
                navigate("/rooms");
            }
        };
        fetchRoom();
    }, [roomId, user?.id, token, dispatch, navigate]);

    const [isMuted, setMuted] = useState(true);
    const { clients, provideRef, handleMute } = useWebRTC(roomId, user);

    useEffect(() => {
        handleMute(isMuted, user?.id);
    }, [isMuted, user?.id, handleMute]);

    const handleMuteClick = (clientId) => {
        if (clientId !== user?.id) return;
        setMuted((prev) => !prev);
    };

    const handManualLeave = () => {
        new Audio("/sound/leave.mp3").play();
        dispatch(setPopUp(false));
        dispatch(setTokenValue(""));
        navigate("/rooms");
    };

    return (
        <>
            <Navigation />
            {copyToClipBoard && (
                <Alerts
                    message="Copied to clipboard!"
                    isAlert={copyToClipBoard}
                    setIsAlert={setCopyToClipBoard}
                    severity="success"
                />
            )}
            <div className={styles.container}>
                <button onClick={handManualLeave}>
                    <img src="/images/arrow-left.png" alt="arrow-left" />
                    <span>All rooms</span>
                </button>
            </div>
            <div className={styles.clientsWrap}>
                <div className={styles.header}>
                    <div className={styles.roomData}>
                        {room && <h2 className={styles.topic}>{room.topic}</h2>}
                        {room && room?.roomType === "private" && (
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(
                                        room?.secretToken
                                    );
                                    setCopyToClipBoard(true);
                                }}
                                className={styles.secretTokenButton}
                            >
                                <span>{room?.secretToken}</span>
                                <img src="/images/copy.png" alt=" " />
                            </button>
                        )}
                    </div>
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
