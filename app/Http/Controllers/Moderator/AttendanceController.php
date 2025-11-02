<?php

namespace App\Http\Controllers\Moderator;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\Member;
use App\Models\Committee;
use App\Models\Attendance;
use Illuminate\Http\Request;
use App\Models\AttendanceDate;
use PhpOffice\PhpWord\PhpWord;
use Illuminate\Validation\Rule;
use PhpOffice\PhpWord\IOFactory;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Redirect;
use PhpOffice\PhpWord\TemplateProcessor;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = Auth::user();
        $member = Member::with('user')->where('user_id', $user->id)->firstOrFail();
        $attendanceDate = AttendanceDate::with('attendance')
            ->whereHas('attendance.committee', function ($query) use ($member) {
                $query->where('member_id', $member->id);
            })->orderBy('datetime', 'asc')->get();
        
        $events = Event::whereHas('committee', function ($query) use ($member) {
            $query->where('member_id', $member->id);
        })->get();

        return Inertia::render('Member/Event/Index', [
            'attendanceDate' => $attendanceDate,
            'member' => $member,
            'events' => $events,
        ]);
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
    public function show(string $attendanceDateId)
    {
        // load attendances bersama relasi committee
        $attendance = Attendance::with('committee.member')
            ->where('attendance_date_id', $attendanceDateId)
            ->get();

        // juga kirim data attendance date untuk judul / info
        $attendanceDate = AttendanceDate::with('event')->findOrFail($attendanceDateId);

        $token = Crypt::encryptString($attendanceDateId);

        return Inertia::render('Moderator/Attendance/Show', [
            'attendance' => $attendance,
            'attendanceDate' => $attendanceDate,
            'token' => $token,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Request $request, string $attendanceId, string $attendanceDateId)
    {
        // 
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $attendanceId)
    {
        $request->validate([
            'status' => ['required', Rule::in(['present', 'absent', 'excused'])],
            'note' => ['nullable', 'string', 'max:1000'],
        ]);

        $attendance = Attendance::findOrFail($attendanceId);

        if($request->input('status') === 'present') {
            $attendance->checked_in_at = Carbon::now();
        } else {
            $attendance->checked_in_at = null;
        }

        // update hanya status dan note
        $attendance->update($request->only(['status', 'note']));

        return Redirect::back()->with('success', 'Presensi berhasil diperbarui.');
    }

    /**
     * Export attendance list to Word (.docx) with table.
     */
    public function export(string $attendanceDateId)
    {
        if (function_exists('set_time_limit')) {
            set_time_limit(0);
        }

        $attendanceDate = AttendanceDate::with('event')->findOrFail($attendanceDateId);

        $attendances = Attendance::with('committee.member')
            ->where('attendance_date_id', $attendanceDateId)
            ->get();

        // path ke template yang dibuat di langkah sebelumnya
        $templatePath = resource_path('templates/template-presensi.docx');
        if (!file_exists($templatePath)) {
            abort(500, 'Template presensi tidak ditemukan. Buat file: resources/templates/template-presensi.docx');
        }

        $template = new TemplateProcessor($templatePath);

        // header / title
        $template->setValue('event', $attendanceDate->event->title ?? '-');
        $template->setValue('date', $attendanceDate->datetime . ' WIB' ?? '-');
        $template->setValue('location', $attendanceDate->event->location ?? '-');

        $count = $attendances->count();
        if ($count > 0) {
            // clone row berdasarkan placeholder 'no' (atau salah satu placeholder pada baris)
            $template->cloneRow('no', $count);

            $i = 1;
            foreach ($attendances as $a) {
                $template->setValue("no#{$i}", $i);
                $template->setValue("nama#{$i}", $a->committee->member->name ?? '-');
                $template->setValue("sie#{$i}", $a->committee->sie_label ?? '-');
                $template->setValue("status#{$i}", $a->status_label ?? '-');
                $template->setValue("time#{$i}", $a->checked_in_at ? ($a->checked_in_at . ' WIB') : '-');
                $i++;
            }
        } else {
            // tidak ada data — kosongkan placeholder
            $template->setValue('no', '');
        }

        $filename = 'presensi_' . ($attendanceDate->event->title ?: 'event') . '_' . ($attendanceDate->name ?? '') . '_' . now()->format('Ymd_His') . '.docx';

        $tempFile = tempnam(sys_get_temp_dir(), 'phpword') . '.docx';
        $template->saveAs($tempFile);

        return response()->download($tempFile, $filename, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ])->deleteFileAfterSend(true);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $eventId, string $attendanceId)
    {
        // 
    }
}
