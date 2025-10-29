import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import SelectInput from "@/Components/SelectInput";
import DangerButton from "@/Components/DangerButton";
import Modal from "@/Components/Modal";
import SecondaryButton from "@/Components/SecondaryButton";
import { Transition } from "@headlessui/react";
import { useRef, useState } from "react";

export default function ProfileMember({ user, member }) {
    const divisions = [
        { value: "ph", label: "Pengurus Harian" },
        { value: "ekokre", label: "Ekokre" },
        { value: "internal", label: "Internal" },
        { value: "eksternal", label: "Eksternal" },
        { value: "sosmas", label: "Sosmas" },
        { value: "kominfo", label: "Kominfo" },
    ];

    const {
        data,
        setData,
        patch,
        put,
        reset,
        errors,
        processing,
        recentlySuccessful,
    } = useForm({
        name: user.name,
        email: user.email,
        current_password: "",
        password: "",
        password_confirmation: "",
        member: {
            name: member.name,
            nim: member.nim,
            division: member.division,
        },
    });

    const submit = (e) => {
        e.preventDefault();
        patch(route("member.profile.update"));
    };

    const selectRef = useRef();

    const submitProfile = (e) => {
        e.preventDefault();
        patch(route("member.member.update"));
    };

    const passwordInput = useRef();
    const currentPasswordInput = useRef();

    const updatePassword = (e) => {
        e.preventDefault();

        put(route("member.password.update"), {
            preserveScroll: true,
            onSuccess: () => reset(),
            onError: (errors) => {
                if (errors.password) {
                    reset("password", "password_confirmation");
                    passwordInput.current?.focus();
                }
                if (errors.current_password) {
                    reset("current_password");
                    currentPasswordInput.current?.focus();
                }
            },
        });
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Profile
                </h2>
            }
        >
            <Head title="Profile" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl space-y-6 sm:px-6 lg:px-8">
                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Credential Information
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Credential information for you logged in and
                                    display name.
                                </p>
                            </header>

                            <form onSubmit={submit} className="mt-6 space-y-6">
                                <div>
                                    <InputLabel htmlFor="name" value="Name" />
                                    <TextInput
                                        id="name"
                                        className="mt-1 block w-full"
                                        value={data.name}
                                        onChange={(e) =>
                                            setData("name", e.target.value)
                                        }
                                        required
                                        isFocused
                                        autoComplete="name"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="email" value="Email" />
                                    <TextInput
                                        id="email"
                                        type="email"
                                        className="mt-1 block w-full"
                                        value={data.email}
                                        onChange={(e) =>
                                            setData("email", e.target.value)
                                        }
                                        required
                                        autoComplete="username"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Save
                                    </PrimaryButton>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-gray-600">
                                            Saved.
                                        </p>
                                    </Transition>
                                </div>
                            </form>
                        </section>
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Profile Information
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Your personal profile information for
                                    attendance.
                                </p>
                            </header>

                            <form
                                onSubmit={submitProfile}
                                className="mt-6 space-y-6"
                            >
                                <div>
                                    <InputLabel
                                        htmlFor="member-name"
                                        value="Name"
                                    />
                                    <TextInput
                                        id="member-name"
                                        className="mt-1 block w-full"
                                        value={data.member.name}
                                        onChange={(e) =>
                                            setData(
                                                "member.name",
                                                e.target.value
                                            )
                                        }
                                        required
                                        isFocused
                                        autoComplete="name"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.name}
                                    />
                                </div>

                                <div>
                                    <InputLabel htmlFor="nim" value="NIM" />
                                    <TextInput
                                        id="nim"
                                        className="mt-1 block w-full"
                                        value={data.member.nim}
                                        onChange={(e) =>
                                            setData("nim", e.target.value)
                                        }
                                        required
                                        isFocused
                                        autoComplete="nim"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.nim}
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="division"
                                        value="Division"
                                    />
                                    <SelectInput
                                        id="division"
                                        ref={selectRef}
                                        value={data.member.division}
                                        onChange={(e) =>
                                            setData("member", {
                                                ...data.member,
                                                division: e.target.value,
                                            })
                                        }
                                        options={divisions}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError
                                        className="mt-2"
                                        message={errors.email}
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Save
                                    </PrimaryButton>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-gray-600">
                                            Saved.
                                        </p>
                                    </Transition>
                                </div>
                            </form>
                        </section>
                    </div>

                    <div className="bg-white p-4 shadow sm:rounded-lg sm:p-8">
                        <section>
                            <header>
                                <h2 className="text-lg font-medium text-gray-900">
                                    Update Password
                                </h2>
                                <p className="mt-1 text-sm text-gray-600">
                                    Ensure your account is using a long, random
                                    password to stay secure.
                                </p>
                            </header>

                            <form
                                onSubmit={updatePassword}
                                className="mt-6 space-y-6"
                            >
                                <div>
                                    <InputLabel
                                        htmlFor="current_password"
                                        value="Current Password"
                                    />
                                    <TextInput
                                        id="current_password"
                                        ref={currentPasswordInput}
                                        value={data.current_password}
                                        onChange={(e) =>
                                            setData(
                                                "current_password",
                                                e.target.value
                                            )
                                        }
                                        type="password"
                                        className="mt-1 block w-full"
                                        autoComplete="current-password"
                                    />
                                    <InputError
                                        message={errors.current_password}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password"
                                        value="New Password"
                                    />
                                    <TextInput
                                        id="password"
                                        ref={passwordInput}
                                        value={data.password}
                                        onChange={(e) =>
                                            setData("password", e.target.value)
                                        }
                                        type="password"
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                    />
                                    <InputError
                                        message={errors.password}
                                        className="mt-2"
                                    />
                                </div>

                                <div>
                                    <InputLabel
                                        htmlFor="password_confirmation"
                                        value="Confirm Password"
                                    />
                                    <TextInput
                                        id="password_confirmation"
                                        value={data.password_confirmation}
                                        onChange={(e) =>
                                            setData(
                                                "password_confirmation",
                                                e.target.value
                                            )
                                        }
                                        type="password"
                                        className="mt-1 block w-full"
                                        autoComplete="new-password"
                                    />
                                    <InputError
                                        message={errors.password_confirmation}
                                        className="mt-2"
                                    />
                                </div>

                                <div className="flex items-center gap-4">
                                    <PrimaryButton disabled={processing}>
                                        Save
                                    </PrimaryButton>

                                    <Transition
                                        show={recentlySuccessful}
                                        enter="transition ease-in-out"
                                        enterFrom="opacity-0"
                                        leave="transition ease-in-out"
                                        leaveTo="opacity-0"
                                    >
                                        <p className="text-sm text-gray-600">
                                            Saved.
                                        </p>
                                    </Transition>
                                </div>
                            </form>
                        </section>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
