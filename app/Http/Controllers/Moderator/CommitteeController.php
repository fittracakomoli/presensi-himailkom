<?php

namespace App\Http\Controllers\Moderator;

use Inertia\Inertia;
use App\Models\Event;
use App\Models\Member;
use App\Models\Committee;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Redirect;

class CommitteeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(string $id)
    {
        $events = Event::where('id', $id)->first();
        $committees = Committee::where('event_id', $id)->with('member')->get();

        $committeeCount = $committees->count();

        $members = Member::orderBy('name')->get(['id', 'name', 'nim', 'division']);

        return Inertia::render('Moderator/Committee/Index', [
            'committees' => $committees,
            'events' => $events,
            'committeeCount' => $committeeCount,
            'members' => $members,
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
            'member_id' => 'required|exists:members,id',
            'sie' => 'required|string|max:100',
        ]);

        $event = Event::findOrFail($eventId);

        // Cegah duplikat
        $exists = Committee::where('event_id', $event->id)
            ->where('member_id', $request->member_id)
            ->exists();

        if ($exists) {
            return Redirect::route('moderator.committee.index', $event->id)
                ->with('error', 'Member sudah terdaftar sebagai panitia untuk event ini.');
        }

        Committee::create([
            'event_id' => $event->id,
            'member_id' => $request->member_id,
            'sie' => $request->sie,
        ]);

        return Redirect::route('moderator.committee.index', $event->id)
            ->with('success', 'Panitia berhasil ditambahkan.');
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
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $eventId, string $committeeId)
    {
        $request->validate([
            'sie' => 'required|string|max:100',
        ]);

        $event = Event::findOrFail($eventId);

        $committee = Committee::where('event_id', $event->id)
            ->where('id', $committeeId)
            ->firstOrFail();

        $committee->sie = $request->input('sie');
        $committee->save();

        return Redirect::route('moderator.committee.index', $event->id)
            ->with('success', 'Sie panitia berhasil diperbarui.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $eventId, string $committeeId)
    {
        $event = Event::findOrFail($eventId);

        $committee = Committee::where('event_id', $event->id)
            ->where('id', $committeeId)
            ->firstOrFail();

        $committee->delete();

        return Redirect::route('moderator.committee.index', $event->id)
            ->with('success', 'Panitia berhasil dihapus.');
    }
}
