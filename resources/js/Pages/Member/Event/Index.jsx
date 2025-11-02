import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";

export default function Index({ attendanceDate, member, events }) {
    // helper: get attendance list for an event
    function getAttendanceListForEvent(ev) {
        if (Array.isArray(attendanceDate) && attendanceDate.length > 0) {
            return attendanceDate.filter(
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
                    Program Kerja
                </h2>
            }
        >
            <Head title="Presensi Saya" />

            <div className="py-8 max-w-7xl mx-auto px-6 lg:px-8">
                <div className="bg-white shadow rounded-lg p-4">
                    <div className="mb-4">
                        <h3 className="text-lg font-medium text-primary">
                            {member?.name ?? "Member"}
                        </h3>
                        <p className="text-sm text-gray-500">
                            Kamu tergabung dalam program kerja berikut.
                        </p>
                    </div>

                    {!events || events.length === 0 ? (
                        <div className="rounded-lg bg-white p-4 shadow">
                            <p className="text-sm text-gray-500">
                                Kamu belum di plotting ke program kerja.
                            </p>
                        </div>
                    ) : (
                        events.map((ev) => {
                            const list = getAttendanceListForEvent(ev);
                            return (
                                <div
                                    key={ev.id}
                                    className="rounded-lg bg-white p-4 shadow mb-4"
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
                                    </div>

                                    <div className="mt-4">
                                        {list.length === 0 ? (
                                            <div className="text-sm text-gray-500">
                                                Belum ada presensi.
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
                                                                {ad.name ?? "-"}
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
        </AuthenticatedLayout>
    );
}
