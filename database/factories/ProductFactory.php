<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    public function definition()
    {
        $models = [
            '911 Carrera', 'Cayenne', 'Macan', 'Panamera', 'Boxster', 'Cayman', 'Taycan', '718', 'Panamera Turbo', '718 Spyder'
        ];

        $name = $this->faker->randomElement($models);

        return [
            'name' => $name,
            'sku' => 'POR-' . strtoupper(Str::random(6)),
            'category' => 'Porsche',
            'price' => $this->faker->numberBetween(80000, 350000),
            'stock' => $this->faker->numberBetween(0, 12),
            'status' => $this->faker->randomElement(['available', 'sold', 'reserved']),
            'created_at' => $this->faker->dateTimeBetween('-2 years', 'now'),
        ];
    }
}
