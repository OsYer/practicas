namespace N_Mascotas {
    export function agregarMascota(onGuardar: (nueva: Mascota) => void): void {
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

        // Encabezado
        form.append("h3")
            .text("Agregar Mascota")
            .style("margin-bottom", "15px")
            .style("color", "#333")
            .style("text-align", "center");

        // Campo: Nombre
        form.append("label").text("Nombre").style("display", "block").style("margin-top", "10px");
        form.append("input")
            .attr("type", "text")
            .attr("name", "Nombre")
            .style("width", "100%")
            .style("padding", "5px")
            .style("margin-top", "5px");

        // Campo: Edad
        form.append("label").text("Edad").style("display", "block").style("margin-top", "10px");
        form.append("input")
            .attr("type", "number")
            .attr("name", "Edad")
            .style("width", "100%")
            .style("padding", "5px")
            .style("margin-top", "5px");

        // Campo: Especie
        form.append("label").text("Especie").style("display", "block").style("margin-top", "10px");
        form.append("input")
            .attr("type", "text")
            .attr("name", "Especie")
            .style("width", "100%")
            .style("padding", "5px")
            .style("margin-top", "5px");

        // Campo: Raza
        form.append("label").text("Raza").style("display", "block").style("margin-top", "10px");
        form.append("input")
            .attr("type", "text")
            .attr("name", "Raza")
            .style("width", "100%")
            .style("padding", "5px")
            .style("margin-top", "5px");

        // Campo: Peso
        form.append("label").text("Peso").style("display", "block").style("margin-top", "10px");
        form.append("input")
            .attr("type", "number")
            .attr("step", "0.01")
            .attr("name", "Peso")
            .style("width", "100%")
            .style("padding", "5px")
            .style("margin-top", "5px");

        // Campo: Sexo (con <select>)
        form.append("label").text("Sexo").style("display", "block").style("margin-top", "10px");
        const sexoSelect = form.append("select")
            .attr("name", "Sexo")
            .style("width", "100%")
            .style("padding", "5px")
            .style("margin-top", "5px");

        sexoSelect.append("option").attr("value", "H").text("Hembra");
        sexoSelect.append("option").attr("value", "M").text("Macho");

        // Campo: IdUsuario
        form.append("label").text("IdUsuario").style("display", "block").style("margin-top", "10px");
        form.append("input")
            .attr("type", "number")
            .attr("name", "IdUsuario")
            .style("width", "100%")
            .style("padding", "5px")
            .style("margin-top", "5px");

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
                const inputs: any = {};
                form.selectAll("input, select").each(function () {
                    const input = d3.select(this);
                    const nombre = input.attr("name");
                    const valor = input.property("value");
                    inputs[nombre] = nombre === "Edad" || nombre === "Peso" || nombre === "IdUsuario"
                        ? Number(valor)
                        : valor;
                });

                const nueva: Mascota = {
                    Id: 0,
                    ...inputs
                };

                onGuardar(nueva);
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
