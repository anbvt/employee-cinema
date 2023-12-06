"use client"
import {useSession} from "next-auth/react";
import {useEffect, useState} from "react";
import {fetchAPI} from "@hook/fetchAPI";
import Image from "next/image";
import {NumberUtils} from "@util/NumberUtils";
import {InputNumber} from "antd";

const ToppingPage = () => {
    const {data: session} = useSession();
    const [topping, setTopping] = useState<any>([]);
    const [totalPrice, setTotalPrice] = useState<any>();
    useEffect(() => {
        fetchAPI.get(`/topping/toppingofbranch?branchid=${session?.user.branchId}`)
            .then((res) => setTopping(res.data))
            .catch((e) => console.log(e))
    }, [session,totalPrice]);

    const onChange = (value: any, id: number, price: number, name: string) => {
        console.log({soluong: value, tob: id, price: price, name: name})
        setTotalPrice(price * value)
    }

    return (
        <div>
            {!session ? <></> :
                <div>
                    <section className="h-screen bg-gray-100 py-5 sm:py-8 ">
                        <div className="mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex items-center justify-center">
                                <h1 className="text-2xl font-semibold text-gray-900">TOPPING</h1>
                            </div>

                            <div className="mx-auto mt-8 max-w-2xl md:mt-12">
                                <div className="bg-white shadow">
                                    <div className="px-4 py-6 sm:px-8 sm:py-10">
                                        <div className="flow-root h-[200px]">
                                            <ul className="-my-8">
                                                {topping && topping.map((s: any, idx: number) => (
                                                        <li className="flex flex-col space-y-3 py-6 text-left sm:flex-row sm:space-x-5 sm:space-y-0"
                                                            key={idx}>
                                                            <div className="shrink-0">
                                                                <Image
                                                                    className="h-24 w-24 max-w-full rounded-lg object-cover"
                                                                    src={`https://zuhot-cinema-images.s3.amazonaws.com/topping/${s.logo}`}
                                                                    alt={'Ảnh topping'} width={120} height={100}/>
                                                            </div>

                                                            <div className="relative flex flex-1 justify-between ">
                                                                <div className="sm:col-gap-5 sm:grid sm:grid-cols-2 items-center">
                                                                    <div className="pr-8 sm:pr-5">
                                                                        <p className="text-base font-semibold text-gray-900">{s.name}</p>
                                                                        <p className="mx-0 mt-1 mb-0 text-sm text-gray-400">Còn {s.quantity}</p>
                                                                    </div>

                                                                    <div
                                                                        className="mt-4 flex items-end justify-between sm:mt-0 sm:items-start sm:justify-end">
                                                                        <p className="shrink-0 w-28 text-base font-semibold text-gray-900 sm:order-2 sm:ml-8 sm:text-right">Giá: {NumberUtils.formatCurrency(s.price)}</p>
                                                                        <div className="sm:order-1">
                                                                            <InputNumber min={0} max={10} defaultValue={0}
                                                                                         onChange={(v) => onChange(v, s.toppingofbranchid, s.price, s.name)}/>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </li>
                                                    )
                                                )}
                                            </ul>
                                        </div>

                                        <div className="mt-6 flex items-center justify-between border-t border-b py-4">
                                            <p className="text-sm font-medium text-gray-900">TỔNG GIÁ</p>
                                            <p className="text-2xl font-semibold text-gray-900">{NumberUtils.formatCurrency(totalPrice || 0)}</p>
                                        </div>

                                        <div className="mt-6 text-center">
                                            <button type="button"
                                                    className="group inline-flex w-full items-center justify-center rounded-md bg-gray-900 px-6 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800">
                                                ĐI TIẾP
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                </div>}
        </div>
    )
}

export default ToppingPage;