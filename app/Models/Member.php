<?php

namespace App\Models;

use App\Models\User;
use App\Models\Committee;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Member extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'nim',
        'division',
    ];

    // tambahkan property agar otomatis tersedia di JSON
    protected $appends = ['division_label'];

    public function getDivisionLabelAttribute(): string
    {
        $map = [
            'ph' => 'Pengurus Harian',
            'ekokre' => 'Ekokre',
            'internal' => 'Internal',
            'eksternal' => 'Eksternal',
            'sosmas' => 'Sosmas',
            'kominfo' => 'Kominfo',
        ];

        $key = strtolower($this->attributes['division'] ?? '');

        return $map[$key] ?? (strlen($key) ? ucfirst($key) : '-');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id');
    }

    public function committee(): HasMany
    {
        return $this->hasMany(Committee::class, 'member_id');
    }
}
