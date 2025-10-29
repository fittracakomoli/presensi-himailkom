<?php


use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Member\ProfileController;
use App\Http\Controllers\Moderator\AttendanceController;

Route::middleware('auth', 'check.permission:member')->group(function () {
    Route::get('member/dashboard', function () {
        return Inertia::render('Member/DashboardMember');
    })->name('member.dashboard');

    Route::get('member/profile', [ProfileController::class, 'edit'])->name('member.profile.edit');
    Route::patch('member/profile/update', [ProfileController::class, 'update'])->name('member.profile.update');
    Route::patch('member/member/update', [ProfileController::class, 'updateMember'])->name('member.member.update');
    Route::put('member/password/update', [ProfileController::class, 'password'])->name('member.password.update');

    // Halaman yang dibuka dari QR: /member/attend?attendance_date_id=...
    Route::get('member/attend', [AttendanceController::class, 'index'])->name('member.attend.index');
    // Submit kehadiran
    Route::post('member/attend', [AttendanceController::class, 'store'])->name('member.attend.store');
});