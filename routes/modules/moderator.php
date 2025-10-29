<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Moderator\EventController;
use App\Http\Controllers\Moderator\CommitteeController;
use App\Http\Controllers\Moderator\AttendanceController;
use App\Http\Controllers\Moderator\AttendanceDateController;

Route::middleware('auth', 'check.permission:moderator')->group(function () {
    // Dashboard
    Route::get('moderator/dashboard', function () {
        return Inertia::render('Moderator/DashboardModerator');
    })->name('moderator.dashboard');

    // Event Management
    Route::get('moderator/events', [EventController::class, 'index'])->name('moderator.event.index');
    Route::get('moderator/events/create', [EventController::class, 'create'])->name('moderator.event.create');
    Route::post('moderator/events/store', [EventController::class, 'store'])->name('moderator.event.store');
    Route::get('moderator/events/{id}/edit', [EventController::class, 'edit'])->name('moderator.event.edit');
    Route::put('moderator/events/{id}/update', [EventController::class, 'update'])->name('moderator.event.update');
    Route::delete('moderator/events/{id}/delete', [EventController::class, 'destroy'])->name('moderator.event.destroy');

    // Committee Management
    Route::get('moderator/events/{id}/committees', [CommitteeController::class, 'index'])->name('moderator.committee.index');
    Route::post('moderator/events/{id}/committees/store', [CommitteeController::class, 'store'])->name('moderator.committee.store');
    Route::put('moderator/events/{event}/committees/{committee}', [CommitteeController::class, 'update'])->name('moderator.committee.update');
    Route::delete('moderator/events/{id}/committees/{committeeId}', [CommitteeController::class, 'destroy'])->name('moderator.committee.destroy');

    // AttendanceDate Management
    Route::get('moderator/attendances', [AttendanceDateController::class, 'index'])->name('moderator.attendance.index');
    Route::post('moderator/attendances/{event}/store', [AttendanceDateController::class, 'store'])->name('moderator.attendance.store');
    Route::put('moderator/attendances/{event}/{attendance}', [AttendanceDateController::class, 'update'])->name('moderator.attendance.update');
    Route::delete('moderator/attendances/{event}/{attendance}', [AttendanceDateController::class, 'destroy'])->name('moderator.attendance.destroy');

    // export attendance as Word (taruh sebelum show agar tidak tertangkap oleh route show)
    Route::get('moderator/attendances/{attendanceDate}/export', [AttendanceController::class, 'export'])
        ->name('moderator.attendance.export');

    // Attendance Management
    Route::get('moderator/attendances/{attendanceDate}', [AttendanceController::class, 'show'])->name('moderator.attendance.show');

    // update single attendance (status & note)
    Route::put('moderator/attendances/{attendance}', [AttendanceController::class, 'update'])->name('moderator.attendance.update');
});