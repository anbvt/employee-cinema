"use client"
import { DescriptionComponent, QrScanComponent } from "@components";
import { fetchAPI } from "@hook/fetchAPI";
import { set } from "date-fns";
import { QrcodeErrorCallback, QrcodeSuccessCallback } from "html5-qrcode";
import { Result } from "postcss";
import { useEffect, useState } from "react";

const ScanPage = () => {
    const [data, setData] = useState("");
    const [dataBill, setDataBill] = useState("");

    const fetchData = async () => {
        const { data: result } = await fetchAPI.get("/bill/getByQR/" + data);
        setDataBill(result);
    }
    useEffect(() => {
        fetchData();
    }, [data])

    const handleQrCodeSuccess: QrcodeSuccessCallback = (result) => {
        console.log('QR Code Scanned Successfully:', result);
        setData(result);
        // Xử lý dữ liệu mã QR thành công ở đây
    };

    // Hàm xử lý khi gặp lỗi
    const handleQrCodeError: QrcodeErrorCallback = (error) => {
        console.error('QR Code Scanning Error:', error);
        // Xử lý lỗi quét mã QR ở đây
    };

    return (
        <div className="w-full">
            <h2 className="my-6 text-5xl font-bold tracking-tight text-gray-900 dark:text-white text-center">Quét QR</h2>
            <div className="grid grid-cols-3 gap-4">
                <div className="block w-full p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">
                    <h1 className="mb-5 text-3xl font-bold tracking-tight text-gray-900 dark:text-white text-center">Màn hình quét</h1>
                    <QrScanComponent
                        qrCodeSuccessCallback={handleQrCodeSuccess}
                        qrCodeErrorCallback={handleQrCodeError} fps={2}                    /* Các props khác của QrScanComponent (nếu có) */
                    />
                </div>
                <span className="col-span-2"><DescriptionComponent title="Thông tin vé" data={dataBill} /></span>
            </div>
        </div>
    )
}
export default ScanPage;