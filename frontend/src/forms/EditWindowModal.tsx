import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { updateWindWindow } from "../api/callApi";
import { WindWindowDTO } from "../dto/WindWIndowDTO";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { InfoDTO, WindWindow } from "../dto/InfoDTO.ts";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import MapAnglePicker from "../util/MapAnglePicker.tsx";

interface EditWindowModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    spot: InfoDTO;
    dto: WindWindow;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<InfoDTO[], Error>>;
}

export const EditWindowModal = (props: EditWindowModalProps) => {
    const { open, setOpen, spot, dto: propDTO } = props;
    const [dto, setDTO] = useState<WindWindow>(propDTO);
    const [speedError, setSpeedError] = useState(false);
    const [startAngleError, setStartAngleError] = useState(false);
    const [endAngleError, setEndAngleError] = useState(false);

    return (
        <>
            <Modal
                open={open}
                onClose={() => setOpen(false)}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                }}
            >
                <Box
                    className={"flex content-center justify-center focus:outline-0"}
                    style={{ backgroundColor: "white" }}
                    alignSelf={"center"}
                    display={"flex"}
                    justifyContent={"center"}

                >
                    <Box
                        className={"max-h-xl flex max-w-2xl flex-col gap-y-10 rounded-2xl bg-white p-5"}
                        alignSelf={"center"}
                    >
                        <Typography className="!font-semibold" id="modal-modal-title" variant="h5" component="h2"
                                    padding={"20px"}>
                            Windfenster bearbeiten
                        </Typography>
                        <Box id="modal-modal-description" className={"overflow-auto"}>
                            <Stack spacing={2} direction={"column"} alignItems={"left"}
                                   alignSelf={"center"}
                                   paddingX={"20px"} paddingBottom={"20px"}>
                                <MapAnglePicker position={{ lat: spot.spotLatitude, lng: spot.spotLongitude }}
                                                startAngle={dto.startAngle} endAngle={dto.endAngle} />
                                <TextField
                                    label={"Windgeschwindigkeit in Knoten"}
                                    type={"number"}
                                    error={speedError}
                                    helperText={speedError ? "Die Windgeschwindigkeit muss gesetzt sein." : ""}
                                    value={dto?.speed}
                                    onChange={e => {
                                        const num: number = Number.parseInt(e.target.value);
                                        setSpeedError(Number.isNaN(num) || num <= 0);
                                        if (!(Number.isNaN(num) || num <= 0)) {
                                            setDTO({ ...dto, speed: num });
                                        }
                                    }
                                    } />
                                <TextField
                                    label={"Start Winkel in Grad"}
                                    type={"number"}
                                    error={startAngleError}
                                    helperText={startAngleError ? "Der Start-Winkel muss gesetzt sein." : ""}
                                    value={dto?.startAngle}
                                    onChange={e => {
                                        const num: number = Number.parseInt(e.target.value);
                                        setStartAngleError(Number.isNaN(num));
                                        if (num < 0) {
                                            setDTO({ ...dto, startAngle: num + 360 });
                                        } else if (num > 359) {
                                            setDTO({ ...dto, startAngle: num - 360 });
                                        } else {
                                            setDTO({ ...dto, startAngle: num });
                                        }
                                    }
                                    } />
                                <TextField
                                    label={"End Winkel in Grad"}
                                    type={"number"}
                                    error={endAngleError}
                                    helperText={startAngleError ? "Der End-Winkel muss gesetzt sein." : ""}
                                    value={dto?.endAngle}
                                    onChange={e => {
                                        const num: number = Number.parseInt(e.target.value);
                                        setEndAngleError(Number.isNaN(num));
                                        if (num < 0) {
                                            setDTO({ ...dto, endAngle: num + 360 });
                                        } else if (num > 359) {
                                            setDTO({ ...dto, endAngle: num - 360 });
                                        } else {
                                            setDTO({ ...dto, endAngle: num });
                                        }
                                    }
                                    } />
                            </Stack>
                        </Box>
                        <Box className="grid grid-cols-2 gap-5" paddingBottom={"20px"} paddingX={"20px"}>
                            <Button
                                style={{ marginRight: "20px" }}
                                variant={"contained"}
                                className="button button-secondary"
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
                                onClick={() => {
                                    if (!dto?.speed || !dto?.startAngle || !dto?.endAngle || !spot.spotId) {
                                        toast.warning("Not all values are set");
                                        if (!dto.speed) {
                                            setSpeedError(true);
                                        }
                                        if (!dto.startAngle) {
                                            setStartAngleError(true);
                                        }
                                        if (!dto.endAngle) {
                                            setEndAngleError(true);
                                        }
                                        return;
                                    }
                                    setSpeedError(false);
                                    setStartAngleError(false);
                                    setEndAngleError(false);
                                    const r: WindWindowDTO = {
                                        id: dto?.windWindowId || 0,
                                        speed: dto.speed || 0,
                                        startAngle: dto.startAngle,
                                        endAngle: dto.endAngle,
                                        spotId: spot.spotId,
                                    };
                                    updateWindWindow(r)
                                        .then(() => props.refetch())
                                        .then(() => setOpen(false));
                                }}>
                                Bestätigen
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};
