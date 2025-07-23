import { MapContainer, Marker, TileLayer, useMap } from "react-leaflet";
import { useEffect, useMemo, useRef } from "react";
import { LatLngLiteral } from "leaflet";

interface MapProps {
    position: LatLngLiteral;
    setPosition: React.Dispatch<React.SetStateAction<LatLngLiteral>>;
}

const RecenterAutomatically = ({ position }: { position: LatLngLiteral }) => {
    const map = useMap();
    useEffect(() => {
        map.setView([position.lat, position.lng]);
    }, [map, position]);
    return null;
};

const MapPositionPicker = (
    props: MapProps,
) => {
    const { position, setPosition } = props;
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                if (markerRef.current != null) {
                    // @ts-expect-error needed
                    setPosition(markerRef.current?.getLatLng());
                }
            },
        }),
        [setPosition],
    );

    return (
        <>
            <MapContainer ref={mapRef} center={position} zoom={10} scrollWheelZoom={true}
                          className={"h-80 w-80 md:w-120 md:h-90 lg:w-140 lg:h-100"}
                          attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} draggable eventHandlers={eventHandlers}
                        ref={markerRef} />
                <RecenterAutomatically position={position} />
            </MapContainer>

        </>
    );
};

export default MapPositionPicker;