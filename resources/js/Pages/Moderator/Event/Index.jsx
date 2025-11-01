import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ events }) {
    const items = events;

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-primary">
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
                            className="flex flex-row gap-2 text-xs items-center rounded-md border border-transparent bg-primary px-4 py-2 font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-secondary focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-gray-900"
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
                                            <h3 className="text-lg font-semibold text-primary">
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
                                                className="w-6 h-6 text-secondary"
                                                viewBox="0 -960 960 960"
                                                fill="currentColor"
                                            >
                                                <path d="M480-480q33 0 56.5-23.5T560-560q0-33-23.5-56.5T480-640q-33 0-56.5 23.5T400-560q0 33 23.5 56.5T480-480Zm0 294q122-112 181-203.5T720-552q0-109-69.5-178.5T480-800q-101 0-170.5 69.5T240-552q0 71 59 162.5T480-186Zm0 106Q319-217 239.5-334.5T160-552q0-150 96.5-239T480-880q127 0 223.5 89T800-552q0 100-79.5 217.5T480-80Zm0-480Z" />
                                            </svg>
                                            <span className="ml-2 text-secondary font-medium">
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
                                            className="text-xs items-center rounded-md border border-transparent bg-primary px-4 py-2 font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-secondary focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-gray-900"
                                        >
                                            Panitia
                                        </Link>
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                href={route(
                                                    "moderator.event.edit",
                                                    e.id
                                                )}
                                                className="text-xs items-center rounded-md border border-primary px-4 py-2 font-semibold uppercase tracking-widest text-primary transition duration-150 ease-in-out hover:bg-secondary focus:bg-secondary focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-gray-900"
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
                                                className="text-xs items-center rounded-md border border-transparent bg-red-600 px-4 py-2 font-semibold uppercase tracking-widest text-white transition duration-150 ease-in-out hover:bg-red-400 focus:bg-red-400 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 active:bg-gray-900"
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
