namespace N_Mascotas {
    export interface Mascota {
        Id: number;
        Nombre: string;
        Edad: number;
        Especie: string;
        Raza: string;
        Peso: number;
        Sexo: string;
        FechaRegistro?: string;
        FechaEdicion?: string;
        Activo?: boolean;
        IdUsuario: number;
    }
    export class Cls_Mascotas {
        private tabla: d3.Selection<HTMLTableElement, unknown, HTMLElement, any>;
        private tablaCuerpo: d3.Selection<HTMLTableSectionElement, unknown, HTMLElement, any>;
        private formatoFecha = d3.timeFormat("%d/%m/%Y %I:%M %p");
        private mascotas: Map<number, Mascota> = new Map();
        private inputBusqueda: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        // private url: string = "http://192.168.15.225:8080/Mascotas.svc";
        private url: string = "http://localhost:50587/Mascotas.svc";
        constructor() {
            this.UI_CrearTabla();
            this.CargarMascotas();
            setInterval(() => {
                this.CargarMascotas();
            }, 15000);
        }

        private async CargarMascotas(): Promise<void> {
            try {
                // 1. Obtener la fecha máxima de edición de las mascotas existentes
                let fechaMax: Date | null = null;
        
                this.mascotas.forEach(m => {
                    if (m.FechaEdicion) {
                        const ts = parseInt(m.FechaEdicion.replace("/Date(", "").replace(")/", ""));
                        const actual = new Date(ts);
                        if (!fechaMax || actual > fechaMax) {
                            fechaMax = actual;
                        }
                    }
                });
        
                // 2. Preparar el filtro para enviar al backend
                let filtro: any = {};
                if (fechaMax) {
                    const isoDate = fechaMax.toISOString(); // Cambiar a formato ISO 8601
                    filtro = { Fecha: isoDate }; 
                    console.log("[Mascotas] ➤ Fecha máxima detectada:", isoDate);
                }
                 else {
                    console.log("[Mascotas] ➤ Carga inicial SIN filtro de fecha (primera vez)");
                }
        
                console.log("[Mascotas] ➤ Filtro que se enviará:", filtro);
        
                // 3. Realizar la petición al backend
                const response = await fetch(`${this.url}/obtenermascotasfiltrofecha`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(filtro)
                });
                console.log(filtro);

                if (!response.ok) {
                    const errorData = await response.json();
                    console.error("Error en la respuesta de la API:", errorData);
                    throw new Error(`Error HTTP: ${response.status}`);
                }
                
                const data = await response.json();
                const nuevas: N_Mascotas.Mascota[] = data.ObtenerMascotasFiltroResult;
        
                if (nuevas.length === 0) {
                    console.log("[Mascotas] ✅ Sin cambios: No se recibieron nuevos registros.");
                    return;
                }
        
                console.log(`[Mascotas] ✅ Recibidos ${nuevas.length} registros desde el backend.`);
        
                let hayCambios = false;
        
                for (const m of nuevas) {
                    const actual = this.mascotas.get(m.Id);
        
                    if (!actual) {
                        this.mascotas.set(m.Id, m);
                        hayCambios = true;
                    } else {
                        const nuevaEdicion = parseInt(m.FechaEdicion?.replace("/Date(", "").replace(")/", "") ?? "0");
                        const actualEdicion = parseInt(actual.FechaEdicion?.replace("/Date(", "").replace(")/", "") ?? "0");
        
                        if (nuevaEdicion > actualEdicion) {
                            console.log(`[Mascotas] 🔁 Mascota actualizada: ${m.Nombre} (ID: ${m.Id})`);
                            this.mascotas.set(m.Id, m);
                            hayCambios = true;
                        }
                    }
                }
        
                if (hayCambios) {
                    console.log("[Mascotas] 🔄 Se actualizará la tabla");
                    this.actualizarTabla();
                } else {
                    console.log("[Mascotas] ✅ Sin cambios en esta sincronización");
                }
        
            } catch (error) {
                console.error("❌ Error al cargar mascotas:", error);
            }
        }
        
        private actualizarTabla(mascotasFiltradas?: Mascota[]): void {
            const datos = mascotasFiltradas || Array.from(this.mascotas.values());
            this.tablaCuerpo.selectAll("*").remove();

            const filas = this.tablaCuerpo
                .selectAll("tr")
                .data(datos)
                .enter()
                .append("tr");

            filas.append("td").text(d => d.Nombre);
            filas.append("td").text(d => d.Edad);
            filas.append("td").text(d => d.Especie);
            filas.append("td").text(d => d.Raza);
            filas.append("td").text(d => d.Peso);
            filas.append("td").text(d => d.Sexo === "H" ? "Hembra" : d.Sexo === "M" ? "Macho" : d.Sexo);
            filas.append("td").text(d => this.formatearFecha(d.FechaRegistro));

            filas.append("td").append("button")
                .text("Editar")
                .style("background-color", "#f0ad4e")
                .style("color", "white")
                .style("padding", "5px 10px")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", (event, d) => this.editarMascota(d));

            filas.append("td").append("button")
                .text("Eliminar")
                .style("background-color", "#d9534f")
                .style("color", "white")
                .style("padding", "5px 10px")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", (event, d) => this.eliminarMascota(d));
        }

        private formatearFecha(fecha: string): string {
            if (!fecha) return "Sin fecha";
            try {
                const timestamp = parseInt(fecha.replace("/Date(", "").replace(")/", ""));
                const dateUTC = new Date(timestamp);
        
                // Ajustar manualmente al huso horario de México (-6 horas)
                const offset = -6 * 60; // minutos
                const localTime = new Date(dateUTC.getTime() + offset * 60 * 1000);
        
                // Formateo con d3 como lo estás haciendo
                return this.formatoFecha(localTime);
            } catch {
                return "Fecha inválida";
            }
        }
        
        

        private UI_CrearTabla(): void {
            const contenedor = d3.select("body")
                .append("div")
                .attr("class", "tabla-container")
                .style("max-width", "1200px")
                .style("margin", "50px auto")
                .style("background", "white")
                .style("padding", "20px")
                .style("border-radius", "10px")
                .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.1)");

            const encabezado = contenedor.append("div")
                .attr("class", "header")
                .style("display", "flex")
                .style("justify-content", "space-between")
                .style("align-items", "center");

            encabezado.append("h2")
                .text("Lista de Mascotas")
                .style("font-size", "20px")
                .style("color", "#333");

            const acciones = encabezado.append("div").attr("class", "acciones");

            acciones.append("button")
                .text("Nuevo")
                .style("background-color", "#28a745")
                .style("color", "white")
                .style("padding", "10px 20px")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => this.agregarMascota());

            this.inputBusqueda = acciones.append("input")
                .attr("type", "text")
                .attr("placeholder", "Buscar por nombre o especie...")
                .style("margin-left", "10px")
                .style("padding", "5px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "5px")
                .style("width", "200px");

            this.inputBusqueda.on("keyup", () => this.filtrarMascotas());

            this.tabla = contenedor.append("table")
                .attr("class", "billing-table")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("margin-top", "20px");

            const thead = this.tabla.append("thead");
            const encabezadoFila = thead.append("tr");

            encabezadoFila.append("th").text("Nombre");
            encabezadoFila.append("th").text("Edad");
            encabezadoFila.append("th").text("Especie");
            encabezadoFila.append("th").text("Raza");
            encabezadoFila.append("th").text("Peso");
            encabezadoFila.append("th").text("Sexo");
            encabezadoFila.append("th").text("Fecha Registro");
            encabezadoFila.append("th").text("Acciones");

            this.tablaCuerpo = this.tabla.append("tbody");
        }

        private filtrarMascotas(): void {
            const texto = this.inputBusqueda.property("value").toLowerCase();

            const filtradas = Array.from(this.mascotas.values()).filter(m =>
                m.Nombre.toLowerCase().includes(texto) ||
                m.Especie.toLowerCase().includes(texto)
            );

            this.actualizarTabla(filtradas);
        }

        private editarMascota(mascota: Mascota): void {
            new N_Mascotas.FormularioEditarMascota(mascota, async (actualizada: Mascota) => {
                try {
                    const response = await fetch(`${this.url}/actualizarmascota`, {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ mascota: actualizada })
                    });

                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }

                    const result = await response.json();
                    if (result.ActualizarMascotaResult === true) {
                        await this.CargarMascotas();
                    } else {
                        alert("No se pudo actualizar la mascota.");
                    }
                } catch (error) {
                    console.error("Error al actualizar mascota:", error);
                    alert("Ocurrió un error al actualizar la mascota.");
                }
            });
        }

        private eliminarMascota(mascota: Mascota): void {
            const fondo = d3.select("body")
                .append("div")
                .attr("id", "modal-confirmacion")
                .style("position", "fixed")
                .style("top", "0")
                .style("left", "0")
                .style("width", "100%")
                .style("height", "100%")
                .style("background-color", "rgba(0,0,0,0.6)")
                .style("display", "flex")
                .style("justify-content", "center")
                .style("align-items", "center")
                .style("z-index", "9999");

            const contenedor = fondo.append("div")
                .style("background", "white")
                .style("padding", "20px")
                .style("border-radius", "10px")
                .style("width", "350px")
                .style("box-shadow", "0 0 10px rgba(0,0,0,0.3)")
                .style("text-align", "center");

            contenedor.append("p")
                .text(`¿Seguro que deseas eliminar a "${mascota.Nombre}"?`)
                .style("font-size", "16px")
                .style("color", "#333")
                .style("margin-bottom", "20px");

            const botones = contenedor.append("div");

            botones.append("button")
                .text("Cancelar")
                .style("margin-right", "10px")
                .style("padding", "8px 15px")
                .style("background-color", "#ccc")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => {
                    fondo.remove();
                });

            botones.append("button")
                .text("Eliminar")
                .style("padding", "8px 15px")
                .style("background-color", "#d9534f")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "5px")
                .style("cursor", "pointer")
                .on("click", () => {
                    fondo.remove();
                    fetch(`${this.url}/eliminarmascota`, {
                        method: "DELETE",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({ mascota: { Id: mascota.Id } })
                    })
                        .then(response => {
                            if (!response.ok) throw new Error(`Error : ${response.status}`);
                            return response.json();
                        })
                        .then(result => {
                            if (result.EliminarMascotaResult === true) {
                                this.mascotas.delete(mascota.Id);
                                this.actualizarTabla();
                            } else {
                                alert("No se pudo eliminar la mascota.");
                            }
                        })
                        .catch(error => {
                            console.error("Error al eliminar mascota:", error);
                            alert("Ocurrió un error al eliminar la mascota.");
                        });
                });
        }

        private agregarMascota(): void {
            new N_Mascotas.FormularioAgregarMascota(async (nueva: Mascota) => {
                try {
                    console.log("Mascota a enviar:", nueva);
                    const response = await fetch(`${this.url}/agregarmascota`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({ mascota: nueva })
                    });

                    if (!response.ok) {
                        throw new Error(`Error HTTP: ${response.status}`);
                    }

                    const ok = await response.json();

                    if (ok.AgregarMascotaResult === true) {
                        await this.CargarMascotas();
                    } else {
                        alert("No se pudo guardar la mascota.");
                    }

                } catch (error) {
                    console.error("Error al registrar mascota:", error);
                    alert("Hubo un error al registrar la mascota.");
                }
            });
        }

    }
}

let I_Mascotas = new N_Mascotas.Cls_Mascotas();