namespace N_Mascotas {
  export interface Mascota {
      id: number;
      nombre: string;
      especie: string;
      raza: string;
      edad: number;
      peso: number;
      sexo: string;
      id_usuario: number;
  }

  export class Cls_Mascotas {
      private mascotas: Map<number, Mascota>;

      // Definición de los inputs como propiedades de la clase
      private inputId: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      private inputNombre: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      private inputEspecie: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      private inputRaza: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      private inputEdad: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      private inputPeso: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      private inputSexo: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
      private inputIdUsuario: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;

      constructor() {
          this.mascotas = new Map();
          this.UI_CrearVentana();
          this.CargarMascotasDesdeAPI(); // Cargar datos de la API al iniciar
      }

      public CargarMascotasDesdeAPI(): void {
          fetch("http://localhost:50587/Mascotas.svc/ObtenerMascotas")
              .then(response => {
                  if (!response.ok) {
                      throw new Error(`Error al obtener mascotas: ${response.statusText}`);
                  }
                  return response.json();
              })
              .then((data: any[]) => {
                  this.mascotas.clear();

                  data.forEach(item => {
                      const mascota: Mascota = {
                          id: item.Id,
                          nombre: item.Nombre,
                          especie: item.Especie,
                          raza: item.Raza,
                          edad: item.Edad,
                          peso: item.Peso,
                          sexo: item.Sexo,
                          id_usuario: item.IdUsuario
                      };
                      this.mascotas.set(mascota.id, mascota);
                  });
console.log(data)
                  this.UI_ActualizarTabla();
              })
              .catch(error => console.error(error));
      }

      public UI_CrearVentana(): void {
          let ventana = d3.select("#ventana-mascotas");

          if (!ventana.empty()) {
              ventana.style("display", "block");
              return;
          }

          ventana = d3.select("body")
              .append("div")
              .attr("id", "ventana-mascotas")
              .attr("class", "ventana")
              .style("position", "fixed")
              .style("top", "50%")
              .style("left", "50%")
              .style("transform", "translate(-50%, -50%)")
              .style("width", "80%")
              .style("max-width", "900px")
              .style("max-height", "90vh")
              .style("overflow", "hidden")
              .style("background", "#fff")
              .style("border", "1px solid #ccc")
              .style("border-radius", "12px")
              .style("box-shadow", "0px 8px 16px rgba(0,0,0,0.3)")
              .style("padding", "20px")
              .style("z-index", "1000");

          ventana.append("h2")
              .text("Gestión de Mascotas")
              .style("text-align", "center")
              .style("margin-bottom", "20px")
              .style("color", "#333");

          const form = ventana.append("div").style("padding", "20px");

          // Agregar inputs manualmente con sus respectivas referencias
          form.append("label").text("ID:").style("display", "block").style("font-weight", "bold");
          this.inputId = form.append("input").attr("type", "number").style("width", "100%");

          form.append("label").text("Nombre:").style("display", "block").style("font-weight", "bold");
          this.inputNombre = form.append("input").attr("type", "text").style("width", "100%");

          form.append("label").text("Especie:").style("display", "block").style("font-weight", "bold");
          this.inputEspecie = form.append("input").attr("type", "text").style("width", "100%");

          form.append("label").text("Raza:").style("display", "block").style("font-weight", "bold");
          this.inputRaza = form.append("input").attr("type", "text").style("width", "100%");

          form.append("label").text("Edad:").style("display", "block").style("font-weight", "bold");
          this.inputEdad = form.append("input").attr("type", "number").style("width", "100%");

          form.append("label").text("Peso:").style("display", "block").style("font-weight", "bold");
          this.inputPeso = form.append("input").attr("type", "number").style("width", "100%");

          form.append("label").text("Sexo:").style("display", "block").style("font-weight", "bold");
          this.inputSexo = form.append("input").attr("type", "text").style("width", "100%");

          form.append("label").text("ID Usuario:").style("display", "block").style("font-weight", "bold");
          this.inputIdUsuario = form.append("input").attr("type", "number").style("width", "100%");

          form.append("button")
              .text("Agregar Mascota")
              .style("margin-top", "15px")
              .style("padding", "10px")
              .style("border", "none")
              .style("border-radius", "6px")
              .style("background", "linear-gradient(90deg, #ff7e5f, #feb47b)")
              .style("color", "white")
              .style("cursor", "pointer")
              .on("click", () => this.AgregarMascota());

          const tablaContainer = ventana.append("div")
              .style("max-height", "50vh")
              .style("overflow-y", "auto")
              .style("margin-top", "10px");

          tablaContainer.append("table")
              .attr("id", "tabla-mascotas")
              .style("width", "100%")
              .style("border-collapse", "collapse");

          this.UI_ActualizarTabla();
      }

      private AgregarMascota(): void {
          const mascota: Mascota = {
              id: Number(this.inputId.property("value")),
              nombre: this.inputNombre.property("value"),
              especie: this.inputEspecie.property("value"),
              raza: this.inputRaza.property("value"),
              edad: Number(this.inputEdad.property("value")),
              peso: Number(this.inputPeso.property("value")),
              sexo: this.inputSexo.property("value"),
              id_usuario: Number(this.inputIdUsuario.property("value")),
          };

          if (!mascota.id || !mascota.nombre || !mascota.especie || !mascota.raza || !mascota.edad || !mascota.peso || !mascota.sexo || !mascota.id_usuario) {
              alert("Todos los campos son obligatorios.");
              return;
          }

          this.mascotas.set(mascota.id, mascota);
          this.UI_ActualizarTabla();
      }

      private UI_ActualizarTabla(): void {
        const tabla = d3.select("#tabla-mascotas");
        tabla.html(""); // Limpiar tabla antes de actualizar
    
        const thead = tabla.append("thead").append("tr");
        ["ID", "Nombre", "Especie", "Raza", "Edad", "Peso", "Sexo", "ID Usuario", "Acciones"]
            .forEach(text => {
                thead.append("th")
                    .text(text)
                    .style("padding", "12px")
                    .style("background", "#ff7e5f")
                    .style("color", "white")
                    .style("border", "2px solid black")
                    .style("text-align", "left");
            });
    
        const tbody = tabla.append("tbody");
    
        if (this.mascotas.size === 0) {
            tbody.append("tr").append("td")
                .attr("colspan", "9")
                .text("No hay mascotas registradas.")
                .style("text-align", "center")
                .style("padding", "10px");
            return;
        }
    
        this.mascotas.forEach(mascota => {
            const row = tbody.append("tr");
    
            row.append("td").text(mascota.id).style("border", "1px solid black").style("padding", "8px");
            row.append("td").text(mascota.nombre).style("border", "1px solid black").style("padding", "8px");
            row.append("td").text(mascota.especie).style("border", "1px solid black").style("padding", "8px");
            row.append("td").text(mascota.raza).style("border", "1px solid black").style("padding", "8px");
            row.append("td").text(mascota.edad).style("border", "1px solid black").style("padding", "8px");
            row.append("td").text(mascota.peso).style("border", "1px solid black").style("padding", "8px");
            row.append("td").text(mascota.sexo).style("border", "1px solid black").style("padding", "8px");
            row.append("td").text(mascota.id_usuario).style("border", "1px solid black").style("padding", "8px");
    
            row.append("td")
                .append("button")
                .text("Eliminar")
                .style("padding", "5px 10px")
                .style("border", "none")
                .style("background", "red")
                .style("color", "white")
                .style("cursor", "pointer")
                .on("click", () => this.EliminarMascota(mascota.id));
        });
    }
    
  }
}
