<?php
header("Content-Type: application/json");
require 'conexion.php';

$stmt = $pdo->query("SELECT * FROM ventas ORDER BY id DESC");
$ventas = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($ventas);
?>