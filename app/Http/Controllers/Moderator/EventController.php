<?php

namespace App\Http\Controllers\Moderator;

use Inertia\Inertia;
use App\Models\Event;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $events = Event::all();

        return Inertia::render('Moderator/Event/Index', [
            'events' => $events,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Moderator/Event/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = Auth::user();

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
        ]);

       Event::create([
            'user_id' => $user->id,
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'location' => $validatedData['location'],
        ]);

        return redirect()->route('moderator.event.index')->with('success', 'Event created successfully.');

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
        $event = Event::findOrFail($id);

        return Inertia::render('Moderator/Event/Edit', [
            'event' => $event,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $event = Event::findOrFail($id);

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'location' => 'required|string|max:255',
        ]);

        $event->update([
            'title' => $validatedData['title'],
            'description' => $validatedData['description'],
            'location' => $validatedData['location'],
        ]);

        return redirect()->route('moderator.event.index')->with('success', 'Event updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $event = Event::findOrFail($id);
        $event->delete();

        return redirect()->route('moderator.event.index')->with('success', 'Event deleted.');
    }
}
