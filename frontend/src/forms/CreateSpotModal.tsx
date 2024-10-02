import { useState } from "react";
import { toast } from "react-toastify";
import { CreateSpotDTO } from "../dto/CreateSpotDTO";
import { Box, Button, Modal, Stack, TextField, Typography } from "@mui/material";
import { createSpot } from "../api/callApi";
import { QueryObserverResult, RefetchOptions } from "@tanstack/react-query";
import { InfoDTO } from "../dto/InfoDTO.ts";
import MapPositionPicker from "../util/MapPositionPicker.tsx";
import { LatLngLiteral } from "leaflet";

interface CreateSpotModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<InfoDTO[], Error>>;
}

export const CreateSpotModal = (props: CreateSpotModalProps) => {
    const [name, setName] = useState<string>();
    const [position, setPosition] = useState<LatLngLiteral>({ lat: 54.4667, lng: 10 });
    const { open, setOpen } = props;


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
                        <Typography padding={"20px"} className="!font-semibold" id="modal-modal-title" variant="h5"
                                    component="h2">
                            Spot hinzufügen
                        </Typography>
                        <Box id="modal-modal-description" className={"overflow-auto"}>
                            <Stack spacing={2} direction={"column"} alignItems={"left"}
                                   alignSelf={"center"}
                                   paddingX={"20px"} paddingBottom={"20px"}>
                                <MapPositionPicker position={position || { lat: 54.4667, lng: 10 }}
                                                   setPosition={setPosition}>
                                </MapPositionPicker>
                                <TextField
                                    label={"Breitengrad"}
                                    type={"number"}
                                    value={position.lat}
                                    onChange={e => setPosition({ ...position, lat: Number.parseFloat(e.target.value) })}
                                />
                                <TextField
                                    label={"Längengrad"}
                                    type={"number"}
                                    value={position.lng}
                                    onChange={e => setPosition({ ...position, lng: Number.parseFloat(e.target.value) })}
                                />
                                <TextField
                                    label={"Name/Spot"}
                                    onChange={e => setName(e.target.value)} />
                            </Stack>
                        </Box>
                        <Box className="grid grid-cols-2 gap-5" justifyContent={"space-evenly"}
                             paddingBottom={"20px"} paddingX={"20px"}>
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
                                    if (!name || !position?.lat || !position.lng) {
                                        toast.error("Es sind noch nicht alle Werte gesetzt!");
                                        return;
                                    }

                                    const dto: CreateSpotDTO = {
                                        name: name,
                                        latitude: position.lat,
                                        longitude: position.lng,
                                    };
                                    createSpot(dto)
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
