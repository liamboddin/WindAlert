import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createWindWindow, updateWindWindow } from "../api/callApi";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { InfoDTO, WindWindow } from "../dto/InfoDTO.ts";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import MapAnglePicker from "../util/MapAnglePicker.tsx";

interface EditWindowModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    spot: InfoDTO;
    dto?: WindWindow;
    isCreateWindow: boolean;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<InfoDTO[], Error>>;
}

export const EditWindowModal = (props: EditWindowModalProps) => {
    const { open, setOpen, spot, dto: propDTO, isCreateWindow, refetch } = props;
    const [speed, setSpeed] = useState(!isCreateWindow ? propDTO?.speed : undefined);
    const [startAngle, setStartAngle] = useState(!isCreateWindow ? propDTO?.startAngle : undefined);
    const [endAngle, setEndAngle] = useState(!isCreateWindow ? propDTO?.endAngle : undefined);

    const [speedError, setSpeedError] = useState(false);
    const [startAngleError, setStartAngleError] = useState(false);
    const [endAngleError, setEndAngleError] = useState(false);

    useEffect(() => {
        setSpeed(!isCreateWindow ? propDTO?.speed : Number.NaN);
        setStartAngle(!isCreateWindow ? propDTO?.startAngle : Number.NaN);
        setEndAngle(!isCreateWindow ? propDTO?.endAngle : Number.NaN);
    }, [isCreateWindow, propDTO]);

    const onConfirm = () => {
        if (!speed || !startAngle || !endAngle || !spot.spotId) {
            toast.warning("Es sind noch nicht alle Werte gesetzt!");
            if (!speed) {
                setSpeedError(true);
            }
            if (!startAngle) {
                setStartAngleError(true);
            }
            if (!endAngle) {
                setEndAngleError(true);
            }
            return;
        }
        setSpeedError(false);
        setStartAngleError(false);
        setEndAngleError(false);

        if (isCreateWindow) {
            createWindWindow({
                speed: speed,
                startAngle: startAngle,
                endAngle: endAngle,
                spotId: spot.spotId,
            })
                .then(() => refetch())
                .then(() => setOpen(false));
        } else {
            if (!propDTO?.windWindowId || !spot.spotId) {
                toast.error("Etwas ist schief gelaufen!");
                return;
            }
            updateWindWindow({
                id: propDTO.windWindowId,
                speed: speed,
                startAngle: startAngle,
                endAngle: endAngle,
                spotId: spot.spotId,
            })
                .then(() => refetch())
                .then(() => setOpen(false));
        }
    };

    if (!isCreateWindow && propDTO == undefined) {
        return <></>;
    }
    return (

        <Modal
            open={open}
            onClose={() => setOpen(false)}
            onKeyDown={(e) => {
                if (e.key === "Enter") {
                    onConfirm();
                }
            }}
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
            }}
        >

            <Box
                className={"max-h-xl flex max-w-2xl flex-col gap-y-5 rounded-2xl bg-white p-5 content-center justify-center focus:outline-0"}
                alignSelf={"center"}
            >
                <Typography className="px-5 pt-5" variant="h5" component="h2">
                    {isCreateWindow ? "Windfenster erstellen" : "Windfenster bearbeiten"}
                </Typography>
                <Stack spacing={2} direction={"column"}
                       className={"px-5 self-center items-center w-full"}>
                    <MapAnglePicker position={{ lat: spot.spotLatitude, lng: spot.spotLongitude }}
                                    startAngle={startAngle} endAngle={endAngle} />
                    <TextField
                        className={"w-full"}
                        label={"Windgeschwindigkeit in Knoten"}
                        type={"number"}
                        error={speedError}
                        helperText={speedError ? "Die Windgeschwindigkeit muss gesetzt sein." : ""}
                        value={speed || ""}
                        onChange={e => {
                            const num: number = Number.parseInt(e.target.value);
                            setSpeedError(Number.isNaN(num) || num <= 0);
                            if (!(Number.isNaN(num) || num <= 0)) {
                                setSpeed(num);
                            }
                        }
                        } />
                    <TextField
                        className={"w-full"}
                        label={"Start Winkel in Grad"}
                        type={"number"}
                        error={startAngleError}
                        helperText={startAngleError ? "Der Start-Winkel muss gesetzt sein." : ""}
                        value={startAngle || ""}
                        onChange={e => {
                            const num: number = Number.parseInt(e.target.value);
                            setStartAngleError(Number.isNaN(num));
                            if (num < 0) {
                                setStartAngle(num + 360);
                            } else if (num > 359) {
                                setStartAngle(num - 360);
                            } else {
                                setStartAngle(num);
                            }
                        }
                        } />
                    <TextField
                        className={"w-full"}
                        label={"End Winkel in Grad"}
                        type={"number"}
                        error={endAngleError}
                        helperText={startAngleError ? "Der End-Winkel muss gesetzt sein." : ""}
                        value={endAngle || ""}
                        onChange={e => {
                            const num: number = Number.parseInt(e.target.value);
                            setEndAngleError(Number.isNaN(num));
                            if (num < 0) {
                                setEndAngle(num + 360);
                            } else if (num > 359) {
                                setEndAngle(num - 360);
                            } else {
                                setEndAngle(num);
                            }
                        }
                        } />
                </Stack>
                <Box className="grid grid-cols-2 gap-5" paddingBottom={"20px"} paddingX={"20px"}>
                    <Button
                        variant={"contained"}
                        className="button button-secondary mr-5"
                        onClick={() => {
                            setSpeedError(false);
                            setStartAngleError(false);
                            setEndAngleError(false);
                            setOpen(false);
                        }
                        }
                    >
                        Schließen
                    </Button>
                    <Button
                        variant={"contained"}
                        className="button button-primary"
                        onClick={() => onConfirm()}
                    >
                        Bestätigen
                    </Button>
                </Box>
            </Box>
        </Modal>
    );
};
