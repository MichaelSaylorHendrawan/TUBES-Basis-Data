<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Cek permission
        if (!$request->user()->can('view dashboard')) {
            return response()->json(['error' => 'Unauthorized'], 403);
        }

        $query = User::query();

        // Search
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('department', 'like', "%{$search}%");
            });
        }

        // Sort
        if ($request->has('sort_by') && $request->has('sort_order')) {
            $query->orderBy($request->sort_by, $request->sort_order);
        } else {
            $query->orderBy('id', 'desc');
        }

        // Pagination vs All
        if ($request->has('page')) {
            $perPage = $request->get('per_page', 10);
            $data = $query->paginate($perPage);
        } else {
            // Hati-hati! Tanpa pagination untuk data besar
            if ($request->user()->hasRole('admin')) {
                $data = $query->take(1000)->get(); // Batasi untuk demo
            } else {
                $data = $query->take(100)->get();
            }
        }

        return response()->json($data);
    }

    public function stats()
    {
        $stats = [
            'total_users' => User::count(),
            'active_users' => User::where('status', 'active')->count(),
            'users_by_department' => User::select('department', DB::raw('count(*) as total'))
                ->groupBy('department')
                ->get(),
            'latest_users' => User::orderBy('created_at', 'desc')->take(5)->get(),
        ];

        return response()->json($stats);
    }
}