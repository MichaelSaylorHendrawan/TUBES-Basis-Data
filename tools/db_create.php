<?php

$host = '127.0.0.1';
$port = 3306;
$username = 'root';
$password = '';
$dbname = 'rbac_db';
$newUser = 'rbac_user';
$newPassword = 'StrongPassword123';

try {
    $pdo = new PDO("mysql:host={$host};port={$port}", $username, $password, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION
    ]);

    $pdo->exec("CREATE DATABASE IF NOT EXISTS `{$dbname}` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;");
    echo "Database '{$dbname}' created or already exists.\n";

    // Create user (MySQL 5.7+/8 compatible)
    try {
        $pdo->exec("CREATE USER IF NOT EXISTS '{$newUser}'@'localhost' IDENTIFIED BY '{$newPassword}';");
        echo "User '{$newUser}' created or already exists.\n";
    } catch (Exception $e) {
        // Some MySQL versions don't support IF NOT EXISTS for CREATE USER
        echo "CREATE USER failed (continuing): " . $e->getMessage() . "\n";
    }

    $pdo->exec("GRANT ALL PRIVILEGES ON `{$dbname}`.* TO '{$newUser}'@'localhost';");
    $pdo->exec("FLUSH PRIVILEGES;");

    echo "Granted privileges to user '{$newUser}' on database '{$dbname}'.\n";

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "\n";
    exit(1);
}

return 0;
