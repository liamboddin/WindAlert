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
                                    label={"Start Winkel in Grad"}
                                    type={"number"}
                                    value={dto?.startAngle}
                                    onChange={e => setDTO({ ...dto, startAngle: Number.parseInt(e.target.value) })} />
                                <TextField
                                    label={"End Winkel in Grad"}
                                    type={"number"}
                                    value={dto?.endAngle}
                                    onChange={e => setDTO({ ...dto, endAngle: Number.parseInt(e.target.value) })} />
                                <TextField
                                    label={"Windgeschwindigkeit in Knoten"}
                                    type={"number"}
                                    value={dto?.speed}
                                    onChange={e => setDTO({ ...dto, speed: Number.parseInt(e.target.value) })} />
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
                                    if (!dto?.speed || !dto?.startAngle || !dto?.endAngle || !spot.spotId) {
                                        toast.warning("Not all values are set");
                                        return;
                                    }

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
