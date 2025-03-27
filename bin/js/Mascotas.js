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
                .style("background-color", "#6a11cb")
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
            alert(`Editar mascota: ${mascota.Nombre}`);
            // Lógica para editar la mascota aquí
        }
        eliminarMascota(mascota) {
            alert(`Eliminar mascota: ${mascota.Nombre}`);
            // Lógica para eliminar la mascota aquí
        }
        agregarMascota() {
            alert("Agregar nueva mascota");
            // Lógica para agregar una nueva mascota aquí
        }
    }
    N_Mascotas.Cls_Mascotas = Cls_Mascotas;
})(N_Mascotas || (N_Mascotas = {}));
let I_Mascotas = new N_Mascotas.Cls_Mascotas();
//# sourceMappingURL=mascotas.js.map