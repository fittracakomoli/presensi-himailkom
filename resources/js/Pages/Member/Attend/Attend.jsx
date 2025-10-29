import React, { useEffect, useRef, useState } from "react";
import { Head, usePage } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Html5Qrcode } from "html5-qrcode";

export default function Attend({ attendanceDate, committees }) {
    const { props } = usePage();
    const flash = props?.flash || {};

    const form = useForm({
        attendance_date_id: attendanceDate?.id ?? "",
        committee_id: committees && committees[0] ? committees[0].id : "",
    });

    const qrRegionId = "qr-reader";
    const html5QrcodeRef = useRef(null);
    const [scanning, setScanning] = useState(false);
    const [message, setMessage] = useState("");
    const [selectedCommittee, setSelectedCommittee] = useState(
        form.data.committee_id
    );
    const [scannedAttendanceId, setScannedAttendanceId] = useState(null);

    useEffect(() => {
        // reset messages when attendanceDate changes
        setMessage("");
        setScannedAttendanceId(null);
        setSelectedCommittee(form.data.committee_id ?? "");
    }, [attendanceDate]);

    useEffect(() => {
        return () => {
            // cleanup on unmount
            stopScanner();
        };
    }, []);

    function startScanner() {
        if (scanning) return;
        setMessage("Mencari QR... izinkan akses kamera jika diminta.");
        const config = { fps: 10, qrbox: 250 };
        const constraints = { facingMode: "environment" };

        try {
            const html5Qrcode = new Html5Qrcode(qrRegionId);
            html5QrcodeRef.current = html5Qrcode;
            html5Qrcode
                .start({ facingMode: "environment" }, config, qrCodeSuccess)
                .then(() => {
                    setScanning(true);
                })
                .catch((err) => {
                    console.error(err);
                    setMessage(
                        "Gagal membuka kamera: " + (err?.message || err)
                    );
                });
        } catch (e) {
            console.error(e);
            setMessage("Browser tidak mendukung pemindaian QR ini.");
        }
    }

    function stopScanner() {
        const inst = html5QrcodeRef.current;
        if (inst) {
            inst.stop()
                .catch(() => {
                    /* ignore */
                })
                .finally(() => {
                    try {
                        inst.clear();
                    } catch {}
                    html5QrcodeRef.current = null;
                    setScanning(false);
                });
        } else {
            setScanning(false);
        }
    }

    async function qrCodeSuccess(decodedText, decodedResult) {
        // berhenti sementara untuk menghindari banyak callback
        stopScanner();

        // validasi isi QR: expect URL with attendance_date_id param
        try {
            const url = new URL(decodedText);
            const attendance_date_id =
                url.searchParams.get("attendance_date_id");
            if (!attendance_date_id) {
                setMessage(
                    "QR tidak valid (tidak mengandung attendance_date_id)."
                );
                return;
            }

            // optionally require match dengan attendanceDate yang terbuka
            if (
                String(attendanceDate?.id) &&
                String(attendanceDate.id) !== String(attendance_date_id)
            ) {
                setMessage(
                    "QR untuk tanggal presensi berbeda. Pastikan memindai QR yang sesuai."
                );
                return;
            }

            setScannedAttendanceId(attendance_date_id);
            setMessage("QR terdeteksi. Menyiapkan presensi...");

            // jika user cuma punya 1 committee, auto-submit
            if (!committees || committees.length === 0) {
                setMessage("Anda tidak terdaftar pada committee acara ini.");
                return;
            }

            if (committees.length === 1) {
                await submitAttendance(attendance_date_id, committees[0].id);
            } else {
                // kalau banyak, minta pilih committee lalu submit setelah konfirmasi
                setMessage(
                    "Pilih committee untuk mencatat presensi lalu tekan Konfirmasi."
                );
                // set default selected
                setSelectedCommittee(
                    form.data.committee_id || committees[0].id
                );
            }
        } catch (e) {
            console.error(e);
            setMessage("QR tidak valid atau bukan URL.");
        }
    }

    async function submitAttendance(attendance_date_id, committee_id) {
        form.setData("attendance_date_id", attendance_date_id);
        form.setData("committee_id", committee_id);
        form.post("/member/attend", {
            preserveScroll: true,
            onSuccess: () => {
                setMessage("Presensi berhasil dicatat. Terima kasih.");
            },
            onError: (errors) => {
                console.error(errors);
                setMessage("Gagal mencatat presensi.");
            },
        });
    }

    function handleConfirmMultiple(e) {
        e.preventDefault();
        if (!scannedAttendanceId) {
            setMessage("Belum ada QR yang dipindai.");
            return;
        }
        if (!selectedCommittee) {
            setMessage("Pilih committee terlebih dahulu.");
            return;
        }
        submitAttendance(scannedAttendanceId, selectedCommittee);
    }

    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Presensi Anggota</h2>}
        >
            <Head title="Presensi Anggota" />

            <div className="py-8 max-w-3xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="font-medium">
                        Presensi untuk: {attendanceDate?.event?.title ?? "-"}
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Tanggal:{" "}
                        {attendanceDate?.name ?? attendanceDate?.date ?? "-"}
                    </p>

                    {flash.success && (
                        <div className="mb-4 text-green-700 bg-green-100 p-2 rounded">
                            {flash.success}
                        </div>
                    )}
                    {flash.error && (
                        <div className="mb-4 text-red-700 bg-red-100 p-2 rounded">
                            {flash.error}
                        </div>
                    )}

                    <div className="mb-4">
                        <div className="mb-2 text-sm text-gray-700">
                            Pemindai QR Presensi
                        </div>

                        <div
                            id={qrRegionId}
                            className="w-full h-[320px] bg-black/5 rounded flex items-center justify-center"
                        >
                            {!scanning && (
                                <div className="text-sm text-gray-500">
                                    Tekan "Buka Kamera" untuk mulai memindai.
                                </div>
                            )}
                        </div>

                        <div className="mt-3 flex items-center space-x-2">
                            <button
                                type="button"
                                onClick={startScanner}
                                className="px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                disabled={scanning}
                            >
                                Buka Kamera
                            </button>
                            <button
                                type="button"
                                onClick={stopScanner}
                                className="px-3 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400"
                                disabled={!scanning}
                            >
                                Tutup Kamera
                            </button>
                        </div>

                        <div className="mt-3 text-sm text-gray-700">
                            {message}
                        </div>
                    </div>

                    {committees &&
                        committees.length > 1 &&
                        scannedAttendanceId && (
                            <form
                                onSubmit={handleConfirmMultiple}
                                className="space-y-3"
                            >
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">
                                        Pilih Committee
                                    </label>
                                    <select
                                        value={selectedCommittee}
                                        onChange={(e) =>
                                            setSelectedCommittee(e.target.value)
                                        }
                                        className="mt-1 block w-full rounded border-gray-300"
                                    >
                                        {committees.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.sie_label ??
                                                    `Committee #${c.id}`}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="flex items-center space-x-2">
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                                        disabled={form.processing}
                                    >
                                        {form.processing
                                            ? "Mencatat..."
                                            : "Konfirmasi Presensi"}
                                    </button>

                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-200 rounded"
                                        onClick={() => {
                                            setScannedAttendanceId(null);
                                            setMessage("");
                                            startScanner();
                                        }}
                                    >
                                        Scan Ulang
                                    </button>
                                </div>
                            </form>
                        )}

                    {committees && committees.length === 1 && (
                        <div className="mt-4 text-sm text-gray-600">
                            Jika Anda memiliki satu committee, cukup scan QR;
                            presensi akan otomatis tercatat.
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
