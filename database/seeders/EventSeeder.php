<?php

namespace Database\Seeders;

use Carbon\Carbon;
use App\Models\Event;
use App\Models\User;
use Faker\Factory as Faker;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class EventSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $event = Event::all();
        $eventUser = User::where('role_id', 2)->get();

        $eventTitle = [
            'CSS',
            'Sarasehan',
            'Technofest',
        ];

        $eventLocation = [
            'Lapangan',
            'Ruang Serbaguna',
            'Auditorium',
        ];

        for ($i = 0; $i < 3; $i++) {
            $user = $eventUser->random();

            Event::create([
                'user_id' => $user->id,
                'title' => $eventTitle[$i],
                'description' => $faker->paragraph(),
                'location' => $eventLocation[$i],
                'created_at' => Carbon::now()->subDays(rand(1, 20)),
                'updated_at' => Carbon::now()->subDays(rand(1, 20)),
            ]);
        }
        
    }
}
