var Nm_Vehiculos;
(function (Nm_Vehiculos) {
    class agregarVehiculo {
        mostrar() {
            return new Promise((resolve, reject) => {
                // Crear el formulario para agregar un vehículo
                const formDiv = d3.select("body").append("div")
                    .style("position", "fixed")
                    .style("top", "50%")
                    .style("left", "50%")
                    .style("transform", "translate(-50%, -50%)")
                    .style("background-color", "#fff")
                    .style("padding", "20px")
                    .style("border-radius", "8px")
                    .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.2)");
                formDiv.append("h3").text("Agregar Vehículo");
                // Campos de formulario para ingresar la información del vehículo
                formDiv.append("label").text("Placa: ");
                const placaInput = formDiv.append("input")
                    .attr("type", "text")
                    .attr("placeholder", "Placa del vehículo")
                    .style("margin", "10px 0")
                    .style("width", "100%")
                    .style("padding", "5px");
                formDiv.append("label").text("Carga Máxima: ");
                const cargaMaximaInput = formDiv.append("input")
                    .attr("type", "number")
                    .attr("placeholder", "Carga máxima")
                    .style("margin", "10px 0")
                    .style("width", "100%")
                    .style("padding", "5px");
                // Campo select para unidad de carga
                formDiv.append("label").text("Unidad de Carga: ");
                const unidadCargaSelect = formDiv.append("select")
                    .style("margin", "10px 0")
                    .style("width", "100%")
                    .style("padding", "5px");
                unidadCargaSelect.append("option")
                    .attr("value", "kilogramos")
                    .text("Kilogramos");
                unidadCargaSelect.append("option")
                    .attr("value", "toneladas")
                    .text("Toneladas");
                // Campo select para tipo de carga
                formDiv.append("label").text("Tipo de Carga: ");
                const tipoCargaSelect = formDiv.append("select")
                    .style("margin", "10px 0")
                    .style("width", "100%")
                    .style("padding", "5px");
                tipoCargaSelect.append("option")
                    .attr("value", "General")
                    .text("Carga General");
                tipoCargaSelect.append("option")
                    .attr("value", "Peligrosa")
                    .text("Carga Peligrosa");
                tipoCargaSelect.append("option")
                    .attr("value", "Refrigerada")
                    .text("Productos Refrigerados");
                // Campo select para estado del vehículo
                formDiv.append("label").text("Estado: ");
                const estadoSelect = formDiv.append("select")
                    .style("margin", "10px 0")
                    .style("width", "100%")
                    .style("padding", "5px");
                estadoSelect.append("option")
                    .attr("value", "En Ruta")
                    .text("En Ruta");
                estadoSelect.append("option")
                    .attr("value", "Disponible")
                    .text("Disponible");
                estadoSelect.append("option")
                    .attr("value", "En Mantenimiento")
                    .text("En Mantenimiento");
                // Botón para enviar los datos
                formDiv.append("button")
                    .text("Guardar Vehículo")
                    .style("background-color", "#28a745")
                    .style("color", "white")
                    .style("border", "none")
                    .style("padding", "10px 20px")
                    .style("border-radius", "4px")
                    .on("click", () => {
                    const vehiculo = {
                        Placa: placaInput.node().value,
                        CargaMaxima: parseInt(cargaMaximaInput.node().value),
                        Estado: estadoSelect.node().value,
                        UnidadCarga: unidadCargaSelect.node().value,
                        TipoCarga: tipoCargaSelect.node().value, // Obtener el valor de tipo de carga
                        Activo: true
                    };
                    // Mostrar en consola los datos que se están enviando
                    console.log("Datos a enviar:", vehiculo);
                    // Enviar el vehículo a la API para guardarlo
                    fetch(`${Nm_Vehiculos.URL_BASE}/ServicioVehiculos.svc/AgregarVehiculo`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify(vehiculo)
                    })
                        .then(response => {
                        if (!response.ok) {
                            throw new Error(`Error HTTP: ${response.status}`);
                        }
                        return response.json();
                    })
                        .then((data) => {
                        console.log("Vehículo agregado:", data);
                        formDiv.remove();
                        resolve(vehiculo);
                    })
                        .catch((error) => {
                        console.error("Error al agregar vehículo:", error);
                        reject(error);
                    });
                });
                // Botón para cerrar el formulario sin guardar
                formDiv.append("button")
                    .text("Cancelar")
                    .style("background-color", "#dc3545")
                    .style("color", "white")
                    .style("border", "none")
                    .style("padding", "10px 20px")
                    .style("border-radius", "4px")
                    .style("margin-left", "10px")
                    .on("click", () => {
                    formDiv.remove();
                });
            });
        }
    }
    Nm_Vehiculos.agregarVehiculo = agregarVehiculo;
})(Nm_Vehiculos || (Nm_Vehiculos = {}));
//# sourceMappingURL=agregarVehiculo.js.map