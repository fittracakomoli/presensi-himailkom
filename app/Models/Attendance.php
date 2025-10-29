<?php

namespace App\Models;

use App\Models\Committee;
use App\Models\AttendanceDate;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Attendance extends Model
{
    use HasFactory;

    protected $table = 'attendances';

    protected $fillable = [
        'committee_id',
        'attendance_date_id',
        'checked_in_at',
        'status',
        'note',
    ];

    protected $dates = [
        'checked_in_at',
    ];

    protected $appends = ['status_label'];

    public function getStatusLabelAttribute(): string
    {
        $map = [
            'present' => 'Hadir',
            'absent' => 'Tidak Hadir',
            'excused' => 'Izin',
        ];

        $key = strtolower($this->attributes['status'] ?? '');

        return $map[$key] ?? (strlen($key) ? ucfirst($key) : '-');
    }

    public function committee(): BelongsTo
    {
        return $this->belongsTo(Committee::class, 'committee_id');
    }

    public function attendanceDate(): BelongsTo
    {
        return $this->belongsTo(AttendanceDate::class, 'attendance_date_id');
    }
}
