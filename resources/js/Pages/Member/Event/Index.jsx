import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ attendanceDate, member }) {
    return (
        <AuthenticatedLayout
            header={<h2 className="text-xl font-semibold">Program Kerja</h2>}
        >
            <Head title="Presensi Saya" />

            <div className="py-8 max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-4">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium">
                            {member?.name ?? "Member"}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Kamu tergabung dalam program kerja berikut.
                        </p>
                    </div>

                    {!attendanceDate || attendanceDate.length === 0 ? (
                        <div className="text-sm text-gray-500">
                            Belum diplotting dalam program kerja.
                        </div>
                    ) : (
                        <ul className="space-y-3">
                            {attendanceDate.map((d) => (
                                <li
                                    key={d.id}
                                    className="border border-gray-200 rounded p-3 flex justify-between items-center"
                                >
                                    <div>
                                        <div className="font-semibold">
                                            {d.event?.title ?? "-"} -{" "}
                                            {d.name ?? "-"}
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            Tanggal:{" "}
                                            {d.datetime
                                                ? new Date(
                                                      d.datetime
                                                  ).toLocaleString()
                                                : "-"}
                                        </div>
                                        {d.sie_label && (
                                            <div className="text-sm text-gray-500">
                                                Sie: {d.sie_label}
                                            </div>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
