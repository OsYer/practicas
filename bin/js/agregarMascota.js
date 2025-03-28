var N_Mascotas;
(function (N_Mascotas) {
    function agregarMascota(onGuardar) {
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
            .on("click", () => {
            const inputs = {};
            form.selectAll("input").each(function () {
                const input = d3.select(this);
                const nombre = input.attr("name");
                const valor = input.property("value");
                inputs[nombre] = nombre === "Edad" || nombre === "Peso" || nombre === "IdUsuario" ? Number(valor) : valor;
            });
            const nueva = Object.assign({ Id: 0, FechaRegistro: new Date().toISOString() }, inputs);
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
    N_Mascotas.agregarMascota = agregarMascota;
})(N_Mascotas || (N_Mascotas = {}));
//# sourceMappingURL=agregarMascota.js.map