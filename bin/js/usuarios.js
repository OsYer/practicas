var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var N_Usuarios;
(function (N_Usuarios) {
    class Cls_Usuarios {
        constructor() {
            this.usuarios = new Map();
            this.formatoFecha = d3.timeFormat("%d/%m/%Y %I:%M %p");
            this.UI_CrearVentana();
        }
        cargarUsuarios() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch("js/usuarios.json");
                    const data = yield response.json();
                    data.forEach(usuario => {
                        usuario.fechaRegistro = this.formatearFecha(usuario.fechaRegistro);
                        this.usuarios.set(usuario.id, usuario);
                    });
                    this.actualizarTabla();
                }
                catch (error) {
                    console.error("Error al cargar los datos:", error);
                }
            });
        }
        eliminarUsuario(id) {
            if (confirm("¿Seguro que deseas eliminar este usuario?")) {
                this.usuarios.delete(id);
                this.actualizarTabla();
            }
        }
        filtrarUsuarios(texto) {
            const textoBusqueda = texto.toLowerCase();
            const usuariosFiltrados = Array.from(this.usuarios.values()).filter(usuario => usuario.nombre.toLowerCase().includes(textoBusqueda) ||
                usuario.apellidoPaterno.toLowerCase().includes(textoBusqueda) ||
                usuario.apellidoMaterno.toLowerCase().includes(textoBusqueda) ||
                usuario.correo.toLowerCase().includes(textoBusqueda) ||
                usuario.estado.toLowerCase().includes(textoBusqueda));
            this.actualizarTabla(usuariosFiltrados);
        }
        formatearFecha(fecha) {
            const fechaObjeto = new Date(fecha);
            return this.formatoFecha(fechaObjeto);
        }
        UI_CrearVentana() {
            this.ventana = d3.select("#ventana-usuarios");
            if (!this.ventana.empty()) {
                return;
            }
            this.ventana = d3.select("body")
                .append("div")
                .attr("id", "ventana-usuarios")
                .attr("class", "ventana")
                .style("position", "fixed")
                .style("top", "50%")
                .style("left", "50%")
                .style("transform", "translate(-50%, -50%)")
                .style("width", "90%")
                .style("max-width", "800px")
                .style("max-height", "80vh")
                .style("overflow", "auto")
                .style("background", "#ffffff")
                .style("border", "1px solid #ccc")
                .style("border-radius", "12px")
                .style("box-shadow", "0px 8px 16px rgba(0,0,0,0.3)")
                .style("padding", "20px")
                .style("z-index", "1000")
                .style("text-align", "center");
            this.ventana.append("button")
                .text("✖")
                .style("position", "absolute")
                .style("top", "10px")
                .style("right", "10px")
                .style("border", "none")
                .style("background", "transparent")
                .style("font-size", "20px")
                .style("color", "#333")
                .style("cursor", "pointer")
                .style("transition", "0.3s")
                .on("mouseover", function () { d3.select(this).style("color", "red"); })
                .on("mouseout", function () { d3.select(this).style("color", "#333"); })
                .on("click", () => this.ventana.style("display", "none"));
            this.ventana.append("h2")
                .text("Lista de Usuarios")
                .style("font-size", "clamp(18px, 4vw, 24px)")
                .style("margin-bottom", "15px")
                .style("color", "#333")
                .style("text-align", "center");
            const inputContainer = this.ventana.append("div")
                .style("display", "grid")
                .style("gap", "10px")
                .style("grid-template-columns", "1fr 1fr")
                .style("margin-bottom", "15px").style("width", "100%");
            ;
            inputContainer.append("label")
                .text("Nombre:").style("grid-column", "1");
            this.inputNombre = inputContainer.append("input")
                .attr("type", "text")
                .attr("class", "input-estilizado").style("grid-column", "2");
            inputContainer.append("label").text("Apellido Paterno:").style("grid-column", "1");
            this.inputApellidoPaterno = inputContainer.append("input")
                .attr("type", "text")
                .attr("class", "input-estilizado").style("grid-column", "2");
            inputContainer.append("label").text("Apellido Materno:").style("grid-column", "1");
            this.inputApellidoMaterno = inputContainer.append("input")
                .attr("type", "text")
                .attr("class", "input-estilizado").style("grid-column", "2");
            inputContainer.append("label").text("Edad:").style("grid-column", "1");
            this.inputEdad = inputContainer.append("input")
                .attr("type", "number")
                .attr("class", "input-estilizado").style("grid-column", "2");
            inputContainer.append("label").text("Correo:").style("grid-column", "1");
            this.inputCorreo = inputContainer.append("input")
                .attr("type", "email")
                .attr("class", "input-estilizado").style("grid-column", "2");
            inputContainer.append("label").text("Estado:").style("grid-column", "1");
            this.inputEstado = inputContainer.append("select")
                .attr("class", "input-estilizado").style("grid-column", "2");
            this.inputEstado.selectAll("option")
                .data(["Activo", "Inactivo", "Pendiente"])
                .enter()
                .append("option")
                .text(d => d);
            d3.selectAll(".input-estilizado")
                .style("width", "100%")
                .style("padding", "8px")
                .style("font-size", "14px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "6px")
                .style("outline", "none")
                .style("transition", "border-color 0.3s, box-shadow 0.3s");
            this.ventana.append("button")
                .text("Agregar Usuario")
                .on("click", () => this.agregarUsuario());
            const searchContainer = this.ventana.append("div")
                .style("margin-bottom", "15px");
            searchContainer.append("label")
                .text("Buscar: ")
                .style("margin-right", "5px");
            const inputBusqueda = searchContainer.append("input")
                .attr("type", "text")
                .attr("placeholder", "Buscar por nombre, correo, estado...")
                .attr("class", "input-estilizado")
                .style("width", "80%")
                .style("padding", "8px");
            inputBusqueda.on("keyup", () => this.filtrarUsuarios(inputBusqueda.property("value")));
            this.ventana.append("div")
                .attr("id", "tabla-usuarios")
                .style("padding", "10px")
                .style("max-height", "55vh")
                .style("overflow-y", "auto")
                .style("border", "1px solid #ddd")
                .style("border-radius", "8px");
            this.cargarUsuarios();
        }
        agregarUsuario() {
            const nuevoUsuario = {
                id: this.usuarios.size + 1,
                nombre: this.inputNombre.property("value"),
                apellidoPaterno: this.inputApellidoPaterno.property("value"),
                apellidoMaterno: this.inputApellidoMaterno.property("value"),
                edad: Number(this.inputEdad.property("value")),
                correo: this.inputCorreo.property("value"),
                estado: this.inputEstado.property("value"),
                fechaRegistro: this.formatoFecha(new Date())
            };
            if (!nuevoUsuario.nombre || !nuevoUsuario.correo) {
                alert("Nombre y correo son obligatorios.");
                return;
            }
            this.usuarios.set(nuevoUsuario.id, nuevoUsuario);
            this.actualizarTabla();
            this.inputNombre.property("value", "");
            this.inputApellidoPaterno.property("value", "");
            this.inputApellidoMaterno.property("value", "");
            this.inputEdad.property("value", "");
            this.inputCorreo.property("value", "");
        }
        actualizarTabla(usuariosFiltrados) {
            const contenedorTabla = d3.select("#tabla-usuarios");
            contenedorTabla.html("");
            const tabla = contenedorTabla.append("table")
                .attr("border", "1")
                .style("width", "100%").style("max-width", "100%")
                .style("table-layout", "fixed")
                .style("word-wrap", "break-word")
                .style("border-collapse", "collapse")
                .style("background", "#fff");
            const encabezados = ["ID", "Nombre", "A. Paterno", "A. Materno", "Edad", "Correo", "Estado", "Registro", "Acciones"];
            tabla.append("thead").append("tr").selectAll("th")
                .data(encabezados)
                .enter()
                .append("th")
                .text(d => d)
                .style("background", "#f4f4f4")
                .style("padding", "12px")
                .style("border", "1px solid #ddd")
                .style("font-weight", "bold")
                .style("text-align", "center");
            const tbody = tabla.append("tbody");
            const usuariosArray = usuariosFiltrados || Array.from(this.usuarios.values());
            const filas = tbody.selectAll("tr").data(usuariosArray).enter().append("tr")
                .style("border-bottom", "1px solid #ddd");
            filas.selectAll("td")
                .data(d => [
                d.id,
                d.nombre,
                d.apellidoPaterno,
                d.apellidoMaterno,
                d.edad,
                d.correo,
                d.estado,
                d.fechaRegistro
            ])
                .enter()
                .append("td")
                .text(d => String(d));
            const acciones = filas.append("td");
            acciones.append("button")
                .text("Editar")
                .style("margin-right", "5px")
                .style("padding", "5px 10px")
                .style("background", "#0000FF")
                .style("color", "#fff")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", (event, d) => this.editarUsuario(d.id));
            acciones.append("button")
                .text("Eliminar")
                .style("padding", "5px 10px")
                .style("background", "#ff4d4d")
                .style("color", "#fff")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", (event, d) => this.eliminarUsuario(d.id));
        }
        editarUsuario(id) {
            const usuario = this.usuarios.get(id);
            if (!usuario)
                return;
            new N_Usuarios.Cls_EditarUsuario(usuario, (usuarioEditado) => {
                this.usuarios.set(usuarioEditado.id, usuarioEditado);
                this.actualizarTabla();
            });
        }
    }
    N_Usuarios.Cls_Usuarios = Cls_Usuarios;
})(N_Usuarios || (N_Usuarios = {}));
//# sourceMappingURL=usuarios.js.map