<?php

namespace App\Models;

use App\Models\Event;
use App\Models\Member;
use App\Models\Attendance;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Committee extends Model
{
    use HasFactory;

    protected $table = 'committees';

    protected $fillable = [
        'member_id',
        'event_id',
        'sie',
    ];

    // tambahkan property agar otomatis tersedia di JSON
    protected $appends = ['sie_label'];

    public function getSieLabelAttribute(): string
    {
        $map = [
            'sc' => 'Steering Committee',
            'ketua' => 'Ketua',
            'sekretaris' => 'Sekretaris',
            'bendahara' => 'Bendahara',
            'humas' => 'Humas',
            'acara' => 'Acara',
            'perkap' => 'Perkap',
            'sponsor' => 'Sponsor',
            'konsumsi' => 'Konsumsi',
            'keamanan' => 'Keamanan',
            'kreatif' => 'Kreatif',
            'pdd'   => 'PDD',
            'ticketing'   => 'Ticketing',
        ];

        $key = strtolower($this->attributes['sie'] ?? '');

        return $map[$key] ?? (strlen($key) ? ucfirst($key) : '-');
    }

    public function member(): BelongsTo
    {
        return $this->belongsTo(Member::class, 'member_id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

    public function attendance(): HasMany
    {
        return $this->hasMany(Attendance::class, 'committee_id');
    }
}
