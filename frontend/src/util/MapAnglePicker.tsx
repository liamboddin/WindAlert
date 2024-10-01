import { MapContainer, Marker, Polyline, TileLayer } from "react-leaflet";
import { useRef } from "react";
import { LatLngLiteral } from "leaflet";

interface MapProps {
    position: LatLngLiteral;
    startAngle?: number;
    endAngle?: number;
}

const MapAnglePicker = (
    props: MapProps,
) => {
    const {position, startAngle, endAngle} = props;
    const mapRef = useRef(null);
    const middleAngle = (startAngle: number, endAngle: number) => {
        if (startAngle < endAngle) {
            return (startAngle + endAngle) / 2;
        }
        return (360 + startAngle + endAngle) / 2;
    }
    const halfAngle = startAngle && endAngle ? middleAngle(startAngle, endAngle) : 0;
    const firstQuarter = startAngle && endAngle ? middleAngle(startAngle, halfAngle) : 0;
    const thirdQuarter = startAngle && endAngle ? middleAngle(halfAngle, endAngle) : 0;
    return (
        <>
            <MapContainer ref={mapRef} center={position} zoom={14} scrollWheelZoom={true}
                          style={{ height: "300px", width: "300px" }}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position} />
                {startAngle &&
                    <Polyline pathOptions={{ color: "blue" }} positions={[
                        [position.lat, position.lng],
                        [position.lat + 1 / 200 * Math.cos(startAngle / 360 * 2 * Math.PI), position.lng + 1 / 200 * Math.sin(startAngle / 360 * 2 * Math.PI)]
                    ]} />
                }
                {endAngle &&
                    <Polyline pathOptions={{ color: "orange" }} positions={[
                        [position.lat, position.lng],
                        [position.lat + 1 / 200 * Math.cos(endAngle / 360 * 2 * Math.PI), position.lng + 1 / 200 * Math.sin(endAngle / 360 * 2 * Math.PI)]
                    ]} />
                }
                {startAngle && endAngle && halfAngle && firstQuarter && thirdQuarter &&
                    <Polyline pathOptions={{color: "green"}} positions={[
                        [position.lat + 1 / 200 * Math.cos(startAngle / 360 * 2 * Math.PI), position.lng + 1 / 200 * Math.sin(startAngle / 360 * 2 * Math.PI)],
                        [position.lat + 1 / 200 * Math.cos(firstQuarter / 360 * 2 * Math.PI), position.lng + 1 / 200 * Math.sin(firstQuarter / 360 * 2 * Math.PI)],
                        [position.lat + 1 / 200 * Math.cos(halfAngle / 360 * 2 * Math.PI), position.lng + 1 / 200 * Math.sin(halfAngle / 360 * 2 * Math.PI)],
                        [position.lat + 1 / 200 * Math.cos(thirdQuarter / 360 * 2 * Math.PI), position.lng + 1 / 200 * Math.sin(thirdQuarter / 360 * 2 * Math.PI)],
                        [position.lat + 1 / 200 * Math.cos(endAngle / 360 * 2 * Math.PI), position.lng + 1 / 200 * Math.sin(endAngle / 360 * 2 * Math.PI)]
                    ]} />
                }
            </MapContainer>

        </>
    );
};

export default MapAnglePicker;