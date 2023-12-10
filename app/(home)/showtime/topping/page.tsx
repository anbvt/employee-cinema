"use client"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchAPI } from "@hook/fetchAPI";
import { NumberUtils } from "@util/NumberUtils";
import { Card, InputNumber, Select } from "antd";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

const ToppingPage = () => {
    const { data: session } = useSession();
    const [topping, setTopping] = useState<any>([]);
    const [selectedTopping, setSelectedTopping] = useState<any>([]);
    const searchParams = useSearchParams();
    const showtimeId = searchParams.get("id");
    const staffId = searchParams.get("staffId");

    useEffect(() => {
        fetchAPI.get(`/topping/toppingofbranch?branchid=${session?.user.branchId}`)
            .then((res) => setTopping(res.data))
            .catch((e) => console.log(e))
    }, [session]);

    const onChange = (value: any, id: number, price: number, name: string, toppingofbranchid: any) => {
        const existingIndex = selectedTopping.findIndex((item: any) => item.toppingOfBranchId === toppingofbranchid);
        setSelectedTopping((prevToppings: any[]) => {
            const updatedToppings = prevToppings.map((item, index) =>
                index === existingIndex ? { ...item, quantity: value, total: price * value } : item
            );
            return existingIndex !== -1
                ? value === 0 ? updatedToppings.filter(item => item.quantity !== 0) : updatedToppings
                : value !== 0 ? [...prevToppings, { toppinngOfBranchId: toppingofbranchid, priceWhenBuy: price, quantity: value, name: name, total: price * value }] : prevToppings;
        });
    }

    useEffect(() => {
        localStorage.setItem(`topping_${showtimeId}_${staffId}`, JSON.stringify(selectedTopping));
    }, [selectedTopping, showtimeId, staffId])
    console.log(selectedTopping);

    const tp = topping && topping.map((s: any, idx: number) => {
        return <Card className="flex w-full" key={idx}>
            <div className="grid grid-cols-2 gap-x-8">
                <div className="">
                    <img className="w-28 h-28" src={`https://zuhot-cinema-images.s3.amazonaws.com/topping/${s.logo}`} alt="" />
                </div>
                <div className="">
                    <div className="items-center">
                        <div className="pr-8 sm:pr-5">
                            <p className="text-base font-semibold text-gray-900">{s.name}</p>
                            <p className="mx-0 mt-1 mb-0 text-sm text-gray-400">Còn {s.quantity}</p>

                            <p className="">Giá: {NumberUtils.formatCurrency(s.price)}</p>
                            <div className="sm:order-1">
                                <InputNumber min={0} max={s.quantity} defaultValue={0}
                                    onChange={(v) => onChange(v, s.toppingofbranchid, s.price, s.name, s.toppingofbranchid)} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    });

    const infor = () => {
        const a = JSON.parse(localStorage.getItem(`showtime_${showtimeId}`) ?? "null");
        const totalPrice = selectedTopping.map((s: any) => s.total).reduce((a: any, b: any) => a + b, 0)
        const totalTopping = selectedTopping.map((s: any, index: number) => {
            return <span key={index}>{s.name}{index < selectedTopping.length - 1 && ', '}</span>
        })
        return <div className="p-5" >
            <img src={`https://zuhot-cinema-images.s3.amazonaws.com/poster-movie/${a.movieId}.png`} alt="" />
            <h2 className="text-center text-base  font-medium my-2 text-red-600">{a.movieName}</h2>
            <div className="border-t-4 border-b-4 p-2 border-red-950 ">
                <h3 className="text-base text-black font-medium mb-1">Tổng thức ăn: {totalTopping ? "Chưa chọn" : totalTopping}</h3>
                <h3 className="text-base text-black font-medium">Tổng tiền: {NumberUtils.formatCurrency(totalPrice || 0)}</h3>
            </div>
            <Link href={{
                pathname: `/showtime/payment`,
                query: { id: showtimeId, staffId: session?.user.id }
            }}>
                <button className="relative w-full inline-flex items-center justify-center p-0.5 mb-1 mt-3 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-600 to-red-400 group-hover:from-red-600 group-hover:to-red-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                    <span className="relative w-full py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xl">
                        Đi tiếp
                    </span>
                </button>
            </Link>
        </div>
    }

    return (
        <div>
            {!session ? <></> :
                <section className="h-screen w-full py-5 sm:py-8 ">
                    <div className="flex items-center justify-center">
                        <h1 className="text-center text-4xl font-medium my-5">TOPPING</h1>
                    </div>
                    <div className="flex">
                        <div className="w-3/4 p-4">
                            <div className="grid grid-cols-2 gap-4 relative overflow-x-auto shadow-md sm:rounded-lg p-3">
                                {tp}
                            </div>
                        </div>
                        <div className="w-1/4 p-4">
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <div className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <h1 className="text-center text-2xl font-medium text-black">Thông tin chi tiết</h1>
                                    {infor()}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>}
        </div>
    )
}

export default ToppingPage;