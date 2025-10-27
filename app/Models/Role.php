<?php

namespace App\Models;

use App\Models\User;
use App\Models\Permission;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Role extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'description',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    /** Users yang memiliki role ini */
    public function users(): HasMany
    {
        return $this->hasMany(User::class, 'role_id');
    }

    /** Permissions yang terhubung ke role ini (via pivot role_permission) */
    public function permissions(): BelongsToMany
    {
        return $this->belongsToMany(Permission::class, 'role_permission', 'role_id', 'permission_id')
            ->withTimestamps();
    }

    /** Cek apakah role ini punya permission tertentu (by name) */
    public function hasPermission(string $permissionName): bool
    {
        // optim: gunakan loaded relasi kalau sudah ada, else query minimal
        if ($this->relationLoaded('permissions')) {
            return $this->permissions->contains('name', $permissionName);
        }
        return $this->permissions()->where('name', $permissionName)->exists();
    }

    /** Scope: hanya role aktif */
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}
