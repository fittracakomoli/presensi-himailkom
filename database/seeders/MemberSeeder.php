<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Role;
use App\Models\User;
use App\Models\Member;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class MemberSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $memberRole = Role::where('name', 'member')->first();
        $memberUsers = User::where('role_id', $memberRole->id)->get();

        $divisions = [
            'ph',
            'ekokre',
            'internal',
            'eksternal',
            'sosmas',
            'kominfo',
        ];

        // ubah batas atas sesuai kebutuhan; tiap key adalah nomor user (1-based) maksimum untuk division itu
        $divisionMap = [
            13 => 'ph',        // user 1..13
            20 => 'ekokre',    // user 14..20
            30 => 'internal',  // user 21..30
            39 => 'eksternal', // user 31..39
            47 => 'sosmas',    // user 40..47
            57 => 'kominfo',   // user 48..57
            66 => 'ph',        // user 58..66
            70 => 'ekokre',    // user 67..70
            80 => 'internal',  // user 71..80
            85 => 'eksternal', // user 81..85
            90 => 'sosmas',    // user 86..90
            98 => 'kominfo',   // user 91..98
        ];

        foreach ($memberUsers as $index => $user) {
            // index dari foreach adalah 0-based, jadi +1 untuk mendapatkan nomor user 1-based
            $number = $index + 1;

            // cari division berdasarkan batas atas
            $division = null;
            foreach ($divisionMap as $upper => $div) {
                if ($number <= $upper) {
                    $division = $div;
                    break;
                }
            }

            Member::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'nim' => $user->email,
                'division' => $division,
                'created_at' => $user->created_at,
                'updated_at' => Carbon::now()->subDays(rand(1, 20)),
            ]);
        }
    }
}
