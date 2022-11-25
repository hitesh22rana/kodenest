import { useState, useEffect, useMemo } from "react";
import styles from "./Rooms.module.scss";
import Navigation from "../../components/shared/Navigation/Navigation";
import RoomCard from "../../components/RoomCard/RoomCard";
import RoomModal from "../../components/RoomModal/RoomModal";
import { getAllRooms } from "../../http";
import PrivateRoomModal from "../../components/PrivateRoomModal/PrivateRoomModal";
import { useSelector, useDispatch } from "react-redux";
import { setPopUp } from "../../store/privateRoomSlice";

const Rooms = () => {
    const dispatch = useDispatch();
    const [rooms, setRooms] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showPrivateRoomModal, setShowPrivateRoomModal] = useState(false);
    const [search, setSearch] = useState("");

    const { popUp } = useSelector((state) => state.privateRoom);

    useEffect(() => {
        const fetchRooms = async () => {
            const { data } = await getAllRooms();
            setRooms(data);
        };
        fetchRooms();
    }, []);

    const handleSearch = (event) => {
        setSearch(event.target.value);
    };

    const filteredRooms = useMemo(() => {
        if (!search.trim()) {
            return rooms;
        }
        return rooms.filter((room) => {
            return room?.topic.toLowerCase().includes(search.toLowerCase());
        });
    }, [search, rooms]);

    function openModal() {
        setShowModal((prev) => !prev);
    }

    function openPrivateRoomModal() {
        setShowPrivateRoomModal((prev) => !prev);
    }

    function handlePrivateRoom() {
        dispatch(setPopUp(false));
        setShowPrivateRoomModal((prev) => !prev);
    }

    return (
        <>
            <Navigation />
            <div className={styles.cardWrapper}>
                <div className={styles.container}>
                    <div className={styles.roomsHeader}>
                        <div className={styles.left}>
                            <span className={styles.heading}>All rooms</span>
                            <div className={styles.searchBox}>
                                <input
                                    type="text"
                                    value={search}
                                    placeholder="Search"
                                    onChange={handleSearch}
                                    className={styles.searchInput}
                                />
                                <img
                                    src="/images/search-icon.png"
                                    alt="search"
                                />
                            </div>
                        </div>
                        <div className={styles.right}>
                            <button onClick={openPrivateRoomModal}>
                                <span>Join private room</span>
                            </button>
                            <button onClick={openModal}>
                                <img
                                    src="/images/add-room-icon.png"
                                    alt="add-room"
                                />
                                <span>Create room</span>
                            </button>
                        </div>
                    </div>
                    <div className={styles.roomList}>
                        {filteredRooms?.map((room) => (
                            <RoomCard key={room?.id} room={room} />
                        ))}
                    </div>
                </div>
                {showModal && (
                    <RoomModal onClose={() => setShowModal((prev) => !prev)} />
                )}
                {(showPrivateRoomModal || popUp) && (
                    <PrivateRoomModal onClose={handlePrivateRoom} />
                )}
            </div>
        </>
    );
};

export default Rooms;
