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
            this.mascotas = new Map();
            // private url: string = "http://192.168.15.225:8080/Mascotas.svc";
            this.url = `${N_Mascotas.DateUtils.ApiBase}/Mascotas.svc`;
            this.UI_CrearTabla();
            this.CargarMascotas();
            setInterval(() => {
                this.CargarMascotas();
            }, 15000);
        }
        CargarMascotas() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    // Obtener la fecha máxima de edición actual
                    let fechaMax = null;
                    this.mascotas.forEach(m => {
                        if (m.FechaEdicion) {
                            const ts = parseInt(m.FechaEdicion.replace("/Date(", "").replace(")/", ""));
                            const actual = new Date(ts);
                            if (!fechaMax || actual > fechaMax) {
                                fechaMax = actual;
                            }
                        }
                    });
                    let filtro = {};
                    if (fechaMax) {
                        // Convertimos la fecha al string ISO 8601 que espera el servicio
                        const iso = N_Mascotas.DateUtils.formatConMicroOffset(fechaMax);
                        filtro = { filtro: { Fecha: iso } };
                        console.log("[Mascotas] ➤ Fecha máxima encontrada:", iso);
                    }
                    else {
                        console.log("[Mascotas] ➤ Primera carga sin filtro");
                        filtro = {}; // sin filtros en la primera vez
                    }
                    const response = yield fetch(`${this.url}/obtenermascotasfiltrofecha`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(filtro)
                    });
                    if (!response.ok) {
                        throw new Error(`HTTP ${response.status}`);
                    }
                    const result = yield response.json();
                    const nuevasMascotas = result.ObtenerMascotasFiltroFechaResult;
                    if (!nuevasMascotas || nuevasMascotas.length === 0) {
                        console.log("[Mascotas] ➤ Sin nuevas mascotas");
                        return;
                    }
                    nuevasMascotas.forEach(nueva => {
                        if (this.mascotas.has(nueva.Id)) {
                            // Mascota ya existe, actualizamos
                            const actual = this.mascotas.get(nueva.Id);
                            if (!actual || nueva.FechaEdicion !== actual.FechaEdicion) {
                                this.mascotas.set(nueva.Id, nueva);
                                console.log(`🔄 Mascota actualizada: ${nueva.Nombre}`);
                            }
                        }
                        else {
                            // Nueva mascota
                            this.mascotas.set(nueva.Id, nueva);
                            console.log(`🆕 Mascota nueva: ${nueva.Nombre}`);
                        }
                    });
                    this.actualizarTabla();
                }
                catch (error) {
                    console.error("❌ Error al cargar mascotas:", error);
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
            filas.append("td").text(d => N_Mascotas.DateUtils.formatearFecha(d.FechaRegistro));
            filas.append("td").text(d => N_Mascotas.DateUtils.formatearFecha(d.FechaEdicion));
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
            encabezadoFila.append("th")
                .text("Fecha Edición ")
                .style("cursor", "pointer")
                .on("click", () => this.ordenarPorFechaEdicion());
            encabezadoFila.append("th").text("Acciones");
            this.tablaCuerpo = this.tabla.append("tbody");
        }
        ordenarPorFechaEdicion() {
            const datosOrdenados = Array.from(this.mascotas.values())
                .sort((a, b) => {
                const fechaA = a.FechaEdicion ? this.obtenerTimestamp(a.FechaEdicion) : 0;
                const fechaB = b.FechaEdicion ? this.obtenerTimestamp(b.FechaEdicion) : 0;
                return fechaB - fechaA; // más reciente primero
            });
            this.actualizarTabla(datosOrdenados);
        }
        obtenerTimestamp(fecha) {
            try {
                return parseInt(fecha.replace("/Date(", "").replace(")/", ""));
            }
            catch (_a) {
                return 0;
            }
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
                    console.log("📦 Mascota a enviar:", nueva);
                    const response = yield fetch(`${this.url}/agregarmascota`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ mascota: nueva })
                    });
                    if (!response.ok) {
                        const errorText = yield response.text();
                        console.error("❌ Error HTTP:", errorText);
                        alert("Error del servidor: " + errorText);
                        return;
                    }
                    const result = yield response.json();
                    const data = result.AgregarMascotaResult;
                    if (data.Exito) {
                        alert("✅ " + data.Mensaje);
                        yield this.CargarMascotas();
                    }
                    else {
                        alert("❌ " + data.Mensaje);
                    }
                }
                catch (error) {
                    console.error("❌ Error al registrar mascota:", error);
                    alert("Hubo un error inesperado al registrar la mascota.");
                }
            }));
        }
    }
    N_Mascotas.Cls_Mascotas = Cls_Mascotas;
})(N_Mascotas || (N_Mascotas = {}));
let I_Mascotas = new N_Mascotas.Cls_Mascotas();
//# sourceMappingURL=mascotas.js.map