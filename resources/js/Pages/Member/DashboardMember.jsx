import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link } from "@inertiajs/react";
import { useEffect } from "react";

export default function Dashboard() {
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get("reload") === "1") {
            // hapus query param agar tidak reload terus-menerus
            const cleanUrl = window.location.pathname + window.location.hash;
            window.history.replaceState({}, document.title, cleanUrl);
            // reload sekali
            window.location.reload();
        }
    }, []);

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <p className="mb-4">
                                Selamat datang, kamu berhasil login sebagai
                                anggota!
                            </p>
                            <Link
                                href="/member/attend"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                            >
                                Silakan Presensi
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
