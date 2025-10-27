<?php

namespace Database\Seeders;

use App\Models\Role;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Role::insert([
            ['name' => 'admin', 'display_name' => 'Administrator', 'description' => 'Full system access', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'moderator', 'display_name' => 'Moderator', 'description' => 'Manage attendance & create event', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'member', 'display_name' => 'Member', 'description' => 'Apply for attendance', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
