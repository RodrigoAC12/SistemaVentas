// front/script.js
document.addEventListener("DOMContentLoaded", function () {
    
    // URL base para el backend relativa desde la carpeta 'front'
    const backendURL = '../backend/';

    // 🔹 1. CALCULAR TOTAL
    function calcularTotal() {
        // Obtener valores
        const cantidadInput = document.getElementById("cantidad");
        const precioInput = document.getElementById("precio");
        const totalInput = document.getElementById("total");

        let cantidad = parseFloat(cantidadInput.value);
        let precio = parseFloat(precioInput.value);

        // Validaciones básicas
        if (isNaN(cantidad) || cantidad <= 0 || isNaN(precio) || precio <= 0) {
            alert("Por favor, ingrese cantidad y precio válidos (mayores a cero).");
            totalInput.value = ""; // Limpiar total si hay error
            return;
        }

        // Calcular y formatear
        let total = cantidad * precio;
        totalInput.value = total.toFixed(2);
    }

    // Exportar la función al objeto window para que el onclick del HTML la encuentre
    window.calcularTotal = calcularTotal;

    // 🔹 2. REGISTRAR VENTA (POST)
    document.getElementById("formVenta").addEventListener("submit", async function (e) {
        e.preventDefault(); // Prevenir recarga de página

        // Obtener datos
        const cliente = document.getElementById("cliente").value.trim();
        const producto = document.getElementById("producto").value.trim();
        const cantidad = document.getElementById("cantidad").value;
        const precio = document.getElementById("precio").value;
        const total = document.getElementById("total").value;

        // Validación final antes de enviar
        if (!cliente || !producto || !cantidad || !precio) {
            alert("Todos los campos son obligatorios.");
            return;
        }

        if (total === "" || parseFloat(total) <= 0) {
            alert("Debe pulsar 'Calcular Total' y obtener un resultado válido antes de registrar.");
            return;
        }

        // Crear objeto de datos
        const nuevaVenta = { cliente, producto, cantidad, precio, total };

        try {
            // Enviar datos al backend usando FETCH
            const respuesta = await fetch(backendURL + 'guardar_venta.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaVenta)
            });

            // Verificar si la respuesta es OK
            if (!respuesta.ok) throw new Error('Error en la respuesta del servidor');

            const resultado = await respuesta.json();

            if (resultado.status === 'success') {
                alert(resultado.mensaje);
                this.reset(); // Limpiar formulario
                cargarDatos(); // Recargar la tabla para ver lo nuevo
            } else {
                alert("Error: " + resultado.mensaje);
            }

        } catch (error) {
            console.error("Error al registrar:", error);
            alert("Hubo un error de conexión con el servidor al intentar registrar.");
        }
    });

    // 🔹 3. ELIMINAR VENTA (DELETE via POST JSON)
    async function eliminarVenta(id) {
        // Confirmación de seguridad
        if (!confirm(`¿Está seguro de que desea eliminar la venta con ID ${id}? Esta acción no se puede deshacer.`)) {
            return; // Cancelar operación
        }

        try {
            // Enviar ID al backend para eliminar
            const respuesta = await fetch(backendURL + 'eliminar_venta.php', {
                method: 'POST', // Usamos POST para enviar JSON cómodamente
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: id }) // Enviamos el ID en un objeto
            });

            if (!respuesta.ok) throw new Error('Error en la respuesta del servidor');

            const resultado = await respuesta.json();

            if (resultado.status === 'success') {
                alert(resultado.mensaje);
                cargarDatos(); // Recargar la tabla para reflejar el cambio
            } else {
                alert("Error: " + resultado.mensaje);
            }

        } catch (error) {
            console.error("Error al eliminar:", error);
            alert("Hubo un error de conexión con el servidor al intentar eliminar.");
        }
    }

    // Exportar al objeto window para el onclick dinámico de la tabla
    window.eliminarVenta = eliminarVenta;

    // 🔹 4. DIBUJAR TABLA DE VENTAS
    function mostrarVentas(datos) {
        const lista = document.getElementById("listaVentas");
        lista.innerHTML = ""; // Limpiar tabla actual

        if (datos.length === 0) {
            lista.innerHTML = `<tr><td colspan="7" style="text-align:center;">No hay ventas registradas.</td></tr>`;
            return;
        }

        // Recorrer datos y crear filas
        datos.forEach(v => {
            // Formatear números para visualización
            const precioFormateado = parseFloat(v.precio).toFixed(2);
            const totalFormateado = parseFloat(v.total).toFixed(2);

            lista.innerHTML += `
                <tr>
                    <td>${v.id}</td> <td>${v.cliente}</td>
                    <td>${v.producto}</td>
                    <td>${v.cantidad}</td>
                    <td>$${precioFormateado}</td>
                    <td>$${totalFormateado}</td>
                    <td class="celda-acciones">
                        <button class="btn-eliminar" onclick="eliminarVenta(${v.id})">Eliminar</button>
                    </td>
                </tr>
            `;
        });
    }

    // 🔹 5. OBTENER DATOS (GET)
    async function cargarDatos() {
        try {
            // Solicitar datos al backend
            const respuesta = await fetch(backendURL + 'obtener_ventas.php');
            
            if (!respuesta.ok) throw new Error('Error al obtener datos');

            const datos = await respuesta.json();
            
            // Si PHP devuelve un error de conexión, lo registramos
            if(datos.error) {
                console.error(datos.error);
                alert("Error de base de datos al cargar.");
                return;
            }

            mostrarVentas(datos); // Dibujar la tabla

        } catch (error) {
            console.error("Error al cargar los datos:", error);
            const lista = document.getElementById("listaVentas");
            lista.innerHTML = `<tr><td colspan="7" style="text-align:center; color:red;">Error de conexión con el servidor.</td></tr>`;
        }
    }

    // --- Iniciar la aplicación ---
    cargarDatos(); // Cargar datos al abrir la página
});