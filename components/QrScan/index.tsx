import { Html5QrcodeScanner } from "html5-qrcode"
import { useEffect, useRef, useState } from "react";


interface IQr {
    data: any,
    setData: any
}


const QrScanComponent = ({ data, setData }: IQr) => {
    const [scanResult, setScanResult] = useState(null);
    useEffect(() => {
        const scanner = new Html5QrcodeScanner('reader', {
            qrbox: {
                width: 250,
                height: 250,
            },
            fps: 5,
        }, true);

        scanner.render(success, error);

        function success(result: any) {
            scanner.clear();
            setScanResult(result);
            setData(result);
        }
        function error(err: any) {
            console.warn(err);

        }
    }, []);


    return (<div>
        <h1>qr</h1>
        {scanResult ? <div>success: {scanResult}</div> : <div id="reader"></div>}
    </div>
    )
}
export default QrScanComponent;