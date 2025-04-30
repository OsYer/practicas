namespace Nm_Vehiculos {
    export class editarVehiculo {
        mostrar(vehiculo: Vehiculo): Promise<Vehiculo | null> {
            return new Promise((resolve) => {
                console.log("🛠️ Editando vehículo:", vehiculo.Placa);

                const formDiv = d3.select("body").append("div")
                    .style("position", "fixed")
                    .style("top", "50%")
                    .style("left", "50%")
                    .style("transform", "translate(-50%, -50%)")
                    .style("background-color", "#fff")
                    .style("padding", "20px")
                    .style("border-radius", "8px")
                    .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.2)")
                    .style("z-index", "9999");

                formDiv.append("h3").text("Editar Vehículo");

                formDiv.append("label").text("Placa: ");
                const placaInput = formDiv.append("input")
                    .attr("type", "text")
                    .attr("value", vehiculo.Placa)
                    .style("margin", "10px 0")
                    .style("width", "100%")
                    .style("padding", "5px");

                formDiv.append("label").text("Carga Máxima: ");
                const cargaMaximaInput = formDiv.append("input")
                    .attr("type", "number")
                    .attr("value", vehiculo.CargaMaxima)
                    .style("margin", "10px 0")
                    .style("width", "100%")
                    .style("padding", "5px");

                // Unidad de Carga
                formDiv.append("label").text("Unidad de Carga: ");
                const unidadCargaSelect = formDiv.append("select")
                    .style("margin", "10px 0")
                    .style("width", "100%")
                    .style("padding", "5px");

                const unidades = ["kilogramos", "toneladas"];
                unidades.forEach(u => {
                    unidadCargaSelect.append("option")
                        .attr("value", u)
                        .property("selected", vehiculo.UnidadCarga === u)
                        .text(u.charAt(0).toUpperCase() + u.slice(1));
                });

                // Tipo de Carga
                formDiv.append("label").text("Tipo de Carga: ");
                const tipoCargaSelect = formDiv.append("select")
                    .style("margin", "10px 0")
                    .style("width", "100%")
                    .style("padding", "5px");

                const tipos = ["General", "Peligrosa", "Refrigerada", "Refrigerados"];
                tipos.forEach(t => {
                    tipoCargaSelect.append("option")
                        .attr("value", t)
                        .property("selected", vehiculo.TipoCarga === t)
                        .text(t);
                });

                // Estado
                formDiv.append("label").text("Estado: ");
                const estadoSelect = formDiv.append("select")
                    .style("margin", "10px 0")
                    .style("width", "100%")
                    .style("padding", "5px");

                const estados = ["En Ruta", "Disponible", "En Mantenimiento"];
                estados.forEach(e => {
                    estadoSelect.append("option")
                        .attr("value", e)
                        .property("selected", vehiculo.Estado === e)
                        .text(e);
                });

                // Botón guardar
                formDiv.append("button")
                    .text("Guardar Cambios")
                    .style("background-color", "#28a745")
                    .style("color", "white")
                    .style("border", "none")
                    .style("padding", "10px 20px")
                    .style("border-radius", "4px")
                    .on("click", () => {
                        const vehiculoActualizado: Vehiculo = {
                            ...vehiculo,
                            Placa: placaInput.node()!.value,
                            CargaMaxima: parseInt(cargaMaximaInput.node()!.value),
                            Estado: estadoSelect.node()!.value,
                            UnidadCarga: unidadCargaSelect.node()!.value,
                            TipoCarga: tipoCargaSelect.node()!.value,
                            Activo: true
                        };

                        fetch(URL_BASE + "/ServicioVehiculos.svc/ActualizarVehiculo", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(vehiculoActualizado),
                        })
                        .then(res => res.json())
                        .then(success => {
                            if (success === true) {
                                mostrarNotificacion("✅ Vehículo actualizado correctamente");
                                formDiv.remove();
                                resolve(vehiculoActualizado);
                            } else {
                                alert("❌ No se pudo actualizar el vehículo.");
                                resolve(null);
                            }
                        })
                        .catch(err => {
                            console.error("Error al actualizar:", err);
                            alert("❌ Error al actualizar.");
                            resolve(null);
                        })
                        .finally(() => {
                            formDiv.remove();
                        });
                    });

                // Botón cancelar
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
                        resolve(null);
                    });
            });
        }
    }
}
