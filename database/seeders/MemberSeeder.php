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
        $faker = Faker::create('id_ID');
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

        foreach ($memberUsers as $index => $user) {
            $division = $faker->randomElement($divisions);
            $nim = '2304130' . str_pad($index + 1, 5, '0', STR_PAD_LEFT);

            Member::create([
                'user_id' => $user->id,
                'name' => $user->name,
                'nim' => $nim,
                'division' => $division,
                'created_at' => $user->created_at,
                'updated_at' => Carbon::now()->subDays(rand(1, 20)),
            ]);
        }
    }
}
