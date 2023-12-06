"use client"

import { fetchAPI } from "@hook/fetchAPI";
import da from "date-fns/esm/locale/da/index.js";
import { useEffect, useState } from "react";

const Seat = () => {
    const [dataSeat, setDataSeat] = useState<any>([])
    useEffect(() => {
        fetchAPI.get(`/seat/getSeatHasCheckTicket?id=188`).then((s: any) => {
            const updatedSeats = [...s.data];
            updatedSeats[0].seats[0].booked = true;
            updatedSeats[0].seats[5].booked = true;
            const updatedDataSeat = updatedSeats.map((row: any) => ({
                ...row,
                seats: row.seats.map((s: any) => ({
                    ...s,
                    backgroundImage: s.booked ? 'url(/icon/ItemHasBooked.svg)' : 'url(/icon/ItemDefault.svg)',
                })),
            }));
            setDataSeat(updatedDataSeat);
        });
    }, []);
    console.log(dataSeat);
    const handleClick = (row: any, index: any) => {
        const updatedSeats = [...dataSeat];
        const seat = updatedSeats[row] && updatedSeats[row].seats[index];
        if (seat) {
            if (seat.booked == false) {
                seat.backgroundImage =
                    seat.backgroundImage === 'url(/icon/ItemDefault.svg)'
                        ? 'url(/icon/ItemChoose.svg)'
                        : 'url(/icon/ItemDefault.svg)';
            }

            setDataSeat(updatedSeats);
        }
    };
    const seat = dataSeat.map((s: any, rowIndex: any) => {
        return <div>
            <h3>Hàng {s.row}</h3>
            <div>{s.seats.map((s: any, seatIndex: any) => {

                return (
                    <button key={`seat-${rowIndex}-${seatIndex}`} className={`w-16 h-16`} id={`seat-${rowIndex}-${seatIndex}`}
                        disabled={s.booked}
                        style={{
                            height: '50px',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundImage: s.backgroundImage
                        }}

                        onClick={() => handleClick(rowIndex, seatIndex)}
                    >
                        {s.booked ? '' : s.name}
                    </button>
                );
            })}</div>
        </div >
    })

    return <div>{seat}</div>
}
export default Seat;