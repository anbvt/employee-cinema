import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
// import { QrReader } from "react-qr-reader";

interface IQr {
    data: any,
    setData: any
}


const QrScanComponent = ({ data, setData }: IQr) => {
    const router = useRouter();

    useEffect(() => {
        return () => {
            closeCam();
        }
    }, []);

    const closeCam = async () => {
        // const stream = await navigator.mediaDevices.getUserMedia({
        //     audio: false,
        //     video: true,
        // });
        // stream.getTracks().forEach(function (track) {
        //     track.stop();
        //     track.enabled = false;
        // });
        // window.location.reload();
    };
    return (
        <>
            {/* <QrReader
                onResult={(result, error) => {
                    if (!!result) {
                        setData(result.getText());
                    }

                    if (!!error) {
                        console.info(error);
                    }
                }}
                className="w-full mx-auto"
                constraints={{ facingMode: 'environment' }}
            /> */}
        </>
    )
}
export default QrScanComponent;