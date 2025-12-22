<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class DatabaseSeeder extends Seeder
{
    public function run()
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create permissions
        Permission::create(['name' => 'view dashboard']);
        Permission::create(['name' => 'edit data']);
        Permission::create(['name' => 'delete data']);
        Permission::create(['name' => 'manage users']);

        // Create roles and assign permissions
        $adminRole = Role::create(['name' => 'admin']);
        $adminRole->givePermissionTo(['view dashboard', 'edit data', 'delete data', 'manage users']);

        $editorRole = Role::create(['name' => 'editor']);
        $editorRole->givePermissionTo(['view dashboard', 'edit data']);

        $viewerRole = Role::create(['name' => 'viewer']);
        $viewerRole->givePermissionTo(['view dashboard']);

        // Create admin user
        $admin = User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('password'),
            'department' => 'IT',
            'status' => 'active'
        ]);
        $admin->assignRole($adminRole);

        // Create editor user
        $editor = User::create([
            'name' => 'Editor User',
            'email' => 'editor@example.com',
            'password' => Hash::make('password'),
            'department' => 'Content',
            'status' => 'active'
        ]);
        $editor->assignRole($editorRole);

        // Create viewer user
        $viewer = User::create([
            'name' => 'Viewer User',
            'email' => 'viewer@example.com',
            'password' => Hash::make('password'),
            'department' => 'Marketing',
            'status' => 'active'
        ]);
        $viewer->assignRole($viewerRole);

        // Generate 500k dummy users in batches to avoid memory spikes
        $total = 500000;
        $batch = 1000;
        echo "Generating {$total} dummy users in batches of {$batch}...\n";
        for ($i = 0; $i < $total; $i += $batch) {
            $count = min($batch, $total - $i);
            User::factory()->count($count)->create();
            echo "Created ".min($i + $batch, $total)." / {$total}\n";
        }
        echo "Done!\n";
    }
}
