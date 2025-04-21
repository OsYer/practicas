var Nm_Mascotas;
(function (Nm_Mascotas) {
    class agregarMascota {
        constructor() {
            const overlay = d3.select("body")
                .append("div")
                .attr("id", "modal-agregar")
                .style("display", "none")
                .style("position", "fixed")
                .style("top", "0")
                .style("left", "0")
                .style("width", "100vw")
                .style("height", "100vh")
                .style("background-color", "rgba(0, 0, 0, 0.5)")
                .style("z-index", "9999");
            this.modal = overlay.append("div")
                .style("position", "absolute")
                .style("top", "50%")
                .style("left", "50%")
                .style("transform", "translate(-50%, -50%)")
                .style("background-color", "#fff")
                .style("padding", "30px")
                .style("border-radius", "12px")
                .style("box-shadow", "0 10px 30px rgba(0, 0, 0, 0.4)")
                .style("width", "400px")
                .style("max-width", "90%");
            this.construirFormulario();
        }
        construirFormulario() {
            this.modal.append("h3").text("Agregar Mascota");
            const form = this.modal.append("form").attr("id", "form-agregar");
            const campoNombre = form.append("div").style("margin-top", "10px");
            campoNombre.append("label").text("Nombre:");
            const inputNombre = campoNombre.append("input").attr("type", "text");
            const campoEspecie = form.append("div").style("margin-top", "10px");
            campoEspecie.append("label").text("Especie:");
            const inputEspecie = campoEspecie.append("input").attr("type", "text");
            const campoRaza = form.append("div").style("margin-top", "10px");
            campoRaza.append("label").text("Raza:");
            const inputRaza = campoRaza.append("input").attr("type", "text");
            const campoEdad = form.append("div").style("margin-top", "10px");
            campoEdad.append("label").text("Edad:");
            const inputEdad = campoEdad.append("input").attr("type", "number");
            const campoPeso = form.append("div").style("margin-top", "10px");
            campoPeso.append("label").text("Peso:");
            const inputPeso = campoPeso.append("input").attr("type", "number").attr("step", "0.01");
            const campoSexo = form.append("div").style("margin-top", "10px");
            campoSexo.append("label").text("Sexo:");
            const selectSexo = campoSexo.append("select");
            selectSexo.append("option").attr("value", "hembra").text("Hembra");
            selectSexo.append("option").attr("value", "macho").text("Macho");
            const campoUsuario = form.append("div").style("margin-top", "10px");
            campoUsuario.append("label").text("Usuario:");
            const selectIdUsuario = campoUsuario.append("select");
            // ✅ Cargar usuarios desde variable global
            Nm_Mascotas.cargarUsuarios().then(() => {
                selectIdUsuario.selectAll("option")
                    .data(Nm_Mascotas.UsuariosActivos)
                    .enter()
                    .append("option")
                    .attr("value", d => d.Id)
                    .text(d => `${d.Nombre} (${d.Correo})`);
            });
            form.append("div")
                .style("margin-top", "20px")
                .style("text-align", "right")
                .call((btns) => {
                btns.append("button")
                    .text("Guardar")
                    .attr("type", "submit")
                    .style("margin-right", "10px")
                    .style("padding", "8px 16px")
                    .style("background-color", "#28a745")
                    .style("color", "white");
                btns.append("button")
                    .text("Cancelar")
                    .attr("type", "button")
                    .style("padding", "8px 16px")
                    .style("background-color", "#dc3545")
                    .style("color", "white")
                    .on("click", () => {
                    this.ocultar();
                    this.resolveGuardado(null);
                });
            });
            this.campos = {
                inputNombre,
                inputEspecie,
                inputRaza,
                inputEdad,
                inputPeso,
                selectSexo,
                inputIdUsuario: selectIdUsuario,
            };
            form.on("submit", (event) => {
                var _a, _b, _c;
                event.preventDefault();
                const nuevaMascota = {
                    Id: 0,
                    Nombre: (_a = this.campos.inputNombre.property("value")) === null || _a === void 0 ? void 0 : _a.trim(),
                    Especie: (_b = this.campos.inputEspecie.property("value")) === null || _b === void 0 ? void 0 : _b.trim(),
                    Raza: (_c = this.campos.inputRaza.property("value")) === null || _c === void 0 ? void 0 : _c.trim(),
                    Edad: parseInt(this.campos.inputEdad.property("value")),
                    Peso: parseFloat(this.campos.inputPeso.property("value")),
                    Sexo: this.campos.selectSexo.property("value"),
                    IdUsuario: parseInt(this.campos.inputIdUsuario.property("value")),
                };
                this.resolveGuardado(nuevaMascota);
                console.log("📦 Enviando a API:", JSON.stringify(nuevaMascota));
                fetch("http://localhost:63166/ServicioMascotas.svc/AgregarMascota", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(nuevaMascota),
                })
                    .then((res) => res.json())
                    .then((respuesta) => {
                    if (respuesta.Exito) {
                        alert("✅ Mascota registrada");
                        this.resolveGuardado(nuevaMascota);
                    }
                    else {
                        alert("❌ " + respuesta.Mensaje);
                        this.resolveGuardado(null);
                    }
                    this.ocultar();
                })
                    .catch((err) => {
                    console.error("❌ Error en el fetch:", err);
                    this.resolveGuardado(null);
                    this.ocultar();
                });
            });
        }
        mostrar() {
            d3.select("#modal-agregar").style("display", "block");
            return new Promise((resolve) => {
                this.resolveGuardado = resolve;
            });
        }
        ocultar() {
            d3.select("#modal-agregar").style("display", "none");
        }
    }
    Nm_Mascotas.agregarMascota = agregarMascota;
})(Nm_Mascotas || (Nm_Mascotas = {}));
//# sourceMappingURL=agregarMascota.js.map