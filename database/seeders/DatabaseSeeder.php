<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Master data & authentication
        $this->call(RoleSeeder::class);

        // Create permissions and role-permission mappings
        $this->call(PermissionSeeder::class);
        $this->call(RolePermissionSeeder::class);

        // Create Users
        $this->call(UserSeeder::class);

        // Create Members
        $this->call(MemberSeeder::class);

        // Create Events
        $this->call(EventSeeder::class);
    }
}
