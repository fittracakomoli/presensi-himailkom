import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Dashboard() {
    const qrRegionId = "html5qr-code-full-region";
    const scannerRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [lastResult, setLastResult] = useState(null);
    const [cameraList, setCameraList] = useState([]);
    const [selectedCameraId, setSelectedCameraId] = useState(null);
    const [sending, setSending] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    const [scanData, setScanData] = useState(null); // <-- added to hold attendance data

    useEffect(() => {
        return () => {
            if (scannerRef.current) {
                scannerRef.current
                    .stop()
                    .then(() => {
                        scannerRef.current.clear();
                        scannerRef.current = null;
                    })
                    .catch(() => {
                        scannerRef.current = null;
                    });
            }
        };
    }, []);

    const listCameras = () => {
        Html5Qrcode.getCameras()
            .then((cameras) => {
                setCameraList(cameras || []);
                if (cameras && cameras.length > 0 && !selectedCameraId) {
                    setSelectedCameraId(cameras[0].deviceId || cameras[0].id);
                }
            })
            .catch((err) => {
                console.error("Error listing cameras", err);
            });
    };

    // New: kirim token ke controller Laravel
    const sendTokenToController = async (token) => {
        const url = "/member/attend";
        const csrf = document
            .querySelector('meta[name="csrf-token"]')
            ?.getAttribute("content");

        try {
            setSending(true);
            setResponseMessage(null);
            setScanData(null);

            const res = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    "X-CSRF-TOKEN": csrf,
                },
                body: JSON.stringify({ token }),
            });

            const ct = res.headers.get("content-type") || "";

            if (!res.ok) {
                if (ct.includes("application/json")) {
                    const err = await res.json().catch(() => null);
                    setResponseMessage(
                        err?.message ?? `Server error ${res.status}`
                    );
                } else {
                    const txt = await res.text().catch(() => null);
                    setResponseMessage(
                        `Server error ${res.status}: ${txt ?? "no details"}`
                    );
                }
                return;
            }

            if (ct.includes("application/json")) {
                const data = await res.json().catch(() => null);
                setResponseMessage(data?.message ?? "Token terkirim");
                if (data?.data) setScanData(data.data);
            } else {
                // server mengembalikan HTML (Inertia) — tampilkan debug atau informasikan user
                const html = await res.text().catch(() => null);
                console.debug("Non-JSON response from /member/attend:", html);
                setResponseMessage(
                    "Token terkirim (server mengembalikan HTML)."
                );
            }
        } catch (err) {
            console.error("Failed to send token", err);
            setResponseMessage("Gagal mengirim token");
        } finally {
            setSending(false);
        }
    };

    const startScanner = async () => {
        if (scanning) return;

        try {
            const html5QrCode = new Html5Qrcode(qrRegionId);
            scannerRef.current = html5QrCode;

            // pilih cameraId jika tersedia, jika tidak gunakan facingMode fallback
            const cameraId =
                selectedCameraId ||
                (cameraList[0] &&
                    (cameraList[0].deviceId || cameraList[0].id)) ||
                null;

            const cameraArg = cameraId
                ? cameraId
                : { facingMode: "environment" };

            await html5QrCode.start(
                cameraArg, // sekarang selalu ada argumen valid
                { fps: 10, qrbox: 300 },
                (decodedText /*, decodedResult */) => {
                    setLastResult(decodedText);
                    // stop kamera segera agar tidak membaca ulang
                    stopScanner();
                    // kirim token ke controller
                    sendTokenToController(decodedText);
                },
                (errorMessage) => {
                    // optional: console.debug(errorMessage);
                }
            );
            setScanning(true);
        } catch (err) {
            console.error("Failed to start scanner", err);
        }
    };

    const stopScanner = () => {
        if (!scannerRef.current) {
            setScanning(false);
            return;
        }
        scannerRef.current
            .stop()
            .then(() => {
                scannerRef.current.clear();
                scannerRef.current = null;
                setScanning(false);
            })
            .catch((err) => {
                console.error("Failed to stop scanner", err);
                scannerRef.current = null;
                setScanning(false);
            });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-primary">
                    Presensi
                </h2>
            }
        >
            <Head title="Presensi" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900">
                            <div className="mb-2 flex gap-2">
                                <PrimaryButton
                                    type="button"
                                    onClick={() => {
                                        listCameras().then(() =>
                                            startScanner()
                                        );
                                    }}
                                >
                                    Mulai Scan QR
                                </PrimaryButton>

                                <button
                                    type="button"
                                    onClick={stopScanner}
                                    disabled={!scanning}
                                    className="px-3 py-2 bg-gray-600 text-white rounded disabled:opacity-50"
                                >
                                    Stop
                                </button>

                                <PrimaryButton
                                    type="button"
                                    onClick={() => {
                                        listCameras();
                                    }}
                                >
                                    Refresh
                                </PrimaryButton>
                            </div>

                            {cameraList.length > 0 && (
                                <div className="mb-3">
                                    <label className="block text-sm text-gray-700">
                                        Pilih Kamera:
                                    </label>
                                    <select
                                        value={selectedCameraId || ""}
                                        onChange={(e) =>
                                            setSelectedCameraId(e.target.value)
                                        }
                                        className="mt-1 border rounded"
                                    >
                                        {cameraList.map((cam) => (
                                            <option
                                                key={cam.id}
                                                value={cam.deviceId || cam.id}
                                            >
                                                {cam.label ||
                                                    cam.deviceId ||
                                                    cam.id}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div
                                id={qrRegionId}
                                className="w-full max-w-md border rounded overflow-hidden"
                            />

                            {/* tampilkan status pengiriman */}
                            <div className="mt-3">
                                {sending ? (
                                    <div className="text-sm text-blue-600">
                                        Mengirim token...
                                    </div>
                                ) : responseMessage ? (
                                    <div className="text-sm text-green-600">
                                        {responseMessage}
                                    </div>
                                ) : null}
                            </div>

                            {/* tampilkan data attendance yang dikembalikan controller */}
                            {scanData && (
                                <div className="mt-4 p-4 border rounded bg-green-500">
                                    <p className="text-base text-white font-regular">
                                        Presensi atas nama{" "}
                                        <span className="font-bold">
                                            {scanData.committee?.member?.name ??
                                                "Nama"}
                                        </span>{" "}
                                        pada program kerja{" "}
                                        {scanData.attendance_date?.event
                                            ?.title ?? "Acara"}{" "}
                                        -{" "}
                                        {scanData.attendance_date?.name ??
                                            "Tanggal"}{" "}
                                        berhasil dilakukan.
                                    </p>
                                </div>
                            )}

                            <p className="mt-3 text-sm text-gray-500">
                                Catatan: Presensi hanya dapat dilakukan jika
                                kamu tergabung ke dalam kepanitiaan.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
// ...existing code...
