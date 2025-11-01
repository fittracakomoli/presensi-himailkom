<?php

namespace App\Http\Controllers\Moderator;

use Carbon\Carbon;
use Inertia\Inertia;
use App\Models\Event;
use App\Models\Committee;
use App\Models\Attendance;
use Illuminate\Http\Request;
use App\Models\AttendanceDate;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Collection;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;

class AttendanceDateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::all();
        $attendanceDates = AttendanceDate::all();

        return Inertia::render('Moderator/Attendance/Index', [
            'events' => $events,
            'attendanceDates' => $attendanceDates,
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
    public function store(Request $request, string $eventId)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'datetime' => ['required', 'date'],
        ]);

        $event = Event::findOrFail($eventId);

        DB::transaction(function () use ($request, $event) {
            // create attendance date
            $attendanceDate = AttendanceDate::create([
                'event_id' => $event->id,
                'name' => $request->input('name'),
                'datetime' => $request->input('datetime'),
            ]);

            // load all committees for this event
            $committee = $event->committee()->get(['id']);

            if ($committee->isNotEmpty()) {
                $rows = $committee->map(function ($c) use ($attendanceDate) {
                    return [
                        'attendance_date_id' => $attendanceDate->id,
                        'committee_id' => $c->id,
                        'created_at' => Carbon::now(),
                        'updated_at' => Carbon::now(),
                    ];
                })->toArray();

                // bulk insert to attendances table (adjust table name/columns if different)
                // DB::table('attendances')->insert($rows);
                Attendance::insert($rows);
            }
        });

        return Redirect::route('moderator.attendance.index')
            ->with('success', 'Attendance date and attendance rows added.');
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
    public function edit(Request $request, string $attendanceId, string $attendanceDateId)
    {
        // 
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $eventId, string $attendanceId)
    {
        $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'date' => ['required', 'date'],
        ]);

        $event = Event::findOrFail($eventId);

        $attendance = AttendanceDate::where('id', $attendanceId)
            ->where('event_id', $event->id)
            ->firstOrFail();

        $attendance->name = $request->input('name');
        $attendance->date = $request->input('date');
        $attendance->save();

        return Redirect::route('moderator.attendance.index')
            ->with('success', 'Attendance date updated.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $eventId, string $attendanceId)
    {
        $event = Event::findOrFail($eventId);

        $attendance = AttendanceDate::where('id', $attendanceId)
            ->where('event_id', $event->id)
            ->firstOrFail();

        $attendance->delete();

        return Redirect::route('moderator.attendance.index')
            ->with('success', 'Attendance date deleted.');
    }
}
