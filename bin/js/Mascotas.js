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
            this.UI_CrearTabla();
            this.CargarMascotas();
        }
        CargarMascotas() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const respuesta = yield fetch("http://localhost:50587/Mascotas.svc/obtenermascotas", {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json"
                        },
                    });
                    if (!respuesta.ok) {
                        throw new Error('Error al obtener las mascotas, código: ' + respuesta.status);
                    }
                    const data = yield respuesta.json();
                    this.actualizarTabla(data.ObtenerMascotasResult);
                }
                catch (error) {
                    console.error('Error al cargar las mascotas:', error);
                    // alert('Hubo un problema al cargar las mascotas.');
                }
            });
        }
        actualizarTabla(mascotas) {
            // Limpiar la tabla actual
            this.tablaCuerpo.selectAll("*").remove();
            // Agregar las filas de las mascotas
            const filas = this.tablaCuerpo.selectAll("tr")
                .data(mascotas)
                .enter()
                .append("tr");
            filas.append("td").text(d => d.Nombre);
            filas.append("td").text(d => d.Edad);
            filas.append("td").text(d => d.Especie);
            filas.append("td").text(d => d.Raza);
            filas.append("td").text(d => d.Peso);
            filas.append("td").text(d => d.Sexo);
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
            const timestamp = parseInt(fecha.replace("/Date(", "").replace(")/", ""));
            const date = new Date(timestamp);
            return date.toLocaleDateString("es-ES");
        }
        UI_CrearTabla() {
            // Crear contenedor principal
            const contenedor = d3.select("body")
                .append("div")
                .attr("class", "tabla-container")
                .style("max-width", "1200px")
                .style("margin", "50px auto")
                .style("background", "white")
                .style("padding", "20px")
                .style("border-radius", "10px")
                .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.1)");
            // Agregar el encabezado con las acciones
            const encabezado = contenedor.append("div")
                .attr("class", "header")
                .style("display", "flex")
                .style("justify-content", "space-between")
                .style("align-items", "center");
            encabezado.append("h2")
                .text("Lista de Mascotas")
                .style("font-size", "20px")
                .style("color", "#333");
            const acciones = encabezado.append("div")
                .attr("class", "acciones");
            acciones.append("button")
                .text("Nuevo")
                .style("background-color", "#28a745")
                .style("color", "white")
                .style("padding", "10px 20px")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => this.agregarMascota());
            // Crear la tabla
            this.tabla = contenedor.append("table")
                .attr("class", "billing-table")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("margin-top", "20px");
            // Crear encabezados de la tabla
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
            // Crear el cuerpo de la tabla
            this.tablaCuerpo = this.tabla.append("tbody");
        }
        editarMascota(mascota) {
            // Crear modal contenedor
            const modal = d3.select("body")
                .append("div")
                .attr("id", "modal-editar")
                .style("position", "fixed")
                .style("top", "0")
                .style("left", "0")
                .style("width", "100%")
                .style("height", "100%")
                .style("background-color", "rgba(0,0,0,0.6)")
                .style("display", "flex")
                .style("justify-content", "center")
                .style("align-items", "center")
                .style("z-index", "1000");
            const form = modal.append("div")
                .style("background", "white")
                .style("padding", "20px")
                .style("border-radius", "10px")
                .style("width", "400px")
                .style("box-shadow", "0 0 10px rgba(0,0,0,0.3)");
            const campos = [
                { nombre: "Nombre", tipo: "text" },
                { nombre: "Edad", tipo: "number" },
                { nombre: "Especie", tipo: "text" },
                { nombre: "Raza", tipo: "text" },
                { nombre: "Peso", tipo: "number", paso: "0.01" },
                { nombre: "Sexo", tipo: "text" },
                { nombre: "IdUsuario", tipo: "number" }
            ];
            campos.forEach(campo => {
                form.append("label").text(campo.nombre).style("display", "block").style("margin-top", "10px");
                form.append("input")
                    .attr("type", campo.tipo)
                    .attr("name", campo.nombre)
                    .attr("step", campo.paso || null)
                    .property("value", mascota[campo.nombre]) // <- prellenado
                    .style("width", "100%")
                    .style("padding", "5px")
                    .style("margin-top", "5px");
            });
            form.append("button")
                .text("Guardar cambios")
                .style("margin-top", "20px")
                .style("padding", "10px")
                .style("background-color", "#007bff")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => __awaiter(this, void 0, void 0, function* () {
                const inputs = {};
                form.selectAll("input").each(function () {
                    const input = d3.select(this);
                    const nombre = input.attr("name");
                    const valor = input.property("value");
                    inputs[nombre] = nombre === "Edad" || nombre === "Peso" || nombre === "IdUsuario" ? Number(valor) : valor;
                });
                const mascotaActualizada = {
                    Id: mascota.Id, // IMPORTANTE
                    Nombre: inputs.Nombre,
                    Edad: inputs.Edad,
                    Especie: inputs.Especie,
                    Raza: inputs.Raza,
                    Peso: inputs.Peso,
                    Sexo: inputs.Sexo,
                    IdUsuario: inputs.IdUsuario
                };
                try {
                    const respuesta = yield fetch("http://localhost:50587/Mascotas.svc/actualizarmascota", {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ mascota: mascotaActualizada })
                    });
                    if (respuesta.ok) {
                        alert("Mascota actualizada correctamente");
                        this.CargarMascotas();
                    }
                    else {
                        alert("Error al actualizar la mascota");
                    }
                }
                catch (error) {
                    console.error("Error al actualizar mascota:", error);
                    alert("Error al actualizar mascota");
                }
                modal.remove(); // cerrar modal
            }));
            form.append("button")
                .text("Cancelar")
                .style("margin-left", "10px")
                .style("padding", "10px")
                .style("background-color", "#6c757d")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => modal.remove());
        }
        eliminarMascota(mascota) {
            // Crear fondo del modal
            const overlay = d3.select("body")
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
                .style("z-index", "1000");
            // Contenedor del modal
            const modal = overlay.append("div")
                .style("background", "white")
                .style("padding", "20px")
                .style("border-radius", "10px")
                .style("width", "350px")
                .style("box-shadow", "0 0 15px rgba(0,0,0,0.3)")
                .style("text-align", "center");
            modal.append("h3")
                .text("¿Eliminar Mascota?")
                .style("margin-bottom", "10px")
                .style("color", "#dc3545");
            modal.append("p")
                .text(`¿Estás seguro de que deseas eliminar a "${mascota.Nombre}"?`)
                .style("margin-bottom", "20px")
                .style("color", "#333");
            // Botones
            const botones = modal.append("div").style("display", "flex").style("justify-content", "space-around");
            // Confirmar
            botones.append("button")
                .text("Sí, eliminar")
                .style("background-color", "#dc3545")
                .style("color", "white")
                .style("padding", "10px 15px")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => {
                fetch("http://localhost:50587/Mascotas.svc/eliminarmascota", {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ mascota: { Id: mascota.Id } })
                })
                    .then(response => {
                    if (!response.ok)
                        throw new Error("Error al eliminar la mascota");
                    return response.json();
                })
                    .then(resultado => {
                    if (resultado.EliminarMascotaResult === true) {
                        alert("Mascota eliminada exitosamente");
                        this.CargarMascotas();
                    }
                    else {
                        alert("No se pudo eliminar la mascota");
                    }
                })
                    .catch(error => {
                    console.error("Error al eliminar mascota:", error);
                    alert("Hubo un error al eliminar la mascota");
                });
                overlay.remove(); // <- y también aquí
            });
            // Cancelar
            botones.append("button")
                .text("Cancelar")
                .style("background-color", "#6c757d")
                .style("color", "white")
                .style("padding", "10px 15px")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => overlay.remove());
        }
        agregarMascota() {
            // Crear modal contenedor
            const modal = d3.select("body")
                .append("div")
                .attr("id", "modal-agregar")
                .style("position", "fixed")
                .style("top", "0")
                .style("left", "0")
                .style("width", "100%")
                .style("height", "100%")
                .style("background-color", "rgba(0,0,0,0.6)")
                .style("display", "flex")
                .style("justify-content", "center")
                .style("align-items", "center")
                .style("z-index", "1000");
            const form = modal.append("div")
                .style("background", "white")
                .style("padding", "20px")
                .style("border-radius", "10px")
                .style("width", "400px")
                .style("box-shadow", "0 0 10px rgba(0,0,0,0.3)");
            const campos = [
                { nombre: "Nombre", tipo: "text" },
                { nombre: "Edad", tipo: "number" },
                { nombre: "Especie", tipo: "text" },
                { nombre: "Raza", tipo: "text" },
                { nombre: "Peso", tipo: "number", paso: "0.01" },
                { nombre: "Sexo", tipo: "text" },
                { nombre: "IdUsuario", tipo: "number" }
            ];
            campos.forEach(campo => {
                form.append("label").text(campo.nombre).style("display", "block").style("margin-top", "10px");
                form.append("input")
                    .attr("type", campo.tipo)
                    .attr("name", campo.nombre)
                    .attr("step", campo.paso || null)
                    .style("width", "100%")
                    .style("padding", "5px")
                    .style("margin-top", "5px");
            });
            form.append("button")
                .text("Guardar")
                .style("margin-top", "20px")
                .style("padding", "10px")
                .style("background-color", "#28a745")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => __awaiter(this, void 0, void 0, function* () {
                const inputs = {};
                form.selectAll("input").each(function () {
                    const input = d3.select(this);
                    const nombre = input.attr("name");
                    const valor = input.property("value");
                    inputs[nombre] = nombre === "Edad" || nombre === "Peso" || nombre === "IdUsuario" ? Number(valor) : valor;
                });
                const mascota = {
                    Nombre: inputs.Nombre,
                    Edad: inputs.Edad,
                    Especie: inputs.Especie,
                    Raza: inputs.Raza,
                    Peso: inputs.Peso,
                    Sexo: inputs.Sexo,
                    IdUsuario: inputs.IdUsuario
                };
                try {
                    const respuesta = yield fetch("http://localhost:50587/Mascotas.svc/agregarmascota", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ mascota }) // ¡esto es importante para WCF!
                    });
                    if (respuesta.ok) {
                        alert("Mascota agregada correctamente");
                        this.CargarMascotas(); // recargar la tabla
                    }
                    else {
                        alert("Error al agregar mascota");
                    }
                }
                catch (error) {
                    console.error("Error al enviar mascota:", error);
                    alert("Error al enviar mascota");
                }
                modal.remove(); // cerrar modal
            }));
            // Botón cancelar
            form.append("button")
                .text("Cancelar")
                .style("margin-left", "10px")
                .style("padding", "10px")
                .style("background-color", "#dc3545")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => modal.remove());
        }
    }
    N_Mascotas.Cls_Mascotas = Cls_Mascotas;
})(N_Mascotas || (N_Mascotas = {}));
let I_Mascotas = new N_Mascotas.Cls_Mascotas();
//# sourceMappingURL=mascotas.js.map