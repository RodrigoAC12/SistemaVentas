<?php
header("Content-Type: application/json");
require 'conexion.php';

$datos = json_decode(file_get_contents("php://input"));

if (isset($datos->cliente) && isset($datos->producto) && isset($datos->cantidad) && isset($datos->precio) && isset($datos->total)) {
    
    $stmt = $pdo->prepare("INSERT INTO ventas (cliente, producto, cantidad, precio, total) VALUES (?, ?, ?, ?, ?)");
    
    if ($stmt->execute([$datos->cliente, $datos->producto, $datos->cantidad, $datos->precio, $datos->total])) {
        echo json_encode(["status" => "success", "mensaje" => "Venta guardada correctamente"]);
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Error al guardar en la base de datos"]);
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "Datos incompletos"]);
}
?>