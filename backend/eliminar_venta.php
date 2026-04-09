<?php
// backend/eliminar_venta.php
header("Content-Type: application/json");
// Permitir peticiones desde el front (CORS) si fuera necesario, 
// aunque estando en carpetas hermanas bajo localhost no suele hacer falta.
require 'conexion.php';

// Leer los datos JSON enviados desde JavaScript (fetch)
$datos = json_decode(file_get_contents("php://input"));

// Verificar que se haya enviado el ID
if (isset($datos->id) && !empty($datos->id)) {
    
    // Consulta preparada para evitar inyección SQL
    $stmt = $pdo->prepare("DELETE FROM ventas WHERE id = ?");
    
    // Ejecutar pasando el ID como parámetro
    if ($stmt->execute([$datos->id])) {
        // Verificar si realmente se eliminó alguna fila (por si el ID no existía)
        if ($stmt->rowCount() > 0) {
            echo json_encode(["status" => "success", "mensaje" => "Venta eliminada correctamente"]);
        } else {
            echo json_encode(["status" => "error", "mensaje" => "No se encontró el registro con ese ID"]);
        }
    } else {
        echo json_encode(["status" => "error", "mensaje" => "Error al intentar eliminar de la base de datos"]);
    }
} else {
    echo json_encode(["status" => "error", "mensaje" => "ID no proporcionado"]);
}
?>