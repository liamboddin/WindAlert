import { MapContainer, Marker, TileLayer } from "react-leaflet";
import { useMemo, useRef } from "react";
import { LatLngLiteral } from "leaflet";

interface MapProps {
    position: LatLngLiteral;
    setPosition: React.Dispatch<React.SetStateAction<LatLngLiteral>>;
}

const MapPositionPicker = (
    props: MapProps,
) => {
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const eventHandlers = useMemo(
        () => ({
            dragend() {
                if (markerRef.current != null) {
                    // @ts-expect-error needed
                    props.setPosition(markerRef.current?.getLatLng());
                }
            },
        }),
        [props],
    );
    return (
        <>
            <MapContainer ref={mapRef} center={props.position} zoom={10} scrollWheelZoom={true}
                          style={{ height: "300px", width: "300px" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={props.position} draggable eventHandlers={eventHandlers}
                        ref={markerRef} />
            </MapContainer>

        </>
    );
};

export default MapPositionPicker;