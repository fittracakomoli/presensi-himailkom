// ...existing code...
import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";

function AttendanceRow({ a }) {
    const form = useForm({
        status: a.status,
        note: a.note,
    });

    function submit(e) {
        e.preventDefault();
        form.put(`/moderator/attendances/${a.id}`, {
            preserveScroll: true,
        });
    }

    // autosubmit ketika status berubah
    function handleStatusChange(e) {
        form.setData("status", e.target.value);
    }

    function handleStatusKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            const statusVal = e.target.value;
            form.put(`/moderator/attendances/${a.id}`, {
                preserveScroll: true,
                data: {
                    status: statusVal,
                    note: form.data.note,
                },
            });
        }
    }

    // update lokal saat mengetik note
    function handleNoteChange(e) {
        form.setData("note", e.target.value);
    }

    // submit saat tekan Enter di note
    function handleNoteKeyDown(e) {
        if (e.key === "Enter") {
            e.preventDefault();
            const noteVal = e.target.value;
            form.put(`/moderator/attendances/${a.id}`, {
                preserveScroll: true,
                data: {
                    status: form.data.status,
                    note: noteVal,
                },
            });
        }
    }

    return (
        <tr>
            <td className="px-4 py-3 text-sm text-gray-700">
                {a.committee?.member?.name ?? "-"}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
                {a.committee?.sie_label ?? "-"}
            </td>

            {/* Form sekarang berada di dalam satu <td> agar DOM nesting valid */}
            <td className="px-4 py-3 text-sm text-gray-700">
                <form onSubmit={submit} className="flex items-center space-x-2">
                    <select
                        name="status"
                        value={form.data.status}
                        onChange={handleStatusChange}
                        onKeyDown={handleStatusKeyDown}
                        className="rounded border-gray-300"
                    >
                        <option value="present">Hadir</option>
                        <option value="absent">Tidak Hadir</option>
                        <option value="excused">Izin</option>
                    </select>

                    <input
                        name="note"
                        value={form.data.note}
                        onChange={handleNoteChange}
                        onKeyDown={handleNoteKeyDown}
                        className="w-full rounded border-gray-300"
                        placeholder="catatan (opsional) — tekan Enter untuk simpan"
                    />

                    <div className="ms-4">
                        {form.processing ? "Menyimpan..." : ""}
                    </div>
                </form>
            </td>

            <td className="px-4 py-3 text-sm text-gray-700">
                {a.checked_in_at ? a.checked_in_at + " WIB" : "-"}
            </td>
        </tr>
    );
}

export default function Show({ attendance, attendanceDate, token }) {
    // generate QR hanya di client supaya tidak terganggu SSR
    const [qrImageSrc, setQrImageSrc] = useState(null);
    const [qrLink, setQrLink] = useState(null);
    const [showQr, setShowQr] = useState(false); // <-- tombol toggle

    useEffect(() => {
        if (!attendanceDate?.id) {
            setQrImageSrc(null);
            setQrLink(null);
            return;
        }
        const link = token;
        setQrLink(link);
        // generate dataURL image (no external request)
        QRCode.toDataURL(link, { width: 320 })
            .then((dataUrl) => setQrImageSrc(dataUrl))
            .catch(() => {
                // fallback: null or show error state
                setQrImageSrc(null);
            });
    }, [attendanceDate]);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold text-primary">
                    Data Presensi
                </h2>
            }
        >
            <Head
                title={`Presensi ${
                    attendanceDate?.event?.title ?? "Semua Presensi"
                } -
                    ${attendanceDate?.name ?? ""}`}
            />

            <div className="py-6 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="flex items-center justify-end mb-4">
                    {/* Tombol toggle QR */}
                    <button
                        type="button"
                        onClick={() => setShowQr((s) => !s)}
                        className="text-xs items-center rounded-md border border-transparent bg-gray-200 px-4 py-2 font-semibold uppercase tracking-widest text-gray-800 transition duration-150 ease-in-out hover:bg-gray-300 me-2"
                    >
                        {showQr ? "Sembunyikan QR" : "Tampilkan QR"}
                    </button>
                    {/* Tombol export Word */}
                    <a
                        href={route(
                            "moderator.attendance.export",
                            attendanceDate?.id
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs items-center rounded-md border border-transparent bg-primary px-4 py-2 font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-secondary focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-gray-900"
                    >
                        Export Word
                    </a>
                </div>

                {/* QR Presensi (ditampilkan untuk discan oleh anggota) */}
                {showQr ? (
                    <div className="mb-6 bg-white shadow rounded-lg p-4 flex items-start space-x-6">
                        <div>
                            {qrImageSrc ? (
                                <div className="mt-2">
                                    <img
                                        src={qrImageSrc}
                                        alt="QR Presensi"
                                        className="w-full h-full bg-white rounded shadow"
                                    />
                                </div>
                            ) : (
                                <div className="text-sm text-gray-500 mt-2">
                                    Tidak ada data tanggal presensi.
                                </div>
                            )}
                        </div>

                        <div className="text-sm text-gray-600">
                            <div className="py-6">
                                <h2 className="text-2xl font-semibold text-primary">
                                    Presensi{" "}
                                    {attendanceDate?.event?.title ??
                                        "Semua Presensi"}
                                    {" - "}
                                    {attendanceDate?.name ?? ""}
                                </h2>
                                <p className="mt-2 text-base text-gray-500">
                                    {attendanceDate.datetime
                                        ? new Date(
                                              attendanceDate.datetime
                                          ).toLocaleString("id-ID") + " WIB"
                                        : ""}
                                </p>
                            </div>
                            <div>
                                <h4 className="text-base">Petunjuk singkat:</h4>
                                <ul className="list-disc ml-5 mt-2 text-base">
                                    <li>
                                        Kode QR ditampilkan untuk di scan oleh
                                        anggota yang tergabung dalam
                                        kepanitiaan.
                                    </li>
                                    <li>
                                        Anggota login ke dalam akun
                                        masing-masing untuk scan kode QR ini
                                        untuk melakukan presensi.
                                    </li>
                                    <li>
                                        Setelah scan kode QR berhasil status
                                        kehadiran akan otomatis diperbarui
                                        disertai dengan waktu presensi.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="mb-6 bg-white shadow rounded-lg p-4">
                        <h2 className="text-xl font-semibold text-primary">
                            Presensi{" "}
                            {attendanceDate?.event?.title ?? "Semua Presensi"}
                            {" - "}
                            {attendanceDate?.name ?? ""}
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            {attendanceDate.datetime
                                ? new Date(
                                      attendanceDate.datetime
                                  ).toLocaleString("id-ID") + " WIB"
                                : ""}
                        </p>
                    </div>
                )}

                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-primary">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                                    Nama
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                                    Sie
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                                    Status Kehadiran
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-white">
                                    Waktu Presensi
                                </th>
                            </tr>
                        </thead>

                        <tbody className="bg-white divide-y divide-gray-200">
                            {!attendance || attendance.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-4 py-6 text-center text-sm text-gray-500"
                                    >
                                        Belum ada data.
                                    </td>
                                </tr>
                            ) : (
                                attendance.map((a) => (
                                    <AttendanceRow key={a.id} a={a} />
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
// ...existing code...
