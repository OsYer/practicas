namespace N_Mascotas {
    export class FormularioAgregarUsuario {
        private url: string = "http://192.168.15.225:8080/Usuarios.svc";
        private onUsuarioAgregado: (usuario: Usuario) => void;

        constructor(onUsuarioAgregado: (usuario: Usuario) => void) {
            this.onUsuarioAgregado = onUsuarioAgregado;
            this.crearFormulario();
        }

        private crearFormulario(): void {
            const modal = d3.select("body")
                .append("div")
                .attr("id", "modal-nuevo-usuario")
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
                .style("width", "350px")
                .style("box-shadow", "0 0 10px rgba(0,0,0,0.3)");

            form.append("h3")
                .text("Agregar Usuario")
                .style("text-align", "center")
                .style("margin-bottom", "15px");

            const inputs: { [key: string]: d3.Selection<HTMLInputElement, unknown, HTMLElement, any> } = {};

            ["Nombre", "Correo", "Telefono", "Direccion"].forEach(campo => {
                form.append("label").text(campo).style("display", "block").style("margin-top", "10px");
                inputs[campo] = form.append("input")
                    .attr("type", "text")
                    .style("width", "100%")
                    .style("padding", "5px")
                    .style("margin-top", "5px");
            });

            form.append("button")
                .text("Guardar Usuario")
                .style("margin-top", "20px")
                .style("padding", "10px")
                .style("background-color", "#007bff")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", async () => {
                    const nuevo: Usuario = {
                        Id: 0,
                        Nombre: inputs.Nombre.property("value"),
                        Correo: inputs.Correo.property("value"),
                        Telefono: inputs.Telefono.property("value"),
                        Direccion: inputs.Direccion.property("value")
                    };

                    try {
                        const response = await fetch(`${this.url}/agregarusuario`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ usuario: nuevo })
                        });

                        const result = await response.json();

                        if (result.AgregarUsuarioResult === true) {
                            // Recargar todos los usuarios para obtener el ID real
                            const usuariosResponse = await fetch(`${this.url}/obtenerusuarios`, {
                                method: "GET",
                                headers: { "Content-Type": "application/json" }
                            });

                            const usuariosData = await usuariosResponse.json();
                            const usuarios: Usuario[] = usuariosData.ObtenerUsuariosResult || [];

                            // Buscar el usuario recién insertado por nombre y correo
                            const ultimo = usuarios.find(u =>
                                u.Nombre === nuevo.Nombre &&
                                u.Correo === nuevo.Correo
                            );

                            if (ultimo) {
                                nuevo.Id = ultimo.Id;
                                this.onUsuarioAgregado(nuevo); // Actualiza el select en el formulario de mascotas
                            }

                            modal.remove();
                        } else {
                            alert("No se pudo agregar el usuario.");
                        }
                    } catch (error) {
                        console.error("Error al guardar usuario:", error);
                        alert("Ocurrió un error al guardar el usuario.");
                    }
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
