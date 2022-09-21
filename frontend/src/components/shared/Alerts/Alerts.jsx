import React from "react";
import MuiAlert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Alerts({
    message,
    isAlert,
    setIsAlert,
    severity = "error",
}) {
    const handleClose = (event, reason) => {
        if (reason === "clickaway") {
            return;
        }

        setIsAlert(false);
    };

    return (
        <Snackbar open={isAlert} autoHideDuration={6000} onClose={handleClose}>
            <Alert
                onClose={handleClose}
                severity={severity}
                sx={{ width: "100%" }}
            >
                {message}
            </Alert>
        </Snackbar>
    );
}
