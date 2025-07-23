import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import { useRef } from "react";
import { LatLngExpression, LatLngLiteral } from "leaflet";

interface MapProps {
    position: LatLngLiteral;
    startAngle?: number;
    endAngle?: number;
}

const MapAnglePicker = (
    props: MapProps,
) => {
    const { position, startAngle, endAngle } = props;
    const mapRef = useRef(null);
    const middleAngles = (startAngle: number, endAngle: number, depth: number): number[] => {
        if (depth <= 0) {
            if (startAngle < endAngle) {
                return [(startAngle + endAngle) / 2];
            }
            return [(360 + startAngle + endAngle) / 2];
        } else {
            if (startAngle < endAngle) {
                const result: number = (startAngle + endAngle) / 2;
                return [...middleAngles(startAngle, result, depth - 1), result, ...middleAngles(result, endAngle, depth - 1)];
            } else {
                const result: number = (360 + startAngle + endAngle) / 2;
                return [...middleAngles(startAngle, result, depth - 1), result, ...middleAngles(result, endAngle, depth - 1)];
            }
        }

    };

    const recursionDepth = 3; // Increase to make arc less bumpy but less performant

    const angles: number[] = startAngle != undefined && endAngle != undefined ? middleAngles(startAngle, endAngle, recursionDepth) : [];
    const latLngAngles: LatLngExpression[] = angles.map(angle => {
        return [position.lat + 1 / 200 * Math.cos(angle / 360 * 2 * Math.PI),
            position.lng + 1 / 200 * Math.sin(angle / 360 * 2 * Math.PI)];
    });
    return (
        <>
            <MapContainer ref={mapRef} center={position} zoom={14} scrollWheelZoom={true}
                          className={"h-80 w-80 md:w-120 md:h-90 lg:w-140 lg:h-100"}
                          attributionControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} />
                {startAngle &&
                    <Polyline pathOptions={{ color: "blue" }} positions={[
                        [position.lat, position.lng],
                        [position.lat + 1 / 200 * Math.cos(startAngle / 360 * 2 * Math.PI), position.lng + 1 / 200 * Math.sin(startAngle / 360 * 2 * Math.PI)],
                    ]} />
                }
                {endAngle &&
                    <Polyline pathOptions={{ color: "orange" }} positions={[
                        [position.lat, position.lng],
                        [position.lat + 1 / 200 * Math.cos(endAngle / 360 * 2 * Math.PI), position.lng + 1 / 200 * Math.sin(endAngle / 360 * 2 * Math.PI)],
                    ]} />
                }
                {startAngle && endAngle && angles &&
                    <Polyline pathOptions={{ color: "green" }} positions={[
                        [
                            position.lat + 1 / 200 * Math.cos(startAngle / 360 * 2 * Math.PI),
                            position.lng + 1 / 200 * Math.sin(startAngle / 360 * 2 * Math.PI),
                        ],
                        ...latLngAngles,
                        [
                            position.lat + 1 / 200 * Math.cos(endAngle / 360 * 2 * Math.PI),
                            position.lng + 1 / 200 * Math.sin(endAngle / 360 * 2 * Math.PI),
                        ],
                    ]} />
                }
            </MapContainer>

        </>
    );
};

export default MapAnglePicker;