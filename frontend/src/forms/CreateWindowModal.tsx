import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { createWindWindow } from "../api/callApi";
import { WindWindowDTO } from "../dto/WindWIndowDTO";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { InfoDTO } from "../dto/InfoDTO.ts";
import { LatLngLiteral } from "leaflet";
import MapAnglePicker from "../util/MapAnglePicker.tsx";

interface CreateWindowModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    spot: InfoDTO;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<InfoDTO[], Error>>;
}

export const CreateWindowModal = (props: CreateWindowModalProps) => {
    const [speed, setSpeed] = useState<number>();
    const [startAngle, setStartAngle] = useState<number>();
    const [endAngle, setEndAngle] = useState<number>();
    const { open, setOpen, spot } = props;
    const position: LatLngLiteral = { lat: spot.spotLatitude, lng: spot.spotLongitude };


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
                            Windfenster erstellen
                        </Typography>
                        <Box id="modal-modal-description" className={"overflow-auto"}>
                            <Stack spacing={2} direction={"column"} alignItems={"left"}
                                   alignSelf={"center"}
                                   paddingX={"20px"} paddingBottom={"20px"}>
                                <MapAnglePicker position={position} startAngle={startAngle} endAngle={endAngle} />
                                <TextField
                                    label={"Windgeschwindigkeit in Knoten"}
                                    type={"number"}
                                    onChange={e => setSpeed(Number.parseInt(e.target.value))} />
                                <TextField
                                    label={"Start Winkel in Grad"}
                                    type={"number"}
                                    onChange={e => setStartAngle(Number.parseInt(e.target.value))} />
                                <TextField
                                    label={"End Winkel in Grad"}
                                    type={"number"}
                                    onChange={e => setEndAngle(Number.parseInt(e.target.value))} />
                            </Stack>
                        </Box>
                        <Box className="grid grid-cols-2 gap-5" paddingBottom={"20px"} paddingX={"20px"}>
                            <Button
                                style={{ marginRight: "20px" }}
                                variant={"contained"}
                                className="button button-secondary"
                                onClick={() => setOpen(false)}
                            >
                                Schließen
                            </Button>
                            <Button
                                variant={"contained"}
                                className="button button-primary"
                                onClick={() => {
                                    if (!speed || !startAngle || !endAngle) {
                                        toast.warning("Not all values are set");
                                        return;
                                    }

                                    const dto: WindWindowDTO = {
                                        speed: speed,
                                        startAngle: startAngle,
                                        endAngle: endAngle,
                                        spotId: spot.spotId,
                                    };
                                    createWindWindow(dto)
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
