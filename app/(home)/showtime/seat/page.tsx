"use client"

import { fetchAPI } from "@hook/fetchAPI";
import { useEffect, useState } from "react";
import { useSearchParams } from 'next/navigation';
const Seat = () => {
    const [dataSeat, setDataSeat] = useState<any>([]);
    const [selectedSeats, setSelectedSeats] = useState<any>([]);
    const searchParams = useSearchParams();
    const showtimeId = searchParams.get("id");
    const staffId = searchParams.get("staffId");

    useEffect(() => {
        fetchAPI.get(`/seat/getSeatHasCheckTicket?id=${showtimeId}`).then((s: any) => {
            const updatedSeats = [...s.data];
            // updatedSeats[0].seats[0].booked = true;
            // updatedSeats[0].seats[5].booked = true;
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

    const handleClick = async (row: any, index: any) => {
        const updatedSeats = [...dataSeat];
        const seat = updatedSeats[row] && updatedSeats[row].seats[index];
        if (seat) {
            if (seat.booked == false) {
                seat.backgroundImage =
                    seat.backgroundImage === 'url(/icon/ItemDefault.svg)'
                        ? 'url(/icon/ItemChoose.svg)'
                        : 'url(/icon/ItemDefault.svg)';
                if (seat.backgroundImage === 'url(/icon/ItemChoose.svg)') {
                    const { data: prices } = await fetchAPI.get("/seat/getTotalPrice", { params: { showtimeid: showtimeId, name: updatedSeats[row].seats[index].name } });
                    setSelectedSeats((prevSelectedSeats: any) => [...prevSelectedSeats, { name: updatedSeats[row].seats[index].name, total: prices.total }]);
                } else {
                    setSelectedSeats((prevSelectedSeats: any) => prevSelectedSeats.filter((s: any) => s.name !== seat.name));
                }

            }
            setDataSeat(updatedSeats);
        }
    };

    useEffect(() => {
        localStorage.setItem(`seat_${showtimeId}_${staffId}`, JSON.stringify(selectedSeats));
    }, [selectedSeats, showtimeId, staffId]);

    const seat = dataSeat.map((s: any, rowIndex: any) => {
        return <div key={rowIndex} className="col flex items-center ml-2">
            <div className="bg-blue-500 w-8 h-10 text-white text-lg font-medium border-solid border-2 rounded flex justify-center items-center ">{s.row}</div>
            <div className="col flex items-center">{s.seats.map((s: any, seatIndex: any) => {
                return (
                    <button key={`seat-${rowIndex}-${seatIndex}`} className="h-16" id={`seat-${rowIndex}-${seatIndex}`}
                        disabled={s.booked}
                        style={{
                            width: "70px",
                            paddingBottom: "8px",
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundImage: s.backgroundImage
                        }}
                        onClick={() => handleClick(rowIndex, seatIndex)}
                    >
                        {s.booked ? '' : seatIndex + 1}
                    </button>
                );
            })}</div>
        </div >
    });


    const infor = () => {
        const a = JSON.parse(localStorage.getItem(`showtime_${showtimeId}`) ?? "null");
        const totalPrice = selectedSeats.map((s: any) => s.total).reduce((a: any, b: any) => a + b, 0)
        const totalSeat = selectedSeats.map((s: any, index: number) => {
            return <span>{s.name}{index < selectedSeats.length - 1 && ', '}</span>
        })
        return <div className="p-5">
            <img src={`https://zuhot-cinema-images.s3.amazonaws.com/poster-movie/${a.movieId}.png`} alt="" />
            <h2 className="text-center text-base  font-medium my-2 text-red-600">{a.movieName}</h2>
            <h3 className="text-base text-black font-medium mb-1">Tổng ghế: {totalSeat}</h3>
            <h3 className="text-base text-black font-medium">Tổng tiền: {totalPrice.toLocaleString('it-IT', { style: 'currency', currency: 'VND' })}</h3>
            <button className="relative w-full inline-flex items-center justify-center p-0.5 mb-1 mt-3 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-600 to-red-400 group-hover:from-red-600 group-hover:to-red-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                <span className="relative w-full py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xl">
                    Đi tiếp
                </span>
            </button>
        </div>
    }

    return (<>
        <div className="w-full">
            <h1 className="text-center text-4xl font-medium my-5">Đặt ghế</h1>
        </div>
        <div className="flex">
            <div className="w-3/4 p-4">
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">{seat}</div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg grid grid-cols-3 gap-4">
                    <div className="col flex items-center">
                        <div className="w-16 h-16" style={{
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundImage: 'url(/icon/ItemDefault.svg)'
                        }}></div><span>Ghế chưa đặt</span>
                    </div>
                    <div className="col flex items-center">
                        <div className="w-16 h-16" style={{
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundImage: 'url(/icon/ItemChoose.svg)'
                        }}></div><span>Ghế được chọn</span>
                    </div>
                    <div className="col flex items-center">
                        <div className="w-16 h-16" style={{
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundImage: 'url(/icon/ItemHasBooked.svg)'
                        }}></div><span>Ghế đã được đặt</span>
                    </div>
                </div>
            </div>
            <div className="w-1/4 p-4" >
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <div className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <h1 className="text-center text-2xl font-medium text-black">Thông tin chi tiết</h1>
                        {infor()}
                    </div>
                </div>
            </div>
        </div>
    </>
    )
}
export default Seat;