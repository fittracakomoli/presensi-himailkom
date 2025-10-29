<?php

namespace App\Http\Controllers\Member;

use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Validation\Rules\Password;
use App\Http\Requests\ProfileUpdateRequest;

class ProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit()
    {
        $user = Auth::user();
        $member = $user->member;

        return Inertia::render('Member/ProfileMember', [
            'user' => $user,
            'member' => $member,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(ProfileUpdateRequest $request): RedirectResponse
    {
        $request->user()->fill($request->validated());
        $request->user()->save();

        return back();
    }

    public function updateMember(Request $request): RedirectResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'member.name' => ['required', 'string', 'max:255'],
            'member.nim' => ['required', 'string', 'max:50'],
            'member.division' => ['required', 'string', 'max:100'],
        ]);

        $memberData = [
            'name' => $validated['member']['name'],
            'nim' => $validated['member']['nim'],
            'division' => $validated['member']['division'],
        ];

        $user->member->update($memberData);

        return back();
    }

    /**
     * Update the user's password.
     */
    public function password(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $request->user()->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
