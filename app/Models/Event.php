<?php

namespace App\Models;

use App\Models\User;
use App\Models\Committee;
use App\Models\AttendanceDate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'datetime',
        'location',
    ];

    protected $dates = [
        'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function committee(): HasMany
    {
        return $this->hasMany(Committee::class, 'event_id');
    }

    public function attendanceDate(): HasMany
    {
        return $this->hasMany(AttendanceDate::class, 'event_id');
    }
}
