namespace Nm_Mascotas {
  export class editarMascota {
    private modal!: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
    private mascotaOriginal!: Mascota;
    private resolveGuardado!: (actualizada: Mascota | null) => void;
    private campos!: {
      inputNombre: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      inputEspecie: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      inputRaza: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      inputEdad: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      inputPeso: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      inputSexo: d3.Selection<HTMLSelectElement, unknown, HTMLElement, any>;
      inputIdUsuario: d3.Selection<HTMLSelectElement, unknown, HTMLElement, any>;
    };

    constructor() {
      const overlay = d3.select("body")
        .append("div")
        .attr("id", "modal-editar")
        .style("display", "none")
        .style("position", "fixed")
        .style("top", "0")
        .style("left", "0")
        .style("width", "100vw")
        .style("height", "100vh")
        .style("background-color", "rgba(0, 0, 0, 0.5)")
        .style("z-index", "9999");

      this.modal = overlay
        .append("div")
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
        .text("Editar Mascota");

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

      const form = this.modal.append("form").attr("id", "form-editar");

      const inputNombre = form.append("label").text("Nombre:").append("input").attr("type", "text");
      const inputEspecie = form.append("label").text("Especie:").append("input").attr("type", "text");
      const inputRaza = form.append("label").text("Raza:").append("input").attr("type", "text");
      const inputEdad = form.append("label").text("Edad:").append("input").attr("type", "number");
      const inputPeso = form.append("label").text("Peso:").append("input").attr("type", "number").attr("step", "0.01");

      const inputSexo = form.append("label").text("Sexo:").append("select");
      inputSexo.append("option").attr("value", "hembra").text("Hembra");
      inputSexo.append("option").attr("value", "macho").text("Macho");

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
        inputSexo,
        inputIdUsuario: selectIdUsuario,
      };

      form.on("submit", (event) => {
        event.preventDefault();

        const mascotaEditada: Mascota = {
          ...this.mascotaOriginal,
          Nombre: inputNombre.property("value"),
          Especie: inputEspecie.property("value"),
          Raza: inputRaza.property("value"),
          Edad: parseInt(inputEdad.property("value")),
          Peso: parseFloat(inputPeso.property("value")),
          Sexo: inputSexo.property("value"),
          IdUsuario: parseInt(selectIdUsuario.property("value")),
        };

        console.log(" Enviando al backend:", JSON.stringify(mascotaEditada));

        fetch(Nm_Mascotas.URL_BASE + "/ServicioMascotas.svc/ActualizarMascota", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(mascotaEditada),
        })
          .then(res => res.json())
          .then((respuesta) => {
            this.ocultar();
            if (respuesta.Exito) {
              console.log("--" + respuesta.Mensaje);
              this.resolveGuardado(mascotaEditada);
            } else {
              alert("-- " + respuesta.Mensaje);
              this.resolveGuardado(null);
            }
          })
          .catch((err) => {
            console.error("-- Error en el fetch:", err);
            this.ocultar();
            this.resolveGuardado(null);
          });
      });
    }

    mostrar(mascota: Mascota): Promise<Mascota | null> {
      this.mascotaOriginal = mascota;

      this.campos.inputNombre.property("value", mascota.Nombre);
      this.campos.inputEspecie.property("value", mascota.Especie);
      this.campos.inputRaza.property("value", mascota.Raza);
      this.campos.inputEdad.property("value", mascota.Edad);
      this.campos.inputPeso.property("value", mascota.Peso);
      this.campos.inputSexo.property("value", mascota.Sexo);
      this.campos.inputIdUsuario.property("value", mascota.IdUsuario.toString());

      d3.select("#modal-editar").style("display", "block");
      return new Promise((resolve) => {
        this.resolveGuardado = resolve;
      });
    }

    ocultar(): void {
      d3.select("#modal-editar").style("display", "none");
    }
  }
}
