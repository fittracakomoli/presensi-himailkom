<?php

namespace Database\Seeders;

use App\Models\Permission;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        Permission::insert([
            ['name' => 'admin', 'display_name' => 'Admin Access', 'group' => 'admin', 'description' => 'Full admin access', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'moderator', 'display_name' => 'Moderator Access', 'group' => 'moderator', 'description' => 'Moderator access', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'member', 'display_name' => 'Member Access', 'group' => 'member', 'description' => 'Member access', 'is_active' => true, 'created_at' => now(), 'updated_at' => now()],
        ]);
    }
}
