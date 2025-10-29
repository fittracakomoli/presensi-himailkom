<?php

namespace App\Http\Controllers\Moderator;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Event;
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
use Illuminate\Support\Facades\Redirect;

class AttendanceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $attendanceDateId = $request->query('attendance_date_id');
        if (! $attendanceDateId) {
            return Redirect::back()->with('error', 'Tanggal presensi tidak diberikan.');
        }

        $attendanceDate = AttendanceDate::with('event')->findOrFail($attendanceDateId);

        // Ambil daftar committee milik member untuk event ini
        $committees = Committee::where('event_id', $attendanceDate->event_id)
            ->where('member_id', Auth::id())
            ->get();

        return Inertia::render('Member/Attend/Attend', [
            'attendanceDate' => $attendanceDate,
            'committees' => $committees,
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
        $data = $request->validate([
            'attendance_date_id' => ['required', 'integer'],
            'committee_id' => ['required', 'integer'],
        ]);

        $attendanceDate = AttendanceDate::findOrFail($data['attendance_date_id']);
        $committee = Committee::findOrFail($data['committee_id']);

        // Validasi kepemilikan & event cocok
        if ($committee->member_id !== Auth::id() || $committee->event_id !== $attendanceDate->event_id) {
            if ($request->wantsJson()) {
                return response()->json(['success' => false, 'message' => 'Committee tidak valid untuk akun ini atau event.'], 403);
            }
            return Redirect::back()->with('error', 'Committee tidak valid untuk akun ini atau event.');
        }

        // Cari atau buat attendance record (idempotent)
        $attendance = Attendance::where('attendance_date_id', $attendanceDate->id)
            ->where('committee_id', $committee->id)
            ->first();

        // Jika sudah tercatat hadir, kembalikan sukses tapi beri tahu sudah terdaftar
        if ($attendance && $attendance->status === 'present') {
            $msg = 'Anda sudah tercatat hadir.';
            if ($request->wantsJson()) {
                return response()->json(['success' => true, 'message' => $msg, 'attendance' => $attendance], 200);
            }
            return Redirect::route('member.attend.index', ['attendance_date_id' => $attendanceDate->id])
                ->with('success', $msg);
        }

        // Buat atau update record
        if (! $attendance) {
            $attendance = new Attendance();
            $attendance->attendance_date_id = $attendanceDate->id;
            $attendance->committee_id = $committee->id;
        }

        $attendance->status = 'present';
        // set checked_in_at hanya jika belum ada untuk mempertahankan waktu awal check-in
        if (empty($attendance->checked_in_at)) {
            $attendance->checked_in_at = Carbon::now();
        }
        $attendance->save();

        $msg = 'Presensi berhasil dicatat. Terima kasih.';

        if ($request->wantsJson()) {
            return response()->json(['success' => true, 'message' => $msg, 'attendance' => $attendance], 200);
        }

        return Redirect::route('member.attend.index', ['attendance_date_id' => $attendanceDate->id])
            ->with('success', $msg);
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

        return Inertia::render('Moderator/Attendance/Show', [
            'attendance' => $attendance,
            'attendanceDate' => $attendanceDate,
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
        // pastikan tidak timeout untuk export besar
        if (function_exists('set_time_limit')) {
            set_time_limit(0);
        }

        $attendanceDate = AttendanceDate::with('event')->findOrFail($attendanceDateId);

        $attendances = Attendance::with('committee.member')
            ->where('attendance_date_id', $attendanceDateId)
            ->get();

        $phpWord = new PhpWord();
        $section = $phpWord->addSection();
        $section->addTitle("Presensi - " . ($attendanceDate->name ?? $attendanceDate->date), 1);
        $section->addText("Program Kerja: " . ($attendanceDate->event->title ?? '-'));
        $section->addTextBreak(1);

        $tableStyle = [
            'borderSize' => 6,
            'borderColor' => '999999',
            'cellMargin' => 80,
        ];
        $firstRowStyle = ['bgColor' => 'f2f2f2'];
        $phpWord->addTableStyle('PresensiTable', $tableStyle, $firstRowStyle);

        $table = $section->addTable('PresensiTable');
        // header
        $table->addRow();
        $table->addCell(3000)->addText('Nama');
        $table->addCell(2000)->addText('Sie');
        $table->addCell(1500)->addText('Status');
        $table->addCell(4000)->addText('Note');
        $table->addCell(2500)->addText('Waktu Presensi');

        foreach ($attendances as $a) {
            $table->addRow();
            $table->addCell(3000)->addText($a->committee->member->name ?? '-');
            $table->addCell(2000)->addText($a->committee->sie_label ?? '-');
            $table->addCell(1500)->addText($a->status_label ?? '-');
            $table->addCell(4000)->addText($a->note ?? '-');
            $table->addCell(2500)->addText($a->checked_in_at ? ($a->checked_in_at . ' WIB') : '-');
        }

        $filename = 'presensi_' . ($attendanceDate->event->title) . '_' . ($attendanceDate->name ?? '') . '_' . now()->format('Ymd_His') . '.docx';

        // simpan ke temp file lalu download (lebih stabil dibanding streaming langsung)
        $tempFile = tempnam(sys_get_temp_dir(), 'phpword') . '.docx';
        $writer = IOFactory::createWriter($phpWord, 'Word2007');
        $writer->save($tempFile);

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
