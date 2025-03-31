namespace N_Mascotas {
    export interface Usuario {
        Id: number;
        Nombre: string;
        Correo: string;
        Telefono: string;
        Direccion: string;
        FechaRegistro?: string;
    }

    export class FormularioAgregarMascota {
        private onGuardar: (nueva: Mascota) => void;
        private url: string = "http://192.168.15.225:8080/Usuarios.svc";
        private inputNombre!: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private inputEdad!: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private inputEspecie!: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private inputRaza!: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private inputPeso!: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private selectSexo!: d3.Selection<HTMLSelectElement, unknown, HTMLElement, any>;
        private selectUsuario!: d3.Selection<HTMLSelectElement, unknown, HTMLElement, any>;

        constructor(onGuardar: (nueva: Mascota) => void) {
            this.onGuardar = onGuardar;
            this.init();
        }

        private async init(): Promise<void> {
            const usuarios = await this.obtenerUsuarios();
            this.crearFormulario(usuarios);
        }

        private async obtenerUsuarios(): Promise<Usuario[]> {
            try {
                const response = await fetch(`${this.url}/obtenerusuarios`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" }
                });

                if (!response.ok) {
                    throw new Error(`Error al obtener usuarios: ${response.status}`);
                }

                const data = await response.json();
                return data.ObtenerUsuariosResult || [];
            } catch (error) {
                console.error("Error al cargar usuarios:", error);
                return [];
            }
        }

        private crearFormulario(usuarios: Usuario[]): void {
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

            form.append("h3")
                .text("Agregar Mascota")
                .style("margin-bottom", "15px")
                .style("color", "#333")
                .style("text-align", "center");

            form.append("label").text("Nombre").style("display", "block").style("margin-top", "10px");
            this.inputNombre = form.append("input")
                .attr("type", "text")
                .style("width", "100%")
                .style("padding", "5px")
                .style("margin-top", "5px");

            form.append("label").text("Edad").style("display", "block").style("margin-top", "10px");
            this.inputEdad = form.append("input")
                .attr("type", "number")
                .style("width", "100%")
                .style("padding", "5px")
                .style("margin-top", "5px");

            form.append("label").text("Especie").style("display", "block").style("margin-top", "10px");
            this.inputEspecie = form.append("input")
                .attr("type", "text")
                .style("width", "100%")
                .style("padding", "5px")
                .style("margin-top", "5px");

            form.append("label").text("Raza").style("display", "block").style("margin-top", "10px");
            this.inputRaza = form.append("input")
                .attr("type", "text")
                .style("width", "100%")
                .style("padding", "5px")
                .style("margin-top", "5px");

            form.append("label").text("Peso").style("display", "block").style("margin-top", "10px");
            this.inputPeso = form.append("input")
                .attr("type", "number")
                .attr("step", "0.01")
                .style("width", "100%")
                .style("padding", "5px")
                .style("margin-top", "5px");

            form.append("label").text("Sexo").style("display", "block").style("margin-top", "10px");
            this.selectSexo = form.append("select")
                .style("width", "100%")
                .style("padding", "5px")
                .style("margin-top", "5px");

            this.selectSexo.append("option").attr("value", "H").text("Hembra");
            this.selectSexo.append("option").attr("value", "M").text("Macho");

            // Campo Usuario con ícono de +
            form.append("label").text("Usuario").style("display", "block").style("margin-top", "10px");

            const contenedorUsuario = form.append("div")
                .style("display", "flex")
                .style("align-items", "center")
                .style("gap", "10px")
                .style("margin-top", "5px");

            this.selectUsuario = contenedorUsuario.append("select")
                .style("flex", "1")
                .style("padding", "5px");

            usuarios.forEach(usuario => {
                this.selectUsuario.append("option")
                    .attr("value", usuario.Id)
                    .text(usuario.Nombre);
            });

            const btnAgregarUsuario = contenedorUsuario.append("div")
                .style("width", "20px")
                .style("height", "20px")
                .style("cursor", "pointer")
                .attr("title", "Agregar nuevo usuario");

            const svg = btnAgregarUsuario.append("svg")
                .attr("width", 20)
                .attr("height", 20)
                .attr("viewBox", "0 0 20 20");

            svg.append("rect")
                .attr("x", 9)
                .attr("y", 2)
                .attr("width", 2)
                .attr("height", 16)
                .attr("fill", "#007bff");

            svg.append("rect")
                .attr("x", 2)
                .attr("y", 9)
                .attr("width", 16)
                .attr("height", 2)
                .attr("fill", "#007bff");

                btnAgregarUsuario.on("click", () => {
                    new N_Mascotas.FormularioAgregarUsuario((nuevoUsuario: Usuario) => {
                        this.selectUsuario.append("option")
                            .attr("value", nuevoUsuario.Id)
                            .text(nuevoUsuario.Nombre)
                            .property("selected", true);
                    });
                });
                

            // Botón Guardar
            form.append("button")
                .text("Guardar")
                .style("margin-top", "20px")
                .style("padding", "10px")
                .style("background-color", "#28a745")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => {
                    const nueva: Mascota = {
                        Id: 0,
                        Nombre: this.inputNombre.property("value"),
                        Edad: Number(this.inputEdad.property("value")),
                        Especie: this.inputEspecie.property("value"),
                        Raza: this.inputRaza.property("value"),
                        Peso: Number(this.inputPeso.property("value")),
                        Sexo: this.selectSexo.property("value"),
                        IdUsuario: Number(this.selectUsuario.property("value")),
                    };

                    this.onGuardar(nueva);
                    modal.remove();
                });

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
}
