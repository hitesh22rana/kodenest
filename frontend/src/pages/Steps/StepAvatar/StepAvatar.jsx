import React, { useState, useEffect } from "react";
import Card from "../../../components/shared/Card/Card";
import Button from "../../../components/shared/Button/Button";
import styles from "./StepAvatar.module.scss";
import { useSelector, useDispatch } from "react-redux";
import { setAvatar } from "../../../store/activateSlice";
import { activate } from "../../../http";
import { setAuth } from "../../../store/authSlice";
import Loading from "../../../components/shared/Loading/Loading";

const StepAvatar = ({ onNext }) => {
    const dispatch = useDispatch();
    const { name, avatar } = useSelector((state) => state.activate);
    const [image, setImage] = useState("/images/monkey-avatar.png");
    const [isLoading, setIsLoading] = useState(false);
    const [mounted, setMounted] = useState(false);

    function captureImage(e) {
        const file = e.target.files[0];
        saveImage(file);
    }

    function saveImage(image) {
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onloadend = function () {
            setImage(reader.result);
            dispatch(setAvatar(reader.result));
        };
    }

    async function submit() {
        if (!name || !avatar) return;
        setIsLoading(true);
        try {
            const { data } = await activate({ name, avatar });

            if (data?.auth) {
                if (!mounted) {
                    dispatch(setAuth(data));
                }
            }
        } catch (err) {
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        return () => {
            setMounted(true);
        };
    }, []);

    if (isLoading) return <Loading />;
    return (
        <>
            <Card title={`Hello, ${name}`} icon="monkey-emoji">
                <p className={styles.subHeading}>How’s this photo?</p>
                <div className={styles.avatarWrapper}>
                    <img
                        className={styles.avatarImage}
                        src={image}
                        alt="avatar"
                    />
                </div>
                <p className={styles.headAfterAvtar}>
                    Don’t worry you can change this photo anytime!
                </p>
                <div>
                    <input
                        onChange={captureImage}
                        id="avatarInput"
                        type="file"
                        className={styles.avatarInput}
                        accept=".jpg, .jpeg, .png"
                    />
                    <label className={styles.avatarLabel} htmlFor="avatarInput">
                        Choose a different photo
                    </label>
                </div>
                <div className={styles.actionButtonWrap}>
                    <Button onClick={submit} text="Next" />
                </div>
            </Card>
        </>
    );
};

export default StepAvatar;
