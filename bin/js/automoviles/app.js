var Nm_Vehiculos;
(function (Nm_Vehiculos) {
    Nm_Vehiculos.URL_BASE = "http://localhost:56259";
    class TablaVehiculos {
        constructor() {
            this.vehiculos = [];
            this.ultimaFecha = null;
            this.API_URL = Nm_Vehiculos.URL_BASE + "/ServicioVehiculos.svc/ObtenerVehiculos";
            this.DELETE_URL = Nm_Vehiculos.URL_BASE + "/ServicioVehiculos.svc/EliminarVehiculo/";
            this.ordenAscendente = true;
            this.modalEditar = new Nm_Vehiculos.editarVehiculo();
            this.modalAgregar = new Nm_Vehiculos.agregarVehiculo();
            this.crearEstructuraHTML();
            this.iniciar();
        }
        iniciar() {
            this.cargarVehiculos();
            // setInterval(() => this.cargarVehiculos(), 8000);
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
                if (header === "Fecha Edición") {
                    // th.style("cursor", "pointer").on("click", () => this.ordenarPorFechaEdicion());
                }
            });
            table.append("tbody");
        }
        // private ordenarPorFechaEdicion(): void {
        //     this.ordenAscendente = !this.ordenAscendente;
        //     this.vehiculos.sort((a, b) => {
        //         const fechaA = new Date(this.parseWcfDate(a.FechaEdicion)).getTime();
        //         const fechaB = new Date(this.parseWcfDate(b.FechaEdicion)).getTime();
        //         return this.ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
        //     });
        //     this.renderTabla();
        // }
        filtrarVehiculos(valor) {
            const filtrados = this.vehiculos.filter((v) => v.Placa.toLowerCase().includes(valor) ||
                v.Estado.toLowerCase().includes(valor));
            this.renderTabla(filtrados);
        }
        cargarVehiculos() {
            const body = {
                desde: this.ultimaFecha
                    ? `/Date(${new Date(this.ultimaFecha).getTime()}-0600)/`
                    : null,
            };
            console.log("Consultando vehículos...");
            console.log("Enviando filtro:", body.desde);
            fetch(this.API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((data) => {
                console.log("Respuesta de la API:", data); // Aquí se loguea la respuesta
                if (data.Exito && data.Datos.length > 0) {
                    console.log(`Se recibieron ${data.Datos.length} vehículos editados.`);
                    const vehiculoMap = new Map();
                    this.vehiculos.forEach((v) => vehiculoMap.set(v.Id, v));
                    data.Datos.forEach((nuevo) => {
                        if (!nuevo.Activo) {
                            vehiculoMap.delete(nuevo.Id);
                            console.log("Registro eliminado");
                        }
                        else {
                            vehiculoMap.set(nuevo.Id, nuevo);
                        }
                    });
                    this.vehiculos = Array.from(vehiculoMap.values());
                    this.renderTabla();
                }
                else {
                    console.log("Sin cambios nuevos.");
                }
            })
                .catch((err) => console.error("Error al consumir la API:", err));
        }
        // private actualizarUltimaFecha(nuevos: Vehiculo[]): void {
        //     // const fechas = nuevos.map((v) =>
        //     //     // new Date(this.parseWcfDate(v.FechaEdicion)).getTime()
        //     // );
        //     const max = Math.max(
        //         ...fechas,
        //         new Date(this.ultimaFecha || 0).getTime()
        //     );
        //     this.ultimaFecha = new Date(max).toISOString();
        //     console.log("Nueva fecha máxima actualizada:", this.ultimaFecha);
        // }
        parseWcfDate(wcf) {
            const match = /\/Date\((\d+)(?:-\d+)?\)\//.exec(wcf);
            return match ? new Date(parseInt(match[1], 10)).toISOString() : wcf; // Devuelve un string en formato ISO
        }
        formatDate(fecha) {
            const d = new Date(fecha); // Convierte la fecha a tipo Date si no es ya un objeto Date
            return d.toLocaleString(); // Devuelve la fecha en formato local
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
            newRows.append("td").text((d) => d.Estado);
            newRows.append("td").text((d) => this.formatDate(this.parseWcfDate(d.FechaRegistro))); // Aquí se muestra la fecha de registro
            newRows.append("td").text((d) => this.formatDate(this.parseWcfDate(d.FechaEdicion))); // Aquí se muestra la fecha de edición
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