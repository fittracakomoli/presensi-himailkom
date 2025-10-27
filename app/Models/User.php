<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use App\Models\Role;
use App\Models\Attendance;
use Illuminate\Notifications\Notifiable;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    /**
     * Relasi ke Role (user -> role)
     */
    public function role(): BelongsTo
    {
        return $this->belongsTo(Role::class, 'role_id');
    }

    /**
     * Relasi ke Attendance (jika user melakukan presensi)
     */
    public function attendance(): HasOne
    {
        return $this->hasOne(Attendance::class, 'user_id');
    }

    /**
     * Mengecek apakah user memiliki permission tertentu
     */
    public function hasPermission(string $permission): bool
    {
        return $this->role?->hasPermission($permission) ?? false;
    }

    /**
     * Mengecek apakah user memiliki salah satu permission dari array
     */
    public function hasAnyPermission(array $permissions): bool
    {
        foreach ($permissions as $perm) {
            if ($this->hasPermission($perm)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Mengecek apakah user memiliki semua permission di array
     */
    public function hasAllPermissions(array $permissions): bool
    {
        foreach ($permissions as $perm) {
            if (!$this->hasPermission($perm)) {
                return false;
            }
        }
        return true;
    }

    /**
     * Mengambil nama role user
     */
    public function getRoleName(): string
    {
        return $this->role?->name ?? 'No Role';
    }

    /**
     * Mengecek apakah user adalah admin
     */
    public function isAdmin(): bool
    {
        return strtolower($this->getRoleName()) === 'admin';
    }

    /**
     * Mengecek apakah user adalah moderator
     */
    public function isModerator(): bool
    {
        return strtolower($this->getRoleName()) === 'moderator';
    }

    /**
     * Mengecek apakah user adalah anggota
     */
    public function isMember(): bool
    {
        return strtolower($this->getRoleName()) === 'member';
    }
}
