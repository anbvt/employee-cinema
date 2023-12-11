import { QrcodeSuccessCallback, QrcodeErrorCallback, Html5QrcodeScanner } from "html5-qrcode";
import { Html5QrcodeScannerConfig } from "html5-qrcode/esm/html5-qrcode-scanner";
import { useRef, useEffect } from "react";

const scanRegionId = "html5qr-code-full-region";

type scanProps = Html5QrcodeScannerConfig & {
    qrCodeSuccessCallback: QrcodeSuccessCallback;
    verbose?: boolean;
    qrCodeErrorCallback?: QrcodeErrorCallback;
};

const QrScanComponent = (props: scanProps) => {
    const { qrCodeSuccessCallback, qrCodeErrorCallback, verbose } = props;
    const ref = useRef<Html5QrcodeScanner | null>(null);

    useEffect(() => {
        // Use reference to avoid recreating the object when double rendered in Dev Strict Mode.
        if (ref.current === null) {
            ref.current = new Html5QrcodeScanner(scanRegionId, { ...props }, verbose);
        }
        const html5QrcodeScanner = ref.current;

        // Timeout to allow the clean-up function to finish in case of double render.
        setTimeout(() => {
            const container = document.getElementById(scanRegionId);
            if (html5QrcodeScanner && container?.innerHTML == "") {
                html5QrcodeScanner.render(qrCodeSuccessCallback, qrCodeErrorCallback);
            }
        }, 0);

        return () => {
            if (html5QrcodeScanner) {
                html5QrcodeScanner.clear();
            }
        };
        // Just once when the component mounts.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return <div id={scanRegionId} />;
};
export default QrScanComponent;