<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth', 'check.permission:member')->group(function () {
    Route::get('members/dashboard', function () {
        return Inertia::render('Members/DashboardMembers');
    })->name('members.dashboard');
});