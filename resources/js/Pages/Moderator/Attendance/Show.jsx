// ...existing code...
import React, { useEffect, useState } from "react";
import QRCode from "qrcode";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { useForm } from "@inertiajs/react";

function AttendanceRow({ a }) {
    const form = useForm({
        status: a.status ?? "absent",
        note: a.note ?? "",
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
                        className="w-48 rounded border-gray-300"
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

export default function Show({ attendance, attendanceDate }) {
    // generate QR hanya di client supaya tidak terganggu SSR
    const [qrImageSrc, setQrImageSrc] = useState(null);
    const [qrLink, setQrLink] = useState(null);

    useEffect(() => {
        if (!attendanceDate?.id) {
            setQrImageSrc(null);
            setQrLink(null);
            return;
        }
        const baseUrl = window.location.origin;
        const link = `${baseUrl}/member/attend?attendance_date_id=${attendanceDate.id}`;
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
                <h2 className="text-xl font-semibold">
                    Presensi {attendanceDate?.event?.title ?? "Semua Presensi"}
                    {" - "}
                    {attendanceDate?.name ?? ""}
                </h2>
            }
        >
            <Head title="Semua Presensi" />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="flex items-center justify-end mb-4">
                    {/* Tombol export Word */}
                    <a
                        href={`/moderator/attendances/${attendanceDate?.id}/export`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                    >
                        Export Word
                    </a>
                </div>

                {/* QR Presensi (ditampilkan untuk discan oleh anggota) */}
                <div className="mb-6 bg-white shadow rounded-lg p-4 flex items-center space-x-6">
                    <div>
                        <h3 className="font-medium text-sm">
                            QR Presensi (scan oleh anggota)
                        </h3>
                        {qrImageSrc ? (
                            <div className="mt-2">
                                <img
                                    src={qrImageSrc}
                                    alt="QR Presensi"
                                    className="w-40 h-40 bg-white rounded shadow"
                                />
                                <div className="text-xs text-gray-500 mt-1 break-words w-80">
                                    {qrLink}
                                </div>
                            </div>
                        ) : (
                            <div className="text-sm text-gray-500 mt-2">
                                Tidak ada data tanggal presensi.
                            </div>
                        )}
                    </div>

                    <div className="text-sm text-gray-600">
                        Petunjuk singkat:
                        <ul className="list-disc ml-5 mt-2">
                            <li>
                                Tunjukkan QR ini ke anggota untuk dipindai dari
                                halaman anggota.
                            </li>
                            <li>
                                QR berisi link presensi untuk tanggal ini;
                                anggota akan mengirimkan informasi committee_id
                                saat melakukan scan dari halaman anggota.
                            </li>
                            <li>
                                Pemetaan committee_id vs attendance akan
                                dilakukan di endpoint anggota nanti.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                    Nama
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                    Sie
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
                                    Status / Note / Aksi
                                </th>
                                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">
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
