"use client"

import * as React from "react"
import { Calendar } from "@/components/ui/calendar"
import RichTextEditor from "@/components/RichTextEditor";

const PeachNGoma = () => {
    const [date, setDate] = React.useState<Date | undefined>(new Date())

    const monthName = new Intl.DateTimeFormat("en-US", { month: "long" }).format;
    const dayName = new Intl.DateTimeFormat("en-US", { weekday: "long" }).format;
    const dayNumber = new Intl.DateTimeFormat("en-US", { day: "numeric" }).format;


    return (
        <div className="flex flex-raw justify-center">
            <div className="h-90 w-80 bg-red-300 flex flex-col text-center justify-center">
                <div className={"text-white text-2xl"}>{dayName(date)}</div>
                <div className={"text-white text-8xl"}>{dayNumber(date)}</div>
                <div className={"text-white text-2xl"}>{monthName(date)}</div>
            </div>
            <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border shadow text-red-500"
            />
        </div>
    );
};

export default PeachNGoma;