import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import TextInput from "@/Components/TextInput";
import PrimaryButton from "@/Components/PrimaryButton";
import InputError from "@/Components/InputError";

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        title: "",
        description: "",
        location: "",
    });

    function submit(e) {
        e.preventDefault();
        post(route("moderator.event.store"));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Create Event
                </h2>
            }
        >
            <Head title="Create Event" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow sm:rounded-lg">
                        <form onSubmit={submit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Name
                                </label>
                                <TextInput
                                    value={data.title}
                                    onChange={(e) =>
                                        setData("title", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    placeholder="Event name"
                                />
                                <InputError
                                    message={errors.title}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Description
                                </label>
                                <textarea
                                    value={data.description}
                                    onChange={(e) =>
                                        setData("description", e.target.value)
                                    }
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                                    rows={4}
                                    placeholder="Short description (optional)"
                                />
                                <InputError
                                    message={errors.description}
                                    className="mt-2"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">
                                    Location
                                </label>
                                <TextInput
                                    value={data.location}
                                    onChange={(e) =>
                                        setData("location", e.target.value)
                                    }
                                    className="mt-1 block w-full"
                                    placeholder="Event location"
                                />
                                <InputError
                                    message={errors.location}
                                    className="mt-2"
                                />
                            </div>

                            <div className="flex items-center gap-3">
                                <PrimaryButton disabled={processing}>
                                    Save
                                </PrimaryButton>
                                <Link
                                    href={route("moderator.event.index")}
                                    className="px-3 py-2 border rounded text-gray-700"
                                >
                                    Cancel
                                </Link>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
