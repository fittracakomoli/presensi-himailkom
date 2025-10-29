import React from "react";
import { Link, useForm } from "@inertiajs/react";

export default function AttendanceRow({ a }) {
    const { data, setData } = useForm({
        id: a.id,
        status: a.status ?? "",
        note: a.note ?? "",
    });

    return (
        <tr>
            <td className="px-4 py-3 text-sm text-gray-700">
                {a.committee?.member?.name ?? "-"}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
                {a.committee?.sie_label ?? "-"}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
                <select
                    value={data.status ?? ""}
                    onChange={(e) => setData("status", e.target.value)}
                    className="rounded border-gray-300"
                >
                    <option value="present">present</option>
                    <option value="absent">absent</option>
                    <option value="excused">excused</option>
                </select>
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
                <input
                    type="text"
                    value={data.note ?? ""}
                    onChange={(e) => setData("note", e.target.value)}
                    className="w-full rounded border-gray-300"
                    placeholder="catatan (opsional)"
                />
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
                {a.checked_in_at
                    ? new Date(a.checked_in_at).toLocaleString()
                    : "-"}
            </td>
            <td className="px-4 py-3 text-sm text-gray-700">
                {/* gunakan a.id agar Ziggy tidak kehilangan parameter */}
                <Link
                    href={route("moderator.attendance.edit", a.id)}
                    as="button"
                    method="put"
                    className="px-3 py-2 border rounded text-gray-700"
                >
                    Simpan
                </Link>
            </td>
        </tr>
    );
}
