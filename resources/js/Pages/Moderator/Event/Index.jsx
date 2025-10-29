import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ events }) {
    const items = events;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Events
                </h2>
            }
        >
            <Head title="Events" />

            <div className="py-6">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-end mb-6">
                        <Link
                            href={route("moderator.event.create")}
                            className="text-base flex flex-row gap-2 items-center bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition"
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                height="24px"
                                viewBox="0 -960 960 960"
                                width="24px"
                                fill="#e3e3e3"
                            >
                                <path d="M440-440H200v-80h240v-240h80v240h240v80H520v240h-80v-240Z" />
                            </svg>
                            Tambah Event
                        </Link>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {items.length === 0 ? (
                            <div className="col-span-full">
                                <div className="rounded-lg bg-white p-6 shadow">
                                    <p className="text-sm text-gray-500">
                                        No events found.
                                    </p>
                                </div>
                            </div>
                        ) : (
                            items.map((e) => (
                                <div
                                    key={e.id}
                                    className="rounded-lg bg-white p-6 shadow transition"
                                >
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-lg font-semibold text-gray-900">
                                                {e.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-gray-600">
                                                {e.description
                                                    ? e.description.length > 120
                                                        ? e.description.slice(
                                                              0,
                                                              120
                                                          ) + "..."
                                                        : e.description
                                                    : "No description."}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex gap-8 text-sm text-gray-500">
                                        <div className="flex items-center justify-center">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                className="w-6 h-6 text-blue-600"
                                                viewBox="0 -960 960 960"
                                                fill="currentColor"
                                            >
                                                <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                                            </svg>
                                            <span className="ml-2 text-blue-600 font-medium">
                                                {e.location}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <Link
                                            href={route(
                                                "moderator.committee.index",
                                                e.id
                                            )}
                                            className="text-base bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 transition"
                                        >
                                            Panitia
                                        </Link>
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                href={route(
                                                    "moderator.event.edit",
                                                    e.id
                                                )}
                                                className="text-base border border-blue-600 text-blue-600 px-3 py-1 rounded-lg hover:bg-blue-700 hover:text-white transition"
                                            >
                                                Edit
                                            </Link>
                                            <Link
                                                href={route(
                                                    "moderator.event.destroy",
                                                    e.id
                                                )}
                                                method="delete"
                                                as="button"
                                                onClick={(ev) => {
                                                    if (
                                                        !confirm(
                                                            "Yakin ingin menghapus event ini?"
                                                        )
                                                    ) {
                                                        ev.preventDefault();
                                                    }
                                                }}
                                                className="text-base bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition"
                                            >
                                                Hapus
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
