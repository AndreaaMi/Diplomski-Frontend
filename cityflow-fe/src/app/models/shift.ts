import { DayOfWeek } from "./dayOfWeek";

export interface Shift{
    id: number,
    userId: number,
    busId: number,
    startTime: string,
    endTime: string,
    location: string,
    extraHours: number,
}
