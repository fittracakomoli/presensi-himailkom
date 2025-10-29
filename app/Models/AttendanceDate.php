<?php

namespace App\Models;

use App\Models\Event;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class AttendanceDate extends Model
{
    use HasFactory;

    protected $table = 'attendance_dates';

    protected $fillable = [
        'event_id',
        'name',
        'date',
    ];

    protected $dates = [
        'date',
    ];

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function attendance(): HasMany
    {
        return $this->hasMany(Attendance::class, 'attendance_date_id');
    }
}
