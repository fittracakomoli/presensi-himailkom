<?php


use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Member\AttendController;
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

    // Halaman yang dibuka dari QR: /member/event?attendance_date_id=...
    Route::get('member/event', [AttendanceController::class, 'index'])->name('member.event.index');
    Route::get('member/attend', [AttendController::class, 'index'])->name('member.attend.index');
    Route::post('member/attend', [AttendController::class, 'attend'])->name('member.attend.store');
});