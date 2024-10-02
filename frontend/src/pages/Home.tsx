import { useState } from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Stack,
} from "@mui/material";
import { deleteSpot, deleteWindWindow, getSpotInfo } from "../api/callApi";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { InfoDTO, WindWindow } from "../dto/InfoDTO.ts";
import { Add, ExpandMore } from "@mui/icons-material";
import { CreateSpotModal } from "../forms/CreateSpotModal.tsx";
import { CreateWindowModal } from "../forms/CreateWindowModal.tsx";
import { EditSpotModal } from "../forms/EditSpotModal.tsx";
import { EditWindowModal } from "../forms/EditWindowModal.tsx";
import { useQuery } from "@tanstack/react-query";
import queryKeys from "../api/queryKeys.ts";

const useSpotInfoQuery = () => {
    return useQuery<InfoDTO[]>({
        queryKey: queryKeys.spots,
        queryFn: () => getSpotInfo(),
        retry: false,
        refetchOnWindowFocus: true,
    });
};

export const Home = () => {
    const { data: spots, refetch, isFetching } = useSpotInfoQuery();
    const [openCreateSpotModal, setOpenCreateSpotModal] = useState<boolean>(false);
    const [openWindowModal, setOpenWindowModal] = useState<boolean>(false);
    const [openEditSpotModal, setOpenEditSpotModal] = useState<boolean>(false);
    const [openEditWindowModal, setOpenEditWindowModal] = useState<boolean>(false);
    const [selectedSpot, setSelectedSpot] = useState<InfoDTO>();
    const [selectedWindow, setSelectedWindow] = useState<WindWindow>();

    return isFetching ?
        <>
            <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress style={{ alignSelf: "center" }} />
            </Box>
        </>
        : spots == undefined ? (
            <>
                <Stack spacing={2} direction={"column"} width={"100%"} alignItems={"center"} alignSelf={"center"}
                       paddingTop={"20px"}>
                    <Button onClick={() => refetch()}>
                        Neu laden
                    </Button>
                    <Button
                        variant={"contained"}
                        onClick={() => setOpenCreateSpotModal(true)}
                    >
                        Spot erstellen
                    </Button>
                </Stack>
            </>
        ) : (
            <><Stack spacing={2} direction={"column"} width={"100%"} alignItems={"center"} alignSelf={"center"}
                     paddingTop={"20px"}>
                <Button onClick={() => refetch()}>
                    Neu laden
                </Button>
                {spots.map((dto => {
                    return <>
                        <div>
                            Spotname: {dto.spotName}
                            <IconButton
                                onClick={() => {
                                    deleteSpot(dto.spotId).then(() => refetch());
                                }
                                }><DeleteIcon /></IconButton>
                            <IconButton onClick={() => {
                                setSelectedSpot(dto);
                                setOpenEditSpotModal(true);
                            }}><EditIcon /></IconButton>
                        </div>
                        <div>
                            Breitengrad: {dto.spotLatitude}
                        </div>
                        <div>
                            Längengrad: {dto.spotLongitude}
                        </div>
                        {dto.windows.length != 0 ?
                            <Accordion>
                                <AccordionSummary
                                    expandIcon={<ExpandMore />}
                                >Windfenster</AccordionSummary>
                                <AccordionDetails>
                                    <Stack>
                                        {dto.windows.map((window) => <>
                                            <div>Id: {window.windWindowId}
                                                <IconButton
                                                    onClick={() => {
                                                        deleteWindWindow(window.windWindowId).then(() => refetch());
                                                    }
                                                    }><DeleteIcon /></IconButton>
                                                <IconButton onClick={async () => {
                                                    setSelectedSpot(dto);
                                                    setSelectedWindow(window);
                                                    setOpenEditWindowModal(true);
                                                }}><EditIcon /></IconButton></div>
                                            <div>Windgeschwindigkeit: {window.speed}kn

                                            </div>
                                            <div>Startwinkel: {window.startAngle}</div>
                                            <div>Endwinkel: {window.endAngle}</div>
                                            <Button
                                                variant="outlined"
                                                startIcon={<Add />}
                                                onClick={() => {
                                                    setSelectedSpot(dto);
                                                    setOpenWindowModal(true);
                                                }}
                                            >Windfenster hinzufügen</Button>
                                        </>)}
                                    </Stack>
                                </AccordionDetails>
                            </Accordion> :
                            <Button
                                variant="outlined"
                                startIcon={<Add />}
                                onClick={() => {
                                    setSelectedSpot(dto);
                                    setOpenWindowModal(true);
                                }}
                            >Windfenster hinzufügen</Button>}
                    </>;
                }))}
                <Button
                    variant={"contained"}
                    onClick={() => setOpenCreateSpotModal(true)}
                >
                    Spot erstellen
                </Button>
            </Stack>
                <CreateSpotModal open={openCreateSpotModal} setOpen={setOpenCreateSpotModal} refetch={refetch} />
                {
                    selectedSpot &&
                    (<>
                        <CreateWindowModal open={openWindowModal} setOpen={setOpenWindowModal}
                                           spot={selectedSpot} refetch={refetch} />
                        <EditSpotModal open={openEditSpotModal} setOpen={setOpenEditSpotModal}
                                       dto={selectedSpot} refetch={refetch} />
                    </>)
                }
                {selectedSpot && selectedWindow &&
                    (<>
                        <EditWindowModal open={openEditWindowModal} setOpen={setOpenEditWindowModal}
                                         spot={selectedSpot}
                                         dto={selectedWindow}
                                         refetch={refetch}
                        />
                    </>)

                }
            </>);
};

export default Home;