import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import {Box, Button, Modal, Stack, TextField, Typography} from "@mui/material";
import {createSpot, updateSpot} from "../api/callApi";
import {InfoDTO} from "../dto/InfoDTO.ts";
import {QueryObserverResult, RefetchOptions} from "@tanstack/react-query";
import MapPositionPicker from "../util/MapPositionPicker.tsx";
import {LatLngLiteral} from "leaflet";

interface EditSpotModalProps {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    dto?: InfoDTO;
    isCreateSpot: boolean;
    refetch: (options?: RefetchOptions) => Promise<QueryObserverResult<InfoDTO[], Error>>;
}

export const EditSpotModal = (props: EditSpotModalProps) => {
    const {open, setOpen, dto: propDTO, isCreateSpot} = props;
    const [name, setName] = useState(!isCreateSpot ? propDTO?.spotName : "");
    const [position, setPosition] = useState<LatLngLiteral>({
        lat: !isCreateSpot && propDTO?.spotLatitude != undefined ? propDTO.spotLatitude : 54.4667,
        lng: !isCreateSpot && propDTO?.spotLongitude != undefined ? propDTO.spotLongitude : 10,
    });
    const [nameError, setNameError] = useState(false);

    const onConfirm = () => {
        if (!name || !position?.lat || !position.lng) {
            toast.warning("Es sind noch nicht alle Werte gesetzt!");
            if (!name || name.trim() == "") {
                setNameError(true);
            }
            return;
        }

        setNameError(false);


        if (isCreateSpot) {
            createSpot({name: name, latitude: position.lat, longitude: position.lng})
                .then(() => props.refetch())
                .then(() => setOpen(false));
        } else {
            if (!propDTO?.spotId) {
                toast.error("Etwas ist schief gelaufen!");
                return;
            }
            updateSpot({
                id: propDTO.spotId,
                name: name,
                latitude: position.lat,
                longitude: position.lng,
            })
                .then(() => props.refetch())
                .then(() => setOpen(false));
        }

    }

    useEffect(() => {
        setPosition({
            lat: !isCreateSpot && propDTO?.spotLatitude != undefined ? propDTO.spotLatitude : 54.4667,
            lng: !isCreateSpot && propDTO?.spotLongitude != undefined ? propDTO.spotLongitude : 10,
        });
    }, [isCreateSpot, propDTO]);

    useEffect(() => {
        setName(!isCreateSpot ? propDTO?.spotName : "");
    }, [isCreateSpot, propDTO]);

    if (!isCreateSpot && propDTO == undefined) {
        return <></>;
    }
    return (
        <>
            <Modal
                open={open}
                onKeyDown={(e) => {
                    if (e.key === "Enter") {
                        onConfirm();
                    }
                }}
                onClose={() => setOpen(false)}
                style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                }}
            >
                <Box
                    className={"max-h-xl max-w-2xl flex-col gap-y-5 rounded-2xl bg-white p-5 flex content-center justify-center focus:outline-0"}
                    style={{backgroundColor: "white"}}
                    alignSelf={"center"}
                    display={"flex"}
                    justifyContent={"center"}
                >
                    <Typography className={"px-5 pt-5"} variant="h5" component="h2">
                        {isCreateSpot ? "Spot erstellen" : "Spot bearbeiten"}
                    </Typography>
                    <Stack spacing={2} direction={"column"} alignItems={"left"}
                           alignSelf={"center"}
                           paddingX={"20px"} paddingBottom={"20px"}
                    >
                        <MapPositionPicker position={position} setPosition={setPosition}/>
                        <TextField
                            label={"Breitengrad"}
                            type={"number"}
                            value={position.lat}
                            onChange={e => setPosition({...position, lat: Number.parseFloat(e.target.value)})}
                        />
                        <TextField
                            label={"Längengrad"}
                            type={"number"}
                            value={position.lng}
                            onChange={e => setPosition({...position, lng: Number.parseFloat(e.target.value)})}
                        />
                        <TextField
                            label={"Name*"}
                            value={name}
                            error={nameError}
                            helperText={nameError ? "Der Name darf nicht leer sein!" : ""}
                            onChange={e => {
                                setNameError(e.target.value.trim() == "");
                                setName(e.target.value);
                            }
                            }/>
                    </Stack>
                    <Box className="grid grid-cols-2 gap-5" justifyContent={"space-evenly"}
                         paddingBottom={"20px"} paddingX={"20px"}>
                        <Button
                            variant={"contained"}
                            className="button button-secondary mr-5"
                            onClick={() => {
                                setNameError(false);
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
        </>
    );
};
