import React, { useState, useEffect } from "react";
import styles from "./Rooms.module.scss";
import RoomCard from "../../components/RoomCard/RoomCard";
import RoomModal from "../../components/RoomModal/RoomModal";
import { getAllRooms } from "../../http";

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const fetchRooms = async () => {
            const { data } = await getAllRooms();
            setRooms(data);
        };
        fetchRooms();
    }, []);

    function openModal() {
        setShowModal(true);
    }

    return (
        <div className={styles.cardWrapper}>
            <div className={styles.container}>
                <div className={styles.roomsHeader}>
                    <div className={styles.left}>
                        <span className={styles.heading}>All rooms</span>
                        <div className={styles.searchBox}>
                            <img src="/images/search-icon.png" alt="search" />
                            <input type="text" className={styles.searchInput} />
                        </div>
                    </div>
                    <div className={styles.right}>
                        <button
                            onClick={openModal}
                            className={styles.startRoomButton}
                        >
                            <img
                                src="/images/add-room-icon.png"
                                alt="add-room"
                            />
                            <span>Create a room</span>
                        </button>
                    </div>
                </div>
                <div className={styles.roomList}>
                    {rooms?.map((room) => (
                        <RoomCard key={room?.id} room={room} />
                    ))}
                </div>
            </div>
            {showModal && <RoomModal onClose={() => setShowModal(false)} />}
        </div>
    );
};

export default Rooms;
