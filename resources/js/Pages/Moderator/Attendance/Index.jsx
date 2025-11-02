import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Index({ events, attendanceDates }) {
    const [showModal, setShowModal] = useState(false);
    const [openEventId, setOpenEventId] = useState(null);

    const [showEditModal, setShowEditModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        datetime: "",
    });

    const editForm = useForm({
        name: "",
        datetime: "",
    });

    function openModal(eventId) {
        setOpenEventId(eventId);
        setShowModal(true);
        reset();
    }

    function closeModal() {
        setOpenEventId(null);
        setShowModal(false);
        reset();
    }

    function submit(e) {
        e.preventDefault();
        if (!openEventId) return;
        post(route("moderator.attendance.store", openEventId), {
            onSuccess: () => {
                closeModal();
            },
        });
    }

    // open edit modal for a specific attendance record
    function openEditModal(eventId, attendanceDates) {
        setOpenEventId(eventId);
        setEditingId(attendanceDates.id);
        editForm.setData("name", attendanceDates.name || "");
        editForm.setData(
            "datetime",
            attendanceDates.datetime
                ? attendanceDates.datetime.split(" ")[1]
                : ""
        ); // ensure HH:MM
        setShowEditModal(true);
    }

    function closeEditModal() {
        setEditingId(null);
        setOpenEventId(null);
        editForm.reset();
        setShowEditModal(false);
    }

    function submitEdit(e) {
        e.preventDefault();
        if (!openEventId || !editingId) return;
        editForm.put(
            route("moderator.attendance.update", [openEventId, editingId]),
            {
                onSuccess: () => closeEditModal(),
            }
        );
    }

    // helper: get attendance list for an event
    function getAttendanceListForEvent(ev) {
        if (Array.isArray(attendanceDates) && attendanceDates.length > 0) {
            return attendanceDates.filter(
                (ad) => String(ad.event_id) === String(ev.id)
            );
        }
        if (Array.isArray(ev.attendanceDates)) return ev.attendanceDates;
        return [];
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-primary">
                    Attendance Dates
                </h2>
            }
        >
            <Head title="Event Attendance Dates" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="grid gap-6">
                        {!events || events.length === 0 ? (
                            <div className="rounded-lg bg-white p-6 shadow">
                                <p className="text-sm text-gray-500">
                                    No events available.
                                </p>
                            </div>
                        ) : (
                            events.map((ev) => {
                                const list = getAttendanceListForEvent(ev);
                                return (
                                    <div
                                        key={ev.id}
                                        className="rounded-lg bg-white p-6 shadow"
                                    >
                                        <div className="flex justify-between items-center">
                                            <div>
                                                <h3 className="text-lg font-semibold text-primary">
                                                    {ev.title}
                                                </h3>
                                                <div className="text-sm text-gray-500">
                                                    {ev.location ?? "-"}
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-2">
                                                <PrimaryButton
                                                    type="button"
                                                    onClick={() =>
                                                        openModal(ev.id)
                                                    }
                                                >
                                                    + Tambah Presensi
                                                </PrimaryButton>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                Daftar Presensi
                                            </h4>

                                            {list.length === 0 ? (
                                                <div className="text-sm text-gray-500">
                                                    Tidak ada presensi.
                                                </div>
                                            ) : (
                                                <ul className="space-y-2">
                                                    {list.map((ad) => (
                                                        <li
                                                            key={ad.id}
                                                            className="flex items-center justify-between bg-gray-50 p-3 rounded"
                                                        >
                                                            <div>
                                                                <div className="text-sm font-medium text-primary">
                                                                    {ad.name ??
                                                                        "-"}
                                                                </div>
                                                                <div className="text-xs text-gray-500">
                                                                    {ad.datetime
                                                                        ? new Date(
                                                                              ad.datetime
                                                                          ).toLocaleString(
                                                                              "id-ID"
                                                                          )
                                                                        : "-"}
                                                                </div>
                                                            </div>
                                                            <div className="flex items-center gap-2">
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        openEditModal(
                                                                            ev.id,
                                                                            ad
                                                                        )
                                                                    }
                                                                    className="text-xs items-center rounded-md border border-primary px-4 py-2 font-semibold uppercase tracking-widest text-primary transition duration-150 ease-in-out hover:bg-secondary focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-gray-900"
                                                                >
                                                                    Edit
                                                                </button>
                                                                <Link
                                                                    href={route(
                                                                        "moderator.attendance.destroy",
                                                                        [
                                                                            ev.id,
                                                                            ad.id,
                                                                        ]
                                                                    )}
                                                                    method="delete"
                                                                    as="button"
                                                                    onClick={(
                                                                        e
                                                                    ) => {
                                                                        if (
                                                                            !confirm(
                                                                                "Yakin ingin menghapus attendance date ini?"
                                                                            )
                                                                        ) {
                                                                            e.preventDefault();
                                                                        }
                                                                    }}
                                                                    className="text-xs items-center rounded-md border border-transparent bg-red-600 px-4 py-2 font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-400 focus:bg-red-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-gray-900"
                                                                >
                                                                    Hapus
                                                                </Link>
                                                                <Link
                                                                    href={route(
                                                                        "moderator.attendance.show",
                                                                        ad.id
                                                                    )}
                                                                    className="text-xs items-center rounded-md border border-transparent bg-primary px-4 py-2 font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-secondary focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-gray-900"
                                                                >
                                                                    Lihat
                                                                    Presensi
                                                                </Link>
                                                            </div>
                                                        </li>
                                                    ))}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={closeModal}
                    />
                    <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-medium text-primary mb-4">
                            Tambah Presensi
                        </h3>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Keterangan
                                </label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) =>
                                        setData("name", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    placeholder="e.g. Hari ke 1 / Sesi 1"
                                    required
                                />
                                {errors.name && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.name}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tanggal Presensi
                                </label>
                                <input
                                    type="datetime-local"
                                    value={data.datetime}
                                    onChange={(e) =>
                                        setData("datetime", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {errors.datetime && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.datetime}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="text-xs items-center rounded-md border border-gray-600 px-4 py-2 font-semibold uppercase tracking-widest text-gray-600 transition duration-150 ease-in-out hover:bg-gray-400 focus:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-gray-900"
                                >
                                    Cancel
                                </button>
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                >
                                    Simpan
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={closeEditModal}
                    />
                    <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-medium text-primary mb-4">
                            Edit Presensi
                        </h3>

                        <form onSubmit={submitEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Keterangan
                                </label>
                                <input
                                    type="text"
                                    value={editForm.data.name}
                                    onChange={(e) =>
                                        editForm.setData("name", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {editForm.errors.name && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {editForm.errors.name}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Tanggal Presensi
                                </label>
                                <input
                                    type="datetime-local"
                                    value={editForm.data.datetime}
                                    onChange={(e) =>
                                        editForm.setData(
                                            "datetime",
                                            e.target.value
                                        )
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                />
                                {editForm.errors.datetime && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {editForm.errors.datetime}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={closeEditModal}
                                    className="text-xs items-center rounded-md border border-gray-600 px-4 py-2 font-semibold uppercase tracking-widest text-gray-600 transition duration-150 ease-in-out hover:bg-gray-400 focus:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-gray-900"
                                >
                                    Batal
                                </button>
                                <PrimaryButton
                                    type="submit"
                                    disabled={editForm.processing}
                                >
                                    Simpan
                                </PrimaryButton>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AuthenticatedLayout>
    );
}
