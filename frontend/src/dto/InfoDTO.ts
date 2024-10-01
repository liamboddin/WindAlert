export interface InfoDTO {
    spotId: number;
    spotName: string;
    windows: WindWindow[];
    spotLatitude: number,
    spotLongitude: number
}

export interface WindWindow {
    windWindowId: number;
    speed: number;
    startAngle: number;
    endAngle: number;
}

