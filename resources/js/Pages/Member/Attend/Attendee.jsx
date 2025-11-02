import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useEffect, useRef, useState } from "react";
import Html5QrcodePlugin from "@/Components/Html5QrcodePlugin";

export default function Dashboard() {
    const qrRegionId = "html5qr-code-full-region";
    const [sending, setSending] = useState(false);
    const [responseMessage, setResponseMessage] = useState(null);
    const [scanData, setScanData] = useState(null); // <-- added to hold attendance data

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

    const stopScan = () => {
        html5QrCode
            .stop()
            .then((ignore) => {
                // QR Code scanning is stopped.
            })
            .catch((err) => {
                // Stop failed, handle it.
            });
    };

    const onNewScanResult = (decodedText /*, decodedResult */) => {
        stopScan();
        sendTokenToController(decodedText);
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
                            <div
                                id={qrRegionId}
                                className="w-full max-w-md border rounded overflow-hidden"
                            />
                            <Html5QrcodePlugin
                                fps={10}
                                qrbox={250}
                                disableFlip={false}
                                qrCodeSuccessCallback={onNewScanResult}
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
