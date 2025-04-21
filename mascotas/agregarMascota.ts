namespace Nm_Mascotas {
  export class agregarMascota {
    private modal!: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    private resolveGuardado!: (nueva: Mascota | null) => void;
    private campos!: {
      inputNombre: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      inputEspecie: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      inputRaza: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      inputEdad: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      inputPeso: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      selectSexo: d3.Selection<HTMLSelectElement, unknown, HTMLElement, any>;
      inputIdUsuario: d3.Selection<HTMLSelectElement, unknown, HTMLElement, any>;
    };

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

    private construirFormulario(): void {
      this.modal.append("div")
        .style("display", "flex")
        .style("justify-content", "space-between")
        .style("align-items", "center")
        .append("h3")
        .text("Agregar Mascota");

      this.modal.select("div")
        .append("button")
        .text("❌")
        .style("background", "none")
        .style("border", "none")
        .style("font-size", "20px")
        .style("cursor", "pointer")
        .on("click", () => {
          this.ocultar();
          this.resolveGuardado(null);
        });

      const form = this.modal.append("form").attr("id", "form-agregar");

      const campoNombre = form.append("label").text("Nombre:");
      const inputNombre = campoNombre.append("input").attr("type", "text");

      const campoEspecie = form.append("label").text("Especie:");
      const inputEspecie = campoEspecie.append("input").attr("type", "text");

      const campoRaza = form.append("label").text("Raza:");
      const inputRaza = campoRaza.append("input").attr("type", "text");

      const campoEdad = form.append("label").text("Edad:");
      const inputEdad = campoEdad.append("input").attr("type", "number");

      const campoPeso = form.append("label").text("Peso:");
      const inputPeso = campoPeso.append("input").attr("type", "number").attr("step", "0.01");

      const campoSexo = form.append("label").text("Sexo:");
      const selectSexo = campoSexo.append("select");
      selectSexo.append("option").attr("value", "hembra").text("Hembra");
      selectSexo.append("option").attr("value", "macho").text("Macho");

      const labelUsuario = form.append("label").text("Usuario:");
      const selectIdUsuario = labelUsuario.append("select");

      Nm_Mascotas.cargarUsuarios().then(() => {
        selectIdUsuario.selectAll("option")
          .data(Nm_Mascotas.UsuariosActivos)
          .enter()
          .append("option")
          .attr("value", d => d.Id)
          .text(d => `${d.Nombre} (${d.Correo})`);
      });

      // Aplicar estilos a labels y campos
      form.selectAll("label")
        .style("display", "block")
        .style("margin-top", "10px")
        .style("font-weight", "bold");

      form.selectAll("input, select")
        .style("width", "100%")
        .style("padding", "8px")
        .style("margin-top", "4px")
        .style("border", "1px solid #ccc")
        .style("border-radius", "4px")
        .style("box-sizing", "border-box");

      const btnGroup = form.append("div")
        .style("margin-top", "20px")
        .style("text-align", "right");

      btnGroup.append("button")
        .text("Guardar")
        .attr("type", "submit")
        .style("margin-right", "10px")
        .style("padding", "8px 16px")
        .style("background-color", "#28a745")
        .style("color", "white");

      btnGroup.append("button")
        .text("Cancelar")
        .attr("type", "button")
        .style("padding", "8px 16px")
        .style("background-color", "#dc3545")
        .style("color", "white")
        .on("click", () => {
          this.ocultar();
          this.resolveGuardado(null);
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
        event.preventDefault();

        const nuevaMascota: Mascota = {
          Id: 0,
          Nombre: this.campos.inputNombre.property("value")?.trim(),
          Especie: this.campos.inputEspecie.property("value")?.trim(),
          Raza: this.campos.inputRaza.property("value")?.trim(),
          Edad: parseInt(this.campos.inputEdad.property("value")),
          Peso: parseFloat(this.campos.inputPeso.property("value")),
          Sexo: this.campos.selectSexo.property("value"),
          IdUsuario: parseInt(this.campos.inputIdUsuario.property("value")),
        };

        this.resolveGuardado(nuevaMascota);

        console.log("📦 Enviando a API:", JSON.stringify(nuevaMascota));

        fetch(Nm_Mascotas.URL_BASE + "/ServicioMascotas.svc/AgregarMascota", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(nuevaMascota),
        })
          .then((res) => res.json())
          .then((respuesta) => {
            if (respuesta.Exito) {
              alert("✅ Mascota registrada");
              this.resolveGuardado(nuevaMascota);
            } else {
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

    mostrar(): Promise<Mascota | null> {
      d3.select("#modal-agregar").style("display", "block");
      return new Promise((resolve) => {
        this.resolveGuardado = resolve;
      });
    }

    ocultar(): void {
      d3.select("#modal-agregar").style("display", "none");
    }
  }
}
