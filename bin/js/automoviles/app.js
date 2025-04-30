var Nm_Vehiculos;
(function (Nm_Vehiculos) {
    Nm_Vehiculos.URL_BASE = "http://localhost:56259";
    class TablaVehiculos {
        constructor() {
            this.vehiculos = [];
            this.ultimaFecha = null; // Esta será la fecha máxima de edición
            this.API_URL = Nm_Vehiculos.URL_BASE + "/ServicioVehiculos.svc/ObtenerVehiculos";
            this.DELETE_URL = Nm_Vehiculos.URL_BASE + "/ServicioVehiculos.svc/EliminarVehiculo/";
            this.ordenAscendente = true;
            this.modalEditar = new Nm_Vehiculos.editarVehiculo();
            this.modalAgregar = new Nm_Vehiculos.agregarVehiculo();
            this.crearEstructuraHTML();
            this.iniciar();
        }
        iniciar() {
            this.cargarVehiculos(); // Llamada inicial sin fecha
            setInterval(() => this.cargarVehiculos(), 8000); // Actualización periódica
        }
        crearEstructuraHTML() {
            const container = d3
                .select("body")
                .append("div")
                .style("margin", "20px")
                .style("padding", "10px")
                .style("border", "1px solid #ccc");
            const card = container
                .append("div")
                .style("background-color", "#f8f9fa")
                .style("padding", "15px")
                .style("border-radius", "8px");
            const header = card
                .append("div")
                .style("display", "flex")
                .style("justify-content", "space-between")
                .style("align-items", "center")
                .style("background-color", "#ffffff")
                .style("color", "#000")
                .style("padding", "10px")
                .style("border-radius", "5px");
            header.append("h5").style("margin", "0").text("Gestionar vehículos");
            const btnGroup = header.append("div");
            btnGroup
                .append("button")
                .text("➕ Agregar nuevo vehículo")
                .style("background-color", "#28a745")
                .style("color", "white")
                .style("border", "none")
                .style("padding", "5px 10px")
                .style("border-radius", "4px")
                .on("click", () => this.agregarVehiculo());
            btnGroup
                .append("input")
                .attr("type", "text")
                .attr("placeholder", "Buscar por placa o estado...")
                .style("margin-right", "10px")
                .style("padding", "5px")
                .style("border-radius", "4px")
                .on("keyup", function (event) {
                const input = event.target;
                const valor = input.value.toLowerCase();
                VehiculosRef.filtrarVehiculos(valor);
            });
            const table = card
                .append("table")
                .attr("id", "tablaVehiculos")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("margin-top", "15px");
            const thead = table.append("thead").style("background-color", "#e9ecef");
            const tr = thead.append("tr");
            const headers = [
                "ID",
                "Placa",
                "Carga Máxima",
                "Unidad de Carga",
                "Tipo de Carga",
                "Estado",
                "Fecha Registro",
                "Fecha Edición",
                "Acciones",
            ];
            headers.forEach((header) => {
                const th = tr.append("th")
                    .text(header)
                    .style("padding", "8px")
                    .style("border", "1px solid #dee2e6")
                    .style("text-align", "left");
            });
            table.append("tbody");
        }
        filtrarVehiculos(valor) {
            const filtrados = this.vehiculos.filter((v) => v.Placa.toLowerCase().includes(valor) ||
                v.Estado.toLowerCase().includes(valor));
            this.renderTabla(filtrados);
        }
        cargarVehiculos() {
            let params = {};
            // Si ya tenemos una fecha máxima, la pasamos como parámetro en la consulta
            const tieneUltimaFecha = !!this.ultimaFecha;
            if (tieneUltimaFecha) {
                const date = new Date(this.ultimaFecha);
                params.fechaEdicionMaxima = Nm_Vehiculos.DateUtils.toWcfDate(date);
            }
            console.log("Params que se están enviando:", params);
            fetch(this.API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(params),
            })
                .then((response) => {
                console.log("Respuesta de la API:", response);
                return response.json();
            })
                .then((data) => {
                console.log("Datos recibidos:", data);
                if (data.Exito) {
                    this.vehiculos = data.Datos;
                    // ✅ Si había una fecha máxima y llegaron vehículos nuevos/actualizados, los mostramos
                    if (tieneUltimaFecha && this.vehiculos.length > 0) {
                        console.log("🚀 Vehículos agregados o editados recientemente:");
                    }
                    // Actualizamos la fecha máxima
                    if (this.vehiculos.length > 0) {
                        this.ultimaFecha = this.vehiculos.reduce((max, vehiculo) => {
                            return vehiculo.FechaEdicion > max ? vehiculo.FechaEdicion : max;
                        }, this.ultimaFecha || new Date(0).toISOString());
                    }
                    this.renderTabla();
                }
                else {
                    console.error("No se pudieron cargar los vehículos:", data.Mensaje);
                }
            })
                .catch((err) => console.error("Error al cargar vehículos:", err));
        }
        renderTabla(datos) {
            const data = datos || this.vehiculos;
            const tbody = d3.select("#tablaVehiculos tbody");
            tbody.selectAll("tr").remove();
            const rows = tbody
                .selectAll("tr")
                .data(data, (d) => d.Id.toString());
            const newRows = rows.enter().append("tr");
            newRows.append("td").text((d) => d.Id);
            newRows.append("td").text((d) => d.Placa);
            newRows.append("td").text((d) => d.CargaMaxima);
            newRows.append("td").text((d) => d.UnidadCarga); // Mostrar Unidad de Carga
            newRows.append("td").text((d) => d.TipoCarga); // Mostrar Tipo de Carga
            newRows.append("td").text((d) => d.Estado);
            newRows.append("td").text((d) => this.formatDate(this.parseWcfDate(d.FechaRegistro).toString())); // Convertir a string
            newRows.append("td").text((d) => this.formatDate(this.parseWcfDate(d.FechaEdicion).toString())); // Convertir a string
            const actionCells = newRows
                .append("td")
                .append("div")
                .style("display", "flex")
                .style("gap", "8px")
                .style("justify-content", "center");
            actionCells
                .append("button")
                .text("✏️")
                .attr("class", "btn-editar")
                .style("padding", "4px 8px")
                .style("background-color", "#ffc107")
                .style("border", "none")
                .style("border-radius", "4px")
                .on("click", (event, d) => this.editarVehiculo(d));
            actionCells
                .append("button")
                .text("🗑️")
                .attr("class", "btn-eliminar")
                .style("padding", "4px 8px")
                .style("background-color", "#dc3545")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "4px")
                .on("click", (event, d) => this.eliminarVehiculo(d.Id));
            rows.exit().remove();
        }
        parseWcfDate(wcf) {
            const match = /\/Date\((\d+)(?:-\d+)?\)\//.exec(wcf);
            return match ? new Date(parseInt(match[1], 10)).toISOString() : wcf; // Devuelve una cadena en formato ISO
        }
        formatDate(fecha) {
            const d = new Date(fecha); // Convierte la fecha a tipo Date si no es ya un objeto Date
            return d.toLocaleString(); // Devuelve la fecha en formato local
        }
        eliminarVehiculo(id) {
            if (!confirm(`¿Estás seguro de eliminar el vehículo con ID ${id}?`))
                return;
            fetch(this.DELETE_URL + id, {
                method: "DELETE",
            })
                .then((res) => res.json())
                .then((data) => {
                if (data === true) {
                    console.log(`🗑️ Vehículo con ID ${id} eliminado correctamente.`);
                    this.vehiculos = this.vehiculos.filter((v) => v.Id !== id);
                    this.renderTabla();
                }
                else {
                    console.error("No se pudo eliminar el vehículo.");
                }
            })
                .catch((err) => console.error("Error al eliminar el vehículo:", err));
        }
        agregarVehiculo() {
            this.modalAgregar.mostrar().then((nuevoVehiculo) => {
                if (nuevoVehiculo) {
                    this.cargarVehiculos();
                }
            });
        }
        editarVehiculo(vehiculo) {
            this.modalEditar.mostrar(vehiculo).then((vehiculoEditado) => {
                if (vehiculoEditado) {
                    this.vehiculos = this.vehiculos.map((v) => v.Id === vehiculoEditado.Id ? vehiculoEditado : v);
                    this.renderTabla();
                }
            });
        }
    }
    Nm_Vehiculos.TablaVehiculos = TablaVehiculos;
})(Nm_Vehiculos || (Nm_Vehiculos = {}));
let VehiculosRef = new Nm_Vehiculos.TablaVehiculos();
//# sourceMappingURL=app.js.map