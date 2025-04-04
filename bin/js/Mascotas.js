var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var N_Mascotas;
(function (N_Mascotas) {
    class Cls_Mascotas {
        constructor() {
            this.formatoFecha = d3.timeFormat("%d/%m/%Y %I:%M %p");
            this.mascotas = new Map();
            this.url = "http://192.168.15.225:8080//Mascotas.svc";
            this.ultimaSincronizacion = null;
            this.UI_CrearTabla();
            this.CargarMascotas();
            setInterval(() => {
                this.CargarMascotas();
            }, 15000);
        }
        CargarMascotas() {
            return __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                try {
                    let url = `${this.url}/obtenermascotas`;
                    if (this.ultimaSincronizacion) {
                        const isoFecha = this.ultimaSincronizacion.toISOString();
                        url = `${this.url}/obtenermascotasactualizadas?desde=${encodeURIComponent(isoFecha)}`;
                    }
                    const respuesta = yield fetch(url, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" }
                    });
                    if (!respuesta.ok) {
                        throw new Error("Error al obtener las mascotas, código: " + respuesta.status);
                    }
                    const data = yield respuesta.json();
                    const mascotasArray = (_a = data.ObtenerMascotasActualizadasResult) !== null && _a !== void 0 ? _a : data.ObtenerMascotasResult;
                    mascotasArray.forEach(m => this.mascotas.set(m.Id, m));
                    console.log("🔄 Mascotas recibidas:", mascotasArray.length);
                    // 🔁 Ahora sincroniza eliminaciones
                    if (this.ultimaSincronizacion) {
                        const isoFecha = this.ultimaSincronizacion.toISOString();
                        const urlEliminadas = `${this.url}/obtenermascotaseliminadas?desde=${encodeURIComponent(isoFecha)}`;
                        try {
                            const resEliminadas = yield fetch(urlEliminadas, {
                                method: "GET",
                                headers: { "Content-Type": "application/json" }
                            });
                            if (resEliminadas.ok) {
                                const dataEliminadas = yield resEliminadas.json();
                                const ids = dataEliminadas.ObtenerMascotasEliminadasResult;
                                ids.forEach(id => {
                                    if (this.mascotas.has(id)) {
                                        this.mascotas.delete(id);
                                        console.log(`🗑 Mascota ID ${id} eliminada del mapa automáticamente`);
                                    }
                                });
                                this.actualizarTabla();
                            }
                        }
                        catch (e) {
                            console.warn("❌ Error al sincronizar eliminaciones:", e);
                        }
                    }
                    // ✅ AL FINAL se actualiza el timestamp de sincronización
                    this.ultimaSincronizacion = new Date();
                    console.log("⏱ Última sincronización:", (_b = this.ultimaSincronizacion) === null || _b === void 0 ? void 0 : _b.toISOString());
                }
                catch (error) {
                    console.error("Error al cargar las mascotas:", error);
                }
            });
        }
        actualizarTabla(mascotasFiltradas) {
            const datos = mascotasFiltradas || Array.from(this.mascotas.values());
            this.tablaCuerpo.selectAll("*").remove();
            const filas = this.tablaCuerpo
                .selectAll("tr")
                .data(datos)
                .enter()
                .append("tr");
            filas.append("td").text(d => d.Nombre);
            filas.append("td").text(d => d.Edad);
            filas.append("td").text(d => d.Especie);
            filas.append("td").text(d => d.Raza);
            filas.append("td").text(d => d.Peso);
            filas.append("td").text(d => d.Sexo === "H" ? "Hembra" : d.Sexo === "M" ? "Macho" : d.Sexo);
            filas.append("td").text(d => this.formatearFecha(d.FechaRegistro));
            filas.append("td").append("button")
                .text("Editar")
                .style("background-color", "#f0ad4e")
                .style("color", "white")
                .style("padding", "5px 10px")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", (event, d) => this.editarMascota(d));
            filas.append("td").append("button")
                .text("Eliminar")
                .style("background-color", "#d9534f")
                .style("color", "white")
                .style("padding", "5px 10px")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", (event, d) => this.eliminarMascota(d));
        }
        formatearFecha(fecha) {
            if (!fecha)
                return "Sin fecha";
            try {
                const timestamp = parseInt(fecha.replace("/Date(", "").replace(")/", ""));
                const date = new Date(timestamp);
                return this.formatoFecha(date);
            }
            catch (_a) {
                return "Fecha inválida";
            }
        }
        UI_CrearTabla() {
            const contenedor = d3.select("body")
                .append("div")
                .attr("class", "tabla-container")
                .style("max-width", "1200px")
                .style("margin", "50px auto")
                .style("background", "white")
                .style("padding", "20px")
                .style("border-radius", "10px")
                .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.1)");
            const encabezado = contenedor.append("div")
                .attr("class", "header")
                .style("display", "flex")
                .style("justify-content", "space-between")
                .style("align-items", "center");
            encabezado.append("h2")
                .text("Lista de Mascotas")
                .style("font-size", "20px")
                .style("color", "#333");
            const acciones = encabezado.append("div").attr("class", "acciones");
            acciones.append("button")
                .text("Nuevo")
                .style("background-color", "#28a745")
                .style("color", "white")
                .style("padding", "10px 20px")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => this.agregarMascota());
            this.inputBusqueda = acciones.append("input")
                .attr("type", "text")
                .attr("placeholder", "Buscar por nombre o especie...")
                .style("margin-left", "10px")
                .style("padding", "5px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "5px")
                .style("width", "200px");
            this.inputBusqueda.on("keyup", () => this.filtrarMascotas());
            this.tabla = contenedor.append("table")
                .attr("class", "billing-table")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("margin-top", "20px");
            const thead = this.tabla.append("thead");
            const encabezadoFila = thead.append("tr");
            encabezadoFila.append("th").text("Nombre");
            encabezadoFila.append("th").text("Edad");
            encabezadoFila.append("th").text("Especie");
            encabezadoFila.append("th").text("Raza");
            encabezadoFila.append("th").text("Peso");
            encabezadoFila.append("th").text("Sexo");
            encabezadoFila.append("th").text("Fecha Registro");
            encabezadoFila.append("th").text("Acciones");
            this.tablaCuerpo = this.tabla.append("tbody");
        }
        filtrarMascotas() {
            const texto = this.inputBusqueda.property("value").toLowerCase();
            const filtradas = Array.from(this.mascotas.values()).filter(m => m.Nombre.toLowerCase().includes(texto) ||
                m.Especie.toLowerCase().includes(texto));
            this.actualizarTabla(filtradas);
        }
        editarMascota(mascota) {
            new N_Mascotas.FormularioEditarMascota(mascota, (actualizada) => __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`${this.url}/actualizarmascota`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ mascota: actualizada })
                    });
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    const result = yield response.json();
                    if (result.ActualizarMascotaResult === true) {
                        yield this.CargarMascotas();
                    }
                    else {
                        alert("No se pudo actualizar la mascota.");
                    }
                }
                catch (error) {
                    console.error("Error al actualizar mascota:", error);
                    alert("Ocurrió un error al actualizar la mascota.");
                }
            }));
        }
        eliminarMascota(mascota) {
            const fondo = d3.select("body")
                .append("div")
                .attr("id", "modal-confirmacion")
                .style("position", "fixed")
                .style("top", "0")
                .style("left", "0")
                .style("width", "100%")
                .style("height", "100%")
                .style("background-color", "rgba(0,0,0,0.6)")
                .style("display", "flex")
                .style("justify-content", "center")
                .style("align-items", "center")
                .style("z-index", "9999");
            const contenedor = fondo.append("div")
                .style("background", "white")
                .style("padding", "20px")
                .style("border-radius", "10px")
                .style("width", "350px")
                .style("box-shadow", "0 0 10px rgba(0,0,0,0.3)")
                .style("text-align", "center");
            contenedor.append("p")
                .text(`¿Seguro que deseas eliminar a "${mascota.Nombre}"?`)
                .style("font-size", "16px")
                .style("color", "#333")
                .style("margin-bottom", "20px");
            const botones = contenedor.append("div");
            botones.append("button")
                .text("Cancelar")
                .style("margin-right", "10px")
                .style("padding", "8px 15px")
                .style("background-color", "#ccc")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => {
                fondo.remove();
            });
            botones.append("button")
                .text("Eliminar")
                .style("padding", "8px 15px")
                .style("background-color", "#d9534f")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => {
                fondo.remove();
                fetch(`${this.url}/eliminarmascota`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ mascota: { Id: mascota.Id } })
                })
                    .then(response => {
                    if (!response.ok)
                        throw new Error(`Error : ${response.status}`);
                    return response.json();
                })
                    .then(result => {
                    if (result.EliminarMascotaResult === true) {
                        this.mascotas.delete(mascota.Id);
                        this.actualizarTabla();
                    }
                    else {
                        alert("No se pudo eliminar la mascota.");
                    }
                })
                    .catch(error => {
                    console.error("Error al eliminar mascota:", error);
                    alert("Ocurrió un error al eliminar la mascota.");
                });
            });
        }
        agregarMascota() {
            new N_Mascotas.FormularioAgregarMascota((nueva) => __awaiter(this, void 0, void 0, function* () {
                try {
                    console.log("Mascota a enviar:", nueva);
                    const response = yield fetch(`${this.url}/agregarmascota`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ mascota: nueva })
                    });
                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }
                    const ok = yield response.json();
                    if (ok.AgregarMascotaResult === true) {
                        yield this.CargarMascotas();
                    }
                    else {
                        alert("No se pudo guardar la mascota.");
                    }
                }
                catch (error) {
                    console.error("Error al registrar mascota:", error);
                    alert("Hubo un error al registrar la mascota.");
                }
            }));
        }
    }
    N_Mascotas.Cls_Mascotas = Cls_Mascotas;
})(N_Mascotas || (N_Mascotas = {}));
let I_Mascotas = new N_Mascotas.Cls_Mascotas();
//# sourceMappingURL=mascotas.js.map