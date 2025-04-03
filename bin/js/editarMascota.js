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
    class FormularioEditarMascota {
        constructor(mascota, onGuardar) {
            this.url = "http://192.168.15.225:8080/Usuarios.svc";
            this.mascota = mascota;
            this.onGuardar = onGuardar;
            this.init();
        }
        init() {
            return __awaiter(this, void 0, void 0, function* () {
                const usuarios = yield this.obtenerUsuarios();
                this.crearFormulario(usuarios);
            });
        }
        obtenerUsuarios() {
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const response = yield fetch(`${this.url}/obtenerusuarios`, {
                        method: "GET",
                        headers: { "Content-Type": "application/json" },
                    });
                    if (!response.ok)
                        throw new Error(`Error al obtener usuarios: ${response.status}`);
                    const data = yield response.json();
                    return data.ObtenerUsuariosResult || [];
                }
                catch (error) {
                    console.error("Error al cargar usuarios:", error);
                    return [];
                }
            });
        }
        crearFormulario(usuarios) {
            const modal = d3
                .select("body")
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
            const form = modal
                .append("div")
                .style("background", "white")
                .style("padding", "20px")
                .style("border-radius", "10px")
                .style("width", "400px")
                .style("box-shadow", "0 0 10px rgba(0,0,0,0.3)");
            form
                .append("h2")
                .text("Editar Mascota")
                .style("margin-bottom", "15px")
                .style("color", "#333")
                .style("text-align", "center");
            form
                .append("label")
                .text("Nombre")
                .style("display", "block")
                .style("margin-top", "10px");
            this.inputNombre = form
                .append("input")
                .attr("type", "text")
                .property("value", this.mascota.Nombre)
                .style("width", "100%")
                .style("padding", "5px");
            form
                .append("label")
                .text("Edad")
                .style("display", "block")
                .style("margin-top", "10px");
            this.inputEdad = form
                .append("input")
                .attr("type", "number")
                .property("value", this.mascota.Edad)
                .style("width", "100%")
                .style("padding", "5px");
            form
                .append("label")
                .text("Especie")
                .style("display", "block")
                .style("margin-top", "10px");
            this.inputEspecie = form
                .append("input")
                .attr("type", "text")
                .property("value", this.mascota.Especie)
                .style("width", "100%")
                .style("padding", "5px");
            form
                .append("label")
                .text("Raza")
                .style("display", "block")
                .style("margin-top", "10px");
            this.inputRaza = form
                .append("input")
                .attr("type", "text")
                .property("value", this.mascota.Raza)
                .style("width", "100%")
                .style("padding", "5px");
            form
                .append("label")
                .text("Peso")
                .style("display", "block")
                .style("margin-top", "10px");
            this.inputPeso = form
                .append("input")
                .attr("type", "number")
                .attr("step", "0.01")
                .property("value", this.mascota.Peso)
                .style("width", "100%")
                .style("padding", "5px");
            form
                .append("label")
                .text("Sexo")
                .style("display", "block")
                .style("margin-top", "10px");
            this.selectSexo = form
                .append("select")
                .style("width", "100%")
                .style("padding", "5px");
            this.selectSexo
                .append("option")
                .attr("value", "H")
                .text("Hembra")
                .property("selected", this.mascota.Sexo === "H");
            this.selectSexo
                .append("option")
                .attr("value", "M")
                .text("Macho")
                .property("selected", this.mascota.Sexo === "M");
            form
                .append("label")
                .text("Usuario")
                .style("display", "block")
                .style("margin-top", "10px");
            this.selectUsuario = form
                .append("select")
                .style("width", "100%")
                .style("padding", "5px");
            usuarios.forEach((usuario) => {
                this.selectUsuario
                    .append("option")
                    .attr("value", usuario.Id)
                    .text(usuario.Nombre)
                    .property("selected", usuario.Id === this.mascota.IdUsuario);
            });
            form
                .append("button")
                .text("Guardar")
                .style("margin-top", "20px")
                .style("padding", "10px")
                .style("background-color", "#007bff")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => {
                const actualizada = {
                    Id: this.mascota.Id,
                    Nombre: this.inputNombre.property("value"),
                    Edad: Number(this.inputEdad.property("value")),
                    Especie: this.inputEspecie.property("value"),
                    Raza: this.inputRaza.property("value"),
                    Peso: Number(this.inputPeso.property("value")),
                    Sexo: this.selectSexo.property("value"),
                    IdUsuario: Number(this.selectUsuario.property("value")),
                };
                this.onGuardar(actualizada);
                modal.remove();
            });
            form
                .append("button")
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
    N_Mascotas.FormularioEditarMascota = FormularioEditarMascota;
})(N_Mascotas || (N_Mascotas = {}));
//# sourceMappingURL=editarMascota.js.map