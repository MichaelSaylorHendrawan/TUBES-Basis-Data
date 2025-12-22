<?php
$host = '127.0.0.1';
$port = 3306;
$rootUser = 'root';
$rootPass = '';
$newUser = 'rbac_user';
$newPass = 'StrongPassword123';
$db = 'rbac_db';
try {
    $pdo = new PDO("mysql:host={$host};port={$port}", $rootUser, $rootPass, [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, PDO::MYSQL_ATTR_USE_BUFFERED_QUERY => true]);
    echo "Running REPAIR TABLE mysql.db...\n";
    try {
        $pdo->exec("REPAIR TABLE mysql.db");
        echo "REPAIR attempted.\n";
    } catch (Exception $e) {
        echo "REPAIR TABLE failed: " . $e->getMessage() . "\n";
    }

    echo "Attempting GRANT privileges...\n";
    try {
        $pdo->exec("GRANT ALL PRIVILEGES ON `{$db}`.* TO '{$newUser}'@'localhost';");
        $pdo->exec("FLUSH PRIVILEGES;");
        echo "Grant executed.\n";
    } catch (Exception $e) {
        echo "GRANT failed: " . $e->getMessage() . "\n";
    }
} catch (PDOException $e) {
    echo "Root connect error: " . $e->getMessage() . "\n";
    exit(1);
}
