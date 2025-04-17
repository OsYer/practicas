var N_Empleados;
(function (N_Empleados) {
    class Cls_Empleados {
        constructor() {
            this.empleados = [];
            this.UI_CrearVentana();
        }
        UI_CrearVentana() {
            this.ventana = d3.select("body")
                .append("div")
                .attr("id", "ventana-empleados")
                .attr("class", "ventana")
                .style("display", "none")
                .style("position", "fixed")
                .style("top", "50%")
                .style("left", "50%")
                .style("transform", "translate(-50%, -50%)")
                .style("width", "95%")
                .style("max-width", "600px")
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
                .text("Gestión de Empleados")
                .style("font-size", "clamp(18px, 4vw, 24px)")
                .style("margin-bottom", "15px")
                .style("color", "#333");
            const contenido = this.ventana.append("div")
                .style("padding", "10px");
            contenido.append("label")
                .attr("for", "input-nombre-empleado")
                .text("Nombre: ")
                .style("font-size", "16px")
                .style("display", "block")
                .style("margin-bottom", "5px");
            this.inputNombre = contenido.append("input")
                .attr("type", "text")
                .attr("id", "input-nombre-empleado")
                .style("width", "100%")
                .style("padding", "8px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "6px")
                .style("font-size", "16px")
                .style("margin-bottom", "10px");
            contenido.append("label")
                .attr("for", "input-salario-empleado")
                .text("Salario Mensual: ")
                .style("font-size", "16px")
                .style("display", "block")
                .style("margin-bottom", "5px");
            this.inputSalarioMensual = contenido.append("input")
                .attr("type", "number")
                .attr("id", "input-salario-empleado")
                .style("width", "100%")
                .style("padding", "8px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "6px")
                .style("font-size", "16px")
                .style("margin-bottom", "10px");
            const botones = [
                { texto: "Agregar Empleado", accion: () => this.AgregarEmpleado() },
                { texto: "Calcular Sueldos Anuales", accion: () => this.CalcularSueldosAnuales() },
                { texto: "Calcular Bonos Anuales", accion: () => this.CalcularBonos() },
                { texto: "Filtrar +15,000", accion: () => this.FiltrarEmpleados() },
                { texto: "Total Sueldos", accion: () => this.CalcularTotalSueldos() }
            ];
            botones.forEach(btn => {
                contenido.append("button")
                    .text(btn.texto)
                    .style("width", "100%")
                    .style("margin-top", "10px")
                    .style("padding", "10px")
                    .style("border", "none")
                    .style("border-radius", "6px")
                    .style("background", "linear-gradient(90deg, #ff7e5f, #feb47b)")
                    .style("color", "white")
                    .style("font-size", "16px")
                    .style("cursor", "pointer")
                    .style("transition", "0.3s")
                    .on("click", btn.accion);
            });
            this.tabla = contenido.append("table")
                .attr("id", "tabla-empleados")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("border", "1px solid #000");
            this.UI_ActualizarTabla();
        }
        AgregarEmpleado() {
            const nombre = this.inputNombre.property("value");
            const salario = parseFloat(this.inputSalarioMensual.property("value"));
            if (!nombre || isNaN(salario) || salario <= 0) {
                alert("Por favor ingresa un nombre y un salario válido.");
                return;
            }
            this.empleados.push({ nombre, salarioMensual: salario });
            this.UI_ActualizarTabla();
        }
        CalcularSueldosAnuales() {
            this.empleados.forEach(emp => emp.salarioAnual = emp.salarioMensual * 12);
            this.UI_ActualizarTabla();
        }
        CalcularBonos() {
            this.empleados = this.empleados.map(emp => (Object.assign(Object.assign({}, emp), { bonoAnual: emp.salarioAnual * (emp.salarioMensual > 15000 ? 0.10 : 0.05) })));
            this.UI_ActualizarTabla();
        }
        FiltrarEmpleados() {
            this.UI_ActualizarTabla(this.empleados.filter(emp => emp.salarioMensual > 15000));
        }
        CalcularTotalSueldos() {
            const total = this.empleados.reduce((acc, emp) => acc + emp.salarioMensual, 0);
            alert(`El total de sueldos mensuales es: ${total}`);
        }
        UI_ActualizarTabla(empleados = this.empleados) {
            this.tabla.html("");
            // Encabezado de la tabla
            const thead = this.tabla.append("thead");
            const headerRow = thead.append("tr");
            ["Nombre", "Salario Mensual", "Salario Anual", "Bono Anual"].forEach(text => {
                headerRow.append("th")
                    .style("border", "2px solid black") // Bordes de encabezado
                    .style("padding", "12px")
                    .style("background", "#ff7e5f")
                    .style("color", "white")
                    .style("font-size", "18px")
                    .style("text-align", "center")
                    .text(text);
            });
            // Cuerpo de la tabla
            const tbody = this.tabla.append("tbody");
            empleados.forEach(emp => {
                var _a, _b;
                const row = tbody.append("tr");
                row.append("td")
                    .text(emp.nombre || "Sin Nombre")
                    .style("border", "2px solid black")
                    .style("padding", "10px")
                    .style("text-align", "center");
                row.append("td")
                    .text(emp.salarioMensual || "0")
                    .style("border", "2px solid black")
                    .style("padding", "10px")
                    .style("text-align", "center");
                row.append("td")
                    .text((_a = emp.salarioAnual) !== null && _a !== void 0 ? _a : "No calculado")
                    .style("border", "2px solid black")
                    .style("padding", "10px")
                    .style("text-align", "center");
                row.append("td")
                    .text((_b = emp.bonoAnual) !== null && _b !== void 0 ? _b : "No calculado")
                    .style("border", "2px solid black")
                    .style("padding", "10px")
                    .style("text-align", "center");
            });
            // Asegurar que la tabla tenga un diseño limpio
            this.tabla.style("border-collapse", "collapse")
                .style("width", "100%")
                .style("margin-top", "20px");
        }
    }
    N_Empleados.Cls_Empleados = Cls_Empleados;
})(N_Empleados || (N_Empleados = {}));
//# sourceMappingURL=empleados.js.map