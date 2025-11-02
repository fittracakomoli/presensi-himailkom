// ...existing code...
import { Html5QrcodeScanner } from "html5-qrcode";
import { useEffect } from "react";

const qrcodeRegionId = "html5qr-code-full-region";

// Creates the configuration object for Html5QrcodeScanner.
const createConfig = (props) => {
    let config = {};
    if (props.fps) {
        config.fps = props.fps;
    }
    if (props.qrbox) {
        config.qrbox = props.qrbox;
    }
    if (props.aspectRatio) {
        config.aspectRatio = props.aspectRatio;
    }
    if (props.disableFlip !== undefined) {
        config.disableFlip = props.disableFlip;
    }
    return config;
};

const Html5QrcodePlugin = (props) => {
    useEffect(() => {
        // when component mounts
        const config = createConfig(props);
        const verbose = props.verbose === true;
        // Success callback is required.
        if (!props.qrCodeSuccessCallback) {
            throw "qrCodeSuccessCallback is required callback.";
        }
        const html5QrcodeScanner = new Html5QrcodeScanner(
            qrcodeRegionId,
            config,
            verbose
        );

        // wrap success callback: stop/clear scanner first, then call user callback
        const wrappedSuccessCallback = async (decodedText, decodedResult) => {
            try {
                // clear() akan menghentikan video kamera dan membersihkan UI
                await html5QrcodeScanner.clear();
            } catch (err) {
                console.error(
                    "Failed to clear html5QrcodeScanner after success:",
                    err
                );
            }
            try {
                props.qrCodeSuccessCallback(decodedText, decodedResult);
            } catch (cbErr) {
                console.error("qrCodeSuccessCallback threw:", cbErr);
            }
        };

        html5QrcodeScanner.render(
            wrappedSuccessCallback,
            props.qrCodeErrorCallback
        );

        // cleanup function when component will unmount
        return () => {
            html5QrcodeScanner.clear().catch((error) => {
                console.error(
                    "Failed to clear html5QrcodeScanner on unmount. ",
                    error
                );
            });
        };
    }, []); // keep mount-only

    return <div id={qrcodeRegionId} />;
};

export default Html5QrcodePlugin;
// ...existing code...
