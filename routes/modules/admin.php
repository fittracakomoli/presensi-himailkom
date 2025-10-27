<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware('auth', 'check.permission:admin')->group(function () {
    Route::get('admin/dashboard', function () {
        return Inertia::render('Admin/DashboardAdmin');
    })->name('admin.dashboard');
});