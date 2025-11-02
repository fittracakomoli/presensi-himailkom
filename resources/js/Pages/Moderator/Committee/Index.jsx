import React, { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import PrimaryButton from "@/Components/PrimaryButton";

export default function Index({ events, committees, committeeCount, members }) {
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [editingMemberName, setEditingMemberName] = useState("");

    const { data, setData, post, processing, errors, reset } = useForm({
        member_id: "",
        sie: "",
    });

    // form untuk edit sie saja
    const editForm = useForm({
        sie: "",
    });

    const sieOptions = [
        { value: "", label: "-- Pilih Sie --" },
        { value: "sc", label: "Steering Committee" },
        { value: "ketua", label: "Ketua" },
        { value: "sekretaris", label: "Sekretaris" },
        { value: "bendahara", label: "Bendahara" },
        { value: "humas", label: "Humas" },
        { value: "acara", label: "Acara" },
        { value: "perkap", label: "Perkap" },
        { value: "sponsor", label: "Sponsor" },
        { value: "konsumsi", label: "Konsumsi" },
        { value: "keamanan", label: "Keamanan" },
        { value: "kreatif", label: "Kreatif" },
        { value: "pdd", label: "PDD" },
        { value: "ticketing", label: "Ticketing" },
    ];

    function openModal() {
        setShowModal(true);
    }

    function closeModal() {
        setShowModal(false);
        reset();
    }

    function submit(e) {
        e.preventDefault();
        // assumes route moderator.committee.store exists and expects event id as parameter
        post(route("moderator.committee.store", events.id), {
            onSuccess: () => {
                closeModal();
            },
        });
    }

    // Edit modal handlers
    function openEditModal(committee) {
        setEditingId(committee.id);
        editForm.setData("sie", committee.sie ?? "");
        setEditingMemberName(committee.member?.name ?? ""); // set name to display (disabled)
        setShowEditModal(true);
    }

    function closeEditModal() {
        setEditingId(null);
        editForm.reset("sie");
        setEditingMemberName("");
        setShowEditModal(false);
    }

    function submitEdit(e) {
        e.preventDefault();
        if (!editingId) return;
        editForm.put(
            route("moderator.committee.update", [events.id, editingId]),
            {
                onSuccess: () => closeEditModal(),
            }
        );
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-primary">
                    Susunan Kepanitiaan
                </h2>
            }
        >
            <Head title={`Panitia ${events.title}`} />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 flex gap-6 items-center justify-between shadow sm:rounded-lg mb-6">
                        <div>
                            <h3 className="text-3xl font-semibold text-primary">
                                {events?.title}
                            </h3>
                            <p className="text-gray-500 text-sm mt-2">
                                {events.description}
                            </p>
                        </div>
                        <div className="flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-secondary"
                                viewBox="0 -960 960 960"
                                fill="currentColor"
                            >
                                <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                            </svg>
                            <span className="ml-2 text-secondary font-medium">
                                {events.location}
                            </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-4">
                        <div className="font-medium text-lg text-gray-700">
                            {committeeCount} Panitia
                        </div>
                        <PrimaryButton type="button" onClick={openModal}>
                            Tambah Panitia
                        </PrimaryButton>
                    </div>

                    {/* Table */}
                    <div className="bg-white shadow sm:rounded-lg overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-primary">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        No
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Nama
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        NIM
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Divisi
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                        Sie
                                    </th>
                                    <th className="px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {committees.length === 0 ? (
                                    <tr>
                                        <td
                                            colSpan="5"
                                            className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 text-center"
                                        >
                                            Belum ada panitia untuk event ini.
                                        </td>
                                    </tr>
                                ) : (
                                    committees.map((c, idx) => (
                                        <tr key={c.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {idx + 1}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {c.member?.name ??
                                                    "Unknown Member"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {c.member?.nim ?? "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {c.member?.division_label ??
                                                    "-"}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                {c.sie_label}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                                                <div className="inline-flex gap-2">
                                                    <PrimaryButton
                                                        type="button"
                                                        onClick={() =>
                                                            openEditModal(c)
                                                        }
                                                    >
                                                        Edit
                                                    </PrimaryButton>

                                                    <Link
                                                        href={route(
                                                            "moderator.committee.destroy",
                                                            [events.id, c.id]
                                                        )}
                                                        method="delete"
                                                        as="button"
                                                        onClick={(ev) => {
                                                            if (
                                                                !confirm(
                                                                    "Yakin ingin menghapus panitia ini?"
                                                                )
                                                            ) {
                                                                ev.preventDefault();
                                                            }
                                                        }}
                                                        className="text-xs items-center rounded-md border border-transparent bg-red-600 px-4 py-2 font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-400 focus:bg-red-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-gray-900"
                                                    >
                                                        Hapus
                                                    </Link>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            {/* Modal - simple Tailwind modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center">
                    <div
                        className="fixed inset-0 bg-black/50"
                        onClick={closeModal}
                    />
                    <div className="relative z-10 w-full max-w-md bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-medium text-primary mb-4">
                            Tambah Panitia
                        </h3>

                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Member
                                </label>
                                <select
                                    value={data.member_id}
                                    onChange={(e) =>
                                        setData("member_id", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    <option value="">-- Pilih Member --</option>
                                    {members.map((m) => (
                                        <option key={m.id} value={m.id}>
                                            {m.name} - {m.division_label}
                                        </option>
                                    ))}
                                </select>
                                {errors.member_id && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.member_id}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Sie
                                </label>
                                <select
                                    value={data.sie}
                                    onChange={(e) =>
                                        setData("sie", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    {sieOptions.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                {errors.sie && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {errors.sie}
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-end gap-2 mt-2">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="text-xs items-center rounded-md border border-gray-600 px-4 py-2 font-semibold uppercase tracking-widest text-gray-600 transition duration-150 ease-in-out hover:bg-gray-400 focus:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-gray-900"
                                >
                                    Batal
                                </button>
                                <PrimaryButton
                                    type="submit"
                                    disabled={processing}
                                >
                                    Tambah
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
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Edit Sie Panitia
                        </h3>

                        <form onSubmit={submitEdit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Nama Member
                                </label>
                                <input
                                    type="text"
                                    value={editingMemberName}
                                    disabled
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm bg-gray-100 text-gray-700"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Sie
                                </label>
                                <select
                                    value={editForm.data.sie}
                                    onChange={(e) =>
                                        editForm.setData("sie", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    required
                                >
                                    {sieOptions.map((opt) => (
                                        <option
                                            key={opt.value}
                                            value={opt.value}
                                        >
                                            {opt.label}
                                        </option>
                                    ))}
                                </select>
                                {editForm.errors.sie && (
                                    <div className="text-red-600 text-sm mt-1">
                                        {editForm.errors.sie}
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
