<?php

namespace App\Http\Controllers\Member;

use Inertia\Inertia;
use App\Models\Committee;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Attendance;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;

class AttendController extends Controller
{
    public function index()
    {
        $user = Auth::user();
        $committee = Committee::with('member.user')
            ->whereHas('member', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->get();

        return Inertia::render('Member/Attend/Attendee', [
            'committee' => $committee,
        ]);
    }

    public function attend(Request $request)
    {
        $user = Auth::user();
        $committee = Committee::with('member.user')
            ->whereHas('member', function ($query) use ($user) {
                $query->where('user_id', $user->id);
            })->get();

        try {
            $token = Crypt::decryptString($request->input('token'));
        } catch (\Exception $e) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Kode QR tidak valid'], 422);
            }
            return back()->withErrors(['token' => 'Kode QR tidak valid']);
        }

        $attendance = Attendance::with('committee.member', 'attendanceDate.event')
            ->where('attendance_date_id', $token)
            ->whereHas('committee', function ($query) use ($committee) {
                $query->whereIn('id', $committee->pluck('id'));
            })->first();

        if (!$attendance) {
            if ($request->wantsJson()) {
                return response()->json(['message' => 'Kamu tidak tergabung dalam kepanitiaan'], 404);
            }
            return back()->with('scanError', 'Kamu tidak tergabung dalam kepanitiaan');
        }

        $attendance->status = 'present';
        $attendance->note = 'Presensi via QR Code';
        $attendance->checked_in_at = Carbon::now();
        $attendance->save();

        // Jika request AJAX/JSON, kembalikan JSON (dipakai oleh fetch)
        if ($request->wantsJson()) {
            return response()->json(['message' => 'Berhasil presensi', 'data' => $attendance], 200);
        }

        // Jika bukan AJAX, render ulang halaman dashboard dengan data hasil scan
        return Inertia::render('Member/DashboardMember');
    }
}
