<?php
$host = '127.0.0.1';
$port = 3306;
$rootUser = 'root';
$rootPass = '';
$newUser = 'rbac_user';
$newPass = 'StrongPassword123';
$db = 'rbac_db';
try {
    $pdo = new PDO("mysql:host={$host};port={$port}", $rootUser, $rootPass);
    $stmt = $pdo->query("SHOW DATABASES LIKE '{$db}'");
    $exists = $stmt->fetchColumn();
    echo "Database exists: " . ($exists ? 'yes' : 'no') . "\n";
} catch (PDOException $e) {
    echo "Root connect error: " . $e->getMessage() . "\n";
}
try {
    $pdo2 = new PDO("mysql:host={$host};port={$port};dbname={$db}", $newUser, $newPass);
    echo "Connected as new user to '{$db}'\n";
} catch (PDOException $e) {
    echo "New user connect error: " . $e->getMessage() . "\n";
}
