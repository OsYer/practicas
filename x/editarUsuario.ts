namespace N_Usuarios {
    export class Cls_EditarUsuario {
        private ventanaEdicion: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
        private usuario: Usuario;
        private callbackGuardar: (usuario: Usuario) => void;

        private inputNombre: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private inputApellidoPaterno: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private inputApellidoMaterno: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private inputEdad: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private inputCorreo: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private inputEstado: d3.Selection<HTMLSelectElement, unknown, HTMLElement, any>;

        constructor(usuario: Usuario, callbackGuardar: (usuario: Usuario) => void) {
            this.usuario = usuario;
            this.callbackGuardar = callbackGuardar;
            this.crearVentanaEdicion();
        }

        private crearVentanaEdicion(): void {
            d3.select("#ventana-edicion").remove();

            this.ventanaEdicion = d3.select("body")
                .append("div")
                .attr("id", "ventana-edicion")
                .attr("class", "ventana-edicion")
                .style("position", "fixed")
                .style("top", "50%")
                .style("left", "50%")
                .style("transform", "translate(-50%, -50%)")
                .style("width", "400px")
                .style("background", "#fff")
                .style("border", "1px solid #ccc")
                .style("border-radius", "10px")
                .style("box-shadow", "0px 8px 16px rgba(0,0,0,0.3)")
                .style("padding", "20px")
                .style("z-index", "1001");

            this.ventanaEdicion.append("h2").text("Editar Usuario");

            this.crearFormulario();

            this.ventanaEdicion.append("button")
                .text("Guardar Cambios")
                .style("margin-top", "10px")
                .style("padding", "10px")
                .style("background", "#28a745")
                .style("color", "#fff")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => this.guardarCambios());

            this.ventanaEdicion.append("button")
                .text("Cancelar")
                .style("margin-left", "10px")
                .style("padding", "10px")
                .style("background", "#dc3545")
                .style("color", "#fff")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => this.ventanaEdicion.remove());
        }

        private crearFormulario(): void {
            const form = this.ventanaEdicion.append("div")
                .style("display", "grid")
                .style("gap", "10px");

            form.append("label").text("Nombre:");
            this.inputNombre = form.append("input")
                .attr("type", "text")
                .property("value", this.usuario.nombre);

            form.append("label").text("Apellido Paterno:");
            this.inputApellidoPaterno = form.append("input")
                .attr("type", "text")
                .property("value", this.usuario.apellidoPaterno);

            form.append("label").text("Apellido Materno:");
            this.inputApellidoMaterno = form.append("input")
                .attr("type", "text")
                .property("value", this.usuario.apellidoMaterno);

            form.append("label").text("Edad:");
            this.inputEdad = form.append("input")
                .attr("type", "number")
                .property("value", this.usuario.edad);

            form.append("label").text("Correo:");
            this.inputCorreo = form.append("input")
                .attr("type", "email")
                .property("value", this.usuario.correo);

            form.append("label").text("Estado:");
            this.inputEstado = form.append("select");

            ["Activo", "Inactivo", "Pendiente"].forEach(estado => {
                this.inputEstado.append("option")
                    .text(estado)
                    .property("selected", estado === this.usuario.estado);
            });
        }

        private guardarCambios(): void {
            this.usuario.nombre = this.inputNombre.property("value");
            this.usuario.apellidoPaterno = this.inputApellidoPaterno.property("value");
            this.usuario.apellidoMaterno = this.inputApellidoMaterno.property("value");
            this.usuario.edad = Number(this.inputEdad.property("value"));
            this.usuario.correo = this.inputCorreo.property("value");
            this.usuario.estado = this.inputEstado.property("value");

            console.log("Usuario actualizado:", this.usuario); 

            this.callbackGuardar(this.usuario); 
            this.ventanaEdicion.remove(); 
        }
    }
}
