<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $roles = Role::all()->keyBy('name');

        // 1 Admin User
        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@presensi.com',
            'password' => Hash::make('password123'),
            'role_id' => $roles['admin']->id,
            'email_verified_at' => now(),
            'created_at' => now()->subMonths(6),
            'updated_at' => now()->subMonths(6),
        ]);

        // 5 Moderator Users
        $moderatorNames = [
            'Sekretaris Umum',
            'Sekretaris 2',
            'Sekretaris 3'
        ];

        foreach ($moderatorNames as $index => $moderatorName) {
            User::create([
                'name' => $moderatorName,
                'email' => 'moderator' . ($index + 1) . '@presensi.com',
                'password' => Hash::make('password123'),
                'role_id' => $roles['moderator']->id,
                'email_verified_at' => now()->subDays(rand(10, 60)),
                'created_at' => now()->subDays(rand(30, 180)),
                'updated_at' => now()->subDays(rand(1, 30)),
            ]);
        }

        // 10 Job Seeker Users
        $memberNames = [
            'Budi Santoso',
            'Rina Kusuma',
            'Ahmad Fauzi',
            'Siti Nurhaliza',
            'Dedi Prasetyo',
            'Maya Andini',
            'Reza Firmansyah',
            'Lina Marlina',
            'Agus Setiawan',
            'Dewi Lestari',
        ];

        foreach ($memberNames as $index => $name) {
            User::create([
                'name' => $name,
                'email' => 'member' . ($index + 1) . '@presensi.com',
                'password' => Hash::make('password123'),
                'role_id' => $roles['member']->id,
                'email_verified_at' => now()->subDays(rand(5, 90)),
                'created_at' => now()->subDays(rand(20, 150)),
                'updated_at' => now()->subDays(rand(1, 20)),
            ]);
        }
    }
}
