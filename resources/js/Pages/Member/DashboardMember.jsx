import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import PrimaryButton from "@/Components/PrimaryButton";
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
                <h2 className="text-xl font-semibold leading-tight text-primary">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="bg-white shadow-sm sm:rounded-lg">
                        <div className="p-6 bg-white border-b border-gray-200">
                            <PrimaryButton>
                                <Link href={route("member.attend.index")}>
                                    Silakan Presensi
                                </Link>
                            </PrimaryButton>
                            <p className="mt-3 text-sm text-gray-500">
                                Selamat datang di Sistem Presensi HIMA ILKOM.
                                Klik silakan presensi untuk presensi kehadiran
                                panitia program kerja.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
