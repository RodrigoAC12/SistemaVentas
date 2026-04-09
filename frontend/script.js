document.addEventListener("DOMContentLoaded", function () {
    // 🔹 CALCULAR TOTAL
    function calcularTotal() {
        let cliente = document.getElementById("cliente").value.trim();
        let producto = document.getElementById("producto").value.trim();
        let cantidad = document.getElementById("cantidad").value;
        let precio = document.getElementById("precio").value;

        if (cliente === "" || producto === "" || cantidad === "" || precio === "") {
            alert("No se pueden dejar campos en blanco para calcular el total");
            return;
        }

        cantidad = parseFloat(cantidad);
        precio = parseFloat(precio);

        if (isNaN(cantidad) || isNaN(precio)) {
            alert("Ingrese valores numéricos válidos en cantidad y precio");
            return;
        }

        let total = cantidad * precio;
        document.getElementById("total").value = total.toFixed(2);
    }

    window.calcularTotal = calcularTotal;

    // 🔹 REGISTRAR VENTA
    document.getElementById("formVenta").addEventListener("submit", async function (e) {
        e.preventDefault(); 

        let cliente = document.getElementById("cliente").value.trim();
        let producto = document.getElementById("producto").value.trim();
        let cantidad = document.getElementById("cantidad").value;
        let precio = document.getElementById("precio").value;
        let total = document.getElementById("total").value;

        if (cliente === "" || producto === "" || cantidad === "" || precio === "") return;
        if (total === "") {
            alert("Debe pulsar 'Calcular Total' primero");
            return;
        }

        const venta = { cliente, producto, cantidad, precio, total };

        try {
            // ENVIAR AL BACKEND (Ruta corregida)
            let respuesta = await fetch('../backend/guardar_venta.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(venta)
            });

            let resultado = await respuesta.json();

            if (resultado.status === 'success') {
                this.reset(); 
                cargarDatos(); 
            } else {
                alert(resultado.mensaje);
            }

        } catch (error) {
            console.error("Error:", error);
            alert("Hubo un error de conexión con el servidor");
        }
    });

    // 🔹 MOSTRAR VENTAS EN TABLA
    function mostrarVentas(datos) {
        const lista = document.getElementById("listaVentas");
        lista.innerHTML = "";

        datos.forEach(v => {
            lista.innerHTML += `
                <tr>
                    <td>${v.cliente}</td>
                    <td>${v.producto}</td>
                    <td>${v.cantidad}</td>
                    <td>$${v.precio}</td>
                    <td>$${v.total}</td>
                </tr>
            `;
        });
    }

    // 🔹 CARGAR DATOS DESDE MYSQL
    async function cargarDatos() {
        try {
            // SOLICITAR AL BACKEND (Ruta corregida)
            let respuesta = await fetch('../backend/obtener_ventas.php');
            let datos = await respuesta.json();
            mostrarVentas(datos);
        } catch (error) {
            console.error("Error al cargar los datos:", error);
        }
    }

    // Ejecutar al iniciar
    cargarDatos();
});