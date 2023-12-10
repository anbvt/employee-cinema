"use client"
import { fetchAPI } from "@hook/fetchAPI";
import { useSession } from "next-auth/react";
import React from "react";
import { useEffect, useState } from "react";
import { format } from 'date-fns';
import Link from "next/link";
const Showtime = () => {
    const [dataShowtime, setDataShowtime] = useState<any>([]);
    const [currentDate, setCurrentDate] = useState(format(new Date(), 'dd-MM-yyyy'));
    const { data: session } = useSession();
    useEffect(() => {
        fetchAPI.get(`/showtime/cd?branchid=${session?.user.branchId}`)
            .then(response => {
                setDataShowtime(response.data);
            })
            .catch(error => {
            });
    }, [session]);

    const groupedShowtime = dataShowtime.reduce((acc: any, s: any) => {
        const key = s.starttime;
        if (!acc[key]) {
            acc[key] = [];
        }
        acc[key].push(s);
        return acc;
    }, {});

    const card = () => {
        return <>
            {Object.values(groupedShowtime).map((row: any) => {
                return <div key={row[0].starttime}>
                    <h2 className="text-2xl ml-4">{row[0].starttime}</h2>
                    <div className="flex flex-wrap -mx-4">
                        {row.map((s: any) => {
                            return <Link href={{
                                pathname: `/showtime/seat`,
                                query: { id: s.id, staffId: session?.user.id }
                            }} onClick={() => { localStorage.setItem(`showtime_${s.id}`, JSON.stringify({ movieId: s.movieid, movieName: s.movie, starttime: row[0].starttime,  })); }} key={s.movieid} className="flex w-full max-w-[26rem] md:w-1/2 lg:w-1/3 xl:w-1/4 p-4">
                                <div className="relative flex flex-col w-full rounded-xl bg-white text-gray-700 shadow-lg">
                                    <div className="relative mx-4 mt-4 overflow-hidden text-white shadow-lg rounded-xl bg-blue-gray-500 bg-clip-border shadow-blue-gray-500/40">
                                        <img className="h-80 w-full" src={`https://zuhot-cinema-images.s3.amazonaws.com/poster-movie/${s.movieid}.png`} alt="ui/ux review check" />
                                    </div>
                                    <div className="p-6">
                                        <div className="flex items-center justify-between mb-3">
                                            <h5 className="block font-sans text-xl antialiased font-medium leading-snug tracking-normal text-blue-gray-900">
                                                {s.movie}
                                            </h5>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        })}
                    </div>
                </div>

            })}
        </>
    };

    return (
        <>
            <div className="text-center">
                <h1 className="text-4xl my-5">LỊCH CHIẾU NGÀY {currentDate}</h1>
            </div>
            {card()}
        </>

    )
}
export default Showtime;