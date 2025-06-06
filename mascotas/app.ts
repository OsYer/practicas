namespace Nm_Mascotas {
    // export const URL_BASE = "http://192.168.15.225:8090";
    export const URL_BASE = "http://localhost:63166";

    export class TablaMascotas {
        private mascotas: Mascota[] = [];
        private ultimaFecha: string | null = null;
        private readonly API_URL: string = Nm_Mascotas.URL_BASE + "/ServicioMascotas.svc/ObtenerMascotas";
        private readonly DELETE_URL: string = Nm_Mascotas.URL_BASE + "/ServicioMascotas.svc/EliminarMascota/";
        private modalEditar: Nm_Mascotas.editarMascota;
        private modalAgregar: Nm_Mascotas.agregarMascota;
        private ordenAscendente: boolean = true;

        constructor() {
            this.modalEditar = new Nm_Mascotas.editarMascota();
            this.modalAgregar = new Nm_Mascotas.agregarMascota();
            this.crearEstructuraHTML();
            this.iniciar();
        }

        private iniciar(): void {
            this.cargarMascotas();
            setInterval(() => this.cargarMascotas(), 8000);
        }

        private crearEstructuraHTML(): void {
            const container = d3
                .select("body")
                .append("div")
                .style("margin", "20px")
                .style("padding", "10px")
                .style("border", "1px solid #ccc");

            const card = container
                .append("div")
                .style("background-color", "#f8f9fa")
                .style("padding", "15px")
                .style("border-radius", "8px");

            const header = card
                .append("div")
                .style("display", "flex")
                .style("justify-content", "space-between")
                .style("align-items", "center")
                .style("background-color", "#ffffff")
                .style("color", "#000")
                .style("padding", "10px")
                .style("border-radius", "5px");

            header.append("h5").style("margin", "0").text("Gestionar mascotas");

            const btnGroup = header.append("div");

            btnGroup
                .append("button")
                .text("➕ Agregar nueva mascota")
                .style("background-color", "#28a745")
                .style("color", "white")
                .style("border", "none")
                .style("padding", "5px 10px")
                .style("border-radius", "4px")
                .on("click", () => this.agregarMascota());

            btnGroup
                .append("input")
                .attr("type", "text")
                .attr("placeholder", "Buscar por nombre o especie...")
                .style("margin-right", "10px")
                .style("padding", "5px")
                .style("border-radius", "4px")
                .on("keyup", function (event: KeyboardEvent) {
                    const input = event.target as HTMLInputElement;
                    const valor = input.value.toLowerCase();
                    MascotasRef.filtrarMascotas(valor);
                });

            const table = card
                .append("table")
                .attr("id", "tablaMascotas")
                .style("width", "100%")
                .style("border-collapse", "collapse")
                .style("margin-top", "15px");

            const thead = table.append("thead").style("background-color", "#e9ecef");

            const tr = thead.append("tr");

            const headers = [
                "ID",
                "Nombre",
                "Especie",
                "Raza",
                "Edad",
                "Peso",
                "Sexo",
                "ID Usuario",
                "Fecha Registro",
                "Fecha Edición",
                "Acciones",
            ];
            headers.forEach((header) => {
                const th = tr.append("th")
                    .text(header)
                    .style("padding", "8px")
                    .style("border", "1px solid #dee2e6")
                    .style("text-align", "left");

                if (header === "Fecha Edición") {
                    th.style("cursor", "pointer").on("click", () => this.ordenarPorFechaEdicion());
                }
            });
            table.append("tbody");
        }
        
        private ordenarPorFechaEdicion(): void {
            this.ordenAscendente = !this.ordenAscendente;

            this.mascotas.sort((a, b) => {
                const fechaA = new Date(this.parseWcfDate(a.FechaEdicion)).getTime();
                const fechaB = new Date(this.parseWcfDate(b.FechaEdicion)).getTime();
                return this.ordenAscendente ? fechaA - fechaB : fechaB - fechaA;
            });

            this.renderTabla();
        }

        private filtrarMascotas(valor: string): void {
            const filtradas = this.mascotas.filter((m) =>
                m.Nombre.toLowerCase().includes(valor) ||
                m.Especie.toLowerCase().includes(valor)
            );
            // console.log(filtradas);
            this.renderTabla(filtradas);
        }

        private cargarMascotas(): void {
            const body = {
                desde: this.ultimaFecha
                    ? `/Date(${new Date(this.ultimaFecha).getTime()}-0600)/`
                    : null,
            };

            console.log(" Consultando mascotas...");
            console.log(" Enviando filtro:", body.desde);

            fetch(this.API_URL, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data.Exito && data.Datos.length > 0) {
                        console.log(
                            ` Se recibieron ${data.Datos.length} mascotas editadas.`
                        );

                        const mascotaMap = new Map<number, Mascota>();
                        this.mascotas.forEach((m) => mascotaMap.set(m.Id, m));

                        data.Datos.forEach((nueva) => {
                            if (!nueva.Activo) {
                                mascotaMap.delete(nueva.Id);
                                console.log("Registro eliminado");
                            } else {
                                mascotaMap.set(nueva.Id, nueva);
                            }
                        });
                        this.mascotas = Array.from(mascotaMap.values());
                        this.actualizarUltimaFecha(data.Datos);
                        this.renderTabla();
                    } else {
                        console.log("Sin cambios nuevos.");
                    }
                })
                .catch((err) => console.error(" Error al consumir la API:", err));
        }

        private actualizarUltimaFecha(nuevas: Mascota[]): void {
            const fechas = nuevas.map((m) =>
                new Date(this.parseWcfDate(m.FechaEdicion)).getTime()
            );
            const max = Math.max(
                ...fechas,
                new Date(this.ultimaFecha || 0).getTime()
            );
            this.ultimaFecha = new Date(max).toISOString();
            console.log(" Nueva fecha máxima actualizada:", this.ultimaFecha);
        }

        private parseWcfDate(wcf: string): string {
            const match = /\/Date\((\d+)(?:-\d+)?\)\//.exec(wcf);
            return match ? new Date(parseInt(match[1], 10)).toISOString() : wcf;
        }

        private formatDate(fecha: string): string {
            const d = new Date(fecha);
            return d.toLocaleString();
        }

        private renderTabla(datos?: Mascota[]): void {
            const data = datos || this.mascotas;
            const tbody = d3.select("#tablaMascotas tbody");
            tbody.selectAll("tr").remove();

            const rows = tbody
            .selectAll("tr")
            .data(data, (d: Mascota) => d.Id.toString());
        
            const newRows = rows.enter().append("tr");

            newRows.append("td").text((d) => d.Id);
            newRows.append("td").text((d) => d.Nombre);
            newRows.append("td").text((d) => d.Especie);
            newRows.append("td").text((d) => d.Raza);
            newRows.append("td").text((d) => d.Edad);
            newRows.append("td").text((d) => d.Peso);
            newRows.append("td").text((d) => d.Sexo);
            newRows.append("td").text((d) => d.IdUsuario);
            newRows
                .append("td")
                .text((d) => this.formatDate(this.parseWcfDate(d.FechaRegistro)));
            newRows
                .append("td")
                .text((d) => this.formatDate(this.parseWcfDate(d.FechaEdicion)));

            const actionCells = newRows
                .append("td")
                .append("div")
                .style("display", "flex")
                .style("gap", "8px")
                .style("justify-content", "center");

            actionCells
                .append("button")
                .text("✏️")
                .attr("class", "btn-editar")
                .style("padding", "4px 8px")
                .style("background-color", "#ffc107")
                .style("border", "none")
                .style("border-radius", "4px")
                .on("click", (event, d: Mascota) => this.editarMascota(d));

            actionCells
                .append("button")
                .text("🗑️")
                .attr("class", "btn-eliminar")
                .style("padding", "4px 8px")
                .style("background-color", "#dc3545")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "4px")
                .on("click", (event, d: Mascota) => this.eliminarMascota(d.Id));

            rows.exit().remove();
        }

        private eliminarMascota(id: number): void {
            if (!confirm(`¿Estás seguro de eliminar la mascota con ID ${id}?`))
                return;

            fetch(this.DELETE_URL + id, {
                method: "DELETE",
            })
                .then((res) => res.json())
                .then((data) => {
                    if (data === true) {
                        console.log(`🗑️ Mascota con ID ${id} eliminada correctamente.`);
                        this.mascotas = this.mascotas.filter((m) => m.Id !== id);
                        this.renderTabla();
                    } else {
                        console.error(" No se pudo eliminar la mascota.");
                    }
                })
                .catch((err) => console.error(" Error al eliminar la mascota:", err));
        }
        private agregarMascota(): void {
            this.modalAgregar.mostrar().then((nuevaMascota) => {
                if (nuevaMascota) {
                    this.cargarMascotas();
                }
            });
        }

        private editarMascota(mascota: Mascota): void {
            this.modalEditar.mostrar(mascota).then((mascotaEditada) => {
                if (mascotaEditada) {
                    this.mascotas = this.mascotas.map((m) =>
                        m.Id === mascotaEditada.Id ? mascotaEditada : m
                    );
                    this.renderTabla();
                }
            });
        }
    }
}

let MascotasRef = new Nm_Mascotas.TablaMascotas();