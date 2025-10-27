<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth', 'check.permission:moderator')->group(function () {
    Route::get('moderator/dashboard', function () {
        return Inertia::render('Moderator/DashboardModerator');
    })->name('moderator.dashboard');
});