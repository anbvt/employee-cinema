"use client"
import { fetchAPI } from "@hook/fetchAPI";
import { NumberUtils } from "@util/NumberUtils";
import { useSession } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { format } from "date-fns";
import { InputNumber, notification } from "antd";
import { useReactToPrint } from 'react-to-print';
import ComponentToPrint from "./ComponentToPrint";
import { NotificationPlacement } from "antd/es/notification/interface";

const Pay = () => {
    const [showtime, setShowtime] = useState<any>({});
    const [api, contextHolder] = notification.useNotification();
    const { data: session } = useSession();
    const searchParams = useSearchParams();
    const showtimeId = searchParams.get("id");
    const staffId = searchParams.get("staffId");
    const [price, setPrice] = useState(0);
    const Context = React.createContext({ name: 'Default' });
    const componentRef = useRef(null as any);

    const dataTopping = JSON.parse(localStorage.getItem(`topping_${showtimeId}_${staffId}`) ?? "null");
    const dataSeatLocal = JSON.parse(localStorage.getItem(`seat_${showtimeId}_${staffId}`) ?? "null");
    const dataSeat = dataSeatLocal.map((s: any) => { return { ...s, vat: s.totalPrice * 0.05 } })
    const totalName = (data: any[]) => data.map((s: any, index: number) => {
        return <span key={index}>{s.name}{index < data.length - 1 && ', '}</span>
    })
    const total = (data: any[], key: any) => { return data.map((s: any) => s[key]).reduce((a: any, b: any) => a + b, 0) };


    useEffect(() => {
        fetchAPI.get(`/showtime/${showtimeId}`).then((s: any) => {
            setShowtime(s.data);
        });
    }, [showtimeId, session]);

    const openNotification = (placement: NotificationPlacement, api: any, message: any) => {
        api({
            message: 'message',
            description: <Context.Consumer>{({ name }) => message + "!"}</Context.Consumer>,
            placement,
        });
    };

    const totalBill = total(dataSeat, 'totalPrice') + total(dataTopping, 'total') + total(dataSeat, 'vat');
    const infor = () => {
        return <div className="p-5">
            <div className="grid grid-cols-2 gap-4">
                <div className="">
                    <img src={`https://zuhot-cinema-images.s3.amazonaws.com/poster-movie/${showtime.movieId}.png`} alt="" />
                </div>
                <div>
                    <h2 className="text-center text-base  font-medium my-2 text-red-600">{showtime.movieName}</h2>
                    <h2 className="text-center text-base  font-medium my-2 text-red-600">({showtime.languageName}-{showtime.dimensionName})</h2>
                    <div className="border-t-4 border-b-4 px-2 py-4 border-red-950 ">
                        <div className="text-sm">
                            <h3 className=" text-black font-medium mb-1">Chi nhánh {showtime.branchName}</h3>
                            <h3 className=" text-black font-medium mb-1">Địa chỉ: {showtime.branchAddress}</h3>
                            <h3 className=" text-black font-medium mb-1">Phòng: {showtime.roomName}</h3>
                        </div>
                    </div>
                    <div className="border-t-4 border-b-4 px-2 py-4 border-red-950 ">
                        <div className="text-sm">
                            <div className="grid grid-cols-2 gap-4">
                                <h3 className=" text-black font-medium mb-1">Ngày chiếu: {showtime.showDate ? format(new Date(showtime.showDate), 'dd/MM/yyyy') : ''} </h3>
                                <h3 className=" text-black font-medium mb-1">Giờ bắt đầu: {showtime.startTime}</h3>
                            </div>
                            <h3 className=" text-black font-medium mb-1">Tổng ghế: {totalName(dataSeat)}</h3>
                            <h3 className=" text-black font-medium mb-1">Tổng tiền ghế: {NumberUtils.formatCurrency(total(dataSeat, 'totalPrice') || 0)}</h3>
                            {dataTopping.length <= 0 ? <></> :
                                <div>
                                    <h3 className=" text-black font-medium mb-1">Topping: {totalName(dataTopping)}</h3>
                                    <h3 className=" text-black font-medium mb-1">Tổng tiền topping: {NumberUtils.formatCurrency(total(dataTopping, 'total') || 0)}</h3>
                                </div>
                            }
                        </div>
                    </div>
                    <div className="border-t-4 border-b-4 px-2 py-4 border-red-950 ">
                        <div className="text-sm">
                            <h3 className=" text-black font-medium mb-1">Vat: {NumberUtils.formatCurrency(total(dataSeat, 'vat') || 0)}</h3>
                            <h3 className=" text-black font-medium mb-1">Tổng: {NumberUtils.formatCurrency(totalBill || 0)}</h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    }

    const bill = () => {
        const tickets = dataSeat.map((s: any) => { return { ...s, vat: 0.05, showtimeId: showtimeId } });
        const bill = {
            exportStatus: 1,
            totalPrice: totalBill,
            customerId: 1,
            tickets: tickets
        }
        fetchAPI.post("/bill/ticket", bill).then(response => {
            fetchAPI.post("/bill/topping", { billId: response.data, toppingDetails: dataTopping }).then(response => {
                openNotification('topRight', api.success, 'Thành công');
            }).catch(error => {
                openNotification('topRight', api.error, 'Thất bại');
            });
        }).catch(error => {
            openNotification('topRight', api.error, 'Thất bại');
        });
    }

    const payment = () => {
        return <div className="p-5">
            <p className="text-lg font-medium mb-2 mt-1">Nhập số tiền </p>
            <InputNumber
                formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                className="w-full"
                onChange={(value: number | any) => {
                    setPrice(value === null ? 0 : value - totalBill);
                }}
            />
            {price < 0 ? <div>
                <p className="mt-3 mb-2 text-base">Tiền thiếu: {NumberUtils.formatCurrency(price)}</p>
            </div> :
                <div>
                    <p className="mt-3 mb-2 text-base">Tiền thừa: {NumberUtils.formatCurrency(price || 0)}</p>
                </div>
            }
            <button onClick={() => { bill(), handlePrint() }} className="relative w-full inline-flex items-center justify-center p-0.5 mb-1 mt-3 me-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-red-600 to-red-400 group-hover:from-red-600 group-hover:to-red-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800">
                <span className="relative w-full py-1 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0 text-xl">
                    Xuất hóa đơn
                </span>
            </button>
        </div >
    }

    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });

    return <div>
        {!session ? <></> :
            <section>
                <div className="w-full">
                    <h1 className="text-center text-4xl font-medium my-5">THANH TOÁN</h1>
                </div>
                <div className="flex">
                    <div className="w-2/3 p-4">
                        <ComponentToPrint ref={componentRef}>
                            <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                                <div className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                                    <h1 className="text-center text-2xl font-medium text-black">Hóa đơn</h1>
                                    {infor()}
                                </div>
                            </div>
                        </ComponentToPrint>
                    </div>
                    <div className="w-1/3 p-4">
                        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                            <div className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">

                                <h1 className="text-center text-2xl font-medium text-black">Thanh toán</h1>
                                {payment()}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        }
        {contextHolder}
    </div>
}
export default Pay;