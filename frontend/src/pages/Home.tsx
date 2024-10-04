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
    const [openEditSpotModal, setOpenEditSpotModal] = useState<boolean>(false);
    const [openEditWindowModal, setOpenEditWindowModal] = useState<boolean>(false);
    const [selectedSpot, setSelectedSpot] = useState<InfoDTO>();
    const [selectedWindow, setSelectedWindow] = useState<WindWindow>();
    const [isCreateSpot, setIsCreateSpot] = useState(true);
    const [isCreateWindow, setIsCreateWindow] = useState(true);

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
                        onClick={() => {
                            setIsCreateSpot(true);
                            setOpenEditSpotModal(true);
                        }
                        }
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
                                setIsCreateSpot(false);
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
                                                    setIsCreateWindow(false);
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
                                                    setIsCreateWindow(true);
                                                    setSelectedSpot(dto);
                                                    setOpenEditWindowModal(true);
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
                                    setIsCreateWindow(true);
                                    setSelectedSpot(dto);
                                    setOpenEditWindowModal(true);
                                }}
                            >Windfenster hinzufügen</Button>}
                    </>;
                }))}
                <Button
                    variant={"contained"}
                    onClick={() => {
                        setIsCreateSpot(true);
                        setOpenEditSpotModal(true);
                    }
                    }
                >
                    Spot erstellen
                </Button>
            </Stack>
                <EditSpotModal open={openEditSpotModal} setOpen={setOpenEditSpotModal} dto={selectedSpot}
                               isCreateSpot={isCreateSpot} refetch={refetch} />
                {
                    selectedSpot &&
                    (<>
                        <EditWindowModal open={openEditWindowModal} setOpen={setOpenEditWindowModal}
                                         spot={selectedSpot} dto={selectedWindow} refetch={refetch}
                                         isCreateWindow={isCreateWindow} />
                    </>)
                }

            </>);
};

export default Home;