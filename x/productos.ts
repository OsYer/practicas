namespace N_Productos {
    export interface Producto {
        id: number;
        nombre: string;
        categoria: string;
        precio: number;
        stock: number;
    }

    export class Cls_Productos {
        private productos: Map<number, Producto>;

        constructor() {
            this.productos = new Map();
            this.UI_CrearVentana();
        }

        public AgregarProducto(id: number, nombre: string, categoria: string, precio: number, stock: number): void {
            if (!id || !nombre || !categoria || !precio || !stock) {
                alert("Todos los campos son obligatorios.");
                return;
            }
            if (id <= 0 || precio <= 0 || stock < 0) {
                alert("ID, precio y stock deben ser valores positivos.");
                return;
            }
            if (this.productos.has(id)) {
                alert(`El producto con ID ${id} ya existe.`);
                return;
            }
            this.productos.set(id, { id, nombre, categoria, precio, stock });
            this.UI_ActualizarTabla();
        }

        public EliminarProducto(id: number): void {
            if (!this.productos.has(id)) {
                alert(`No existe un producto con ID ${id}.`);
                return;
            }
            this.productos.delete(id);
            this.UI_ActualizarTabla();
        }

        public BuscarPorCategoria(categoria: string): void {
            this.UI_ActualizarTabla(categoria);
        }

        public UI_CrearVentana(): void {
            let ventana = d3.select("#ventana-productos");

            if (!ventana.empty()) {
                ventana.style("display", "block");
                return;
            }

            ventana = d3.select("body")
                .append("div")
                .attr("id", "ventana-productos")
                .attr("class", "ventana")
                .style("position", "fixed")
                .style("top", "50%")
                .style("left", "50%")
                .style("transform", "translate(-50%, -50%)")
                .style("width", "90%")
                .style("max-width", "600px")
                .style("max-height", "90vh")
                .style("overflow", "auto")
                .style("background", "#fff")
                .style("border", "1px solid #ccc")
                .style("border-radius", "12px")
                .style("box-shadow", "0px 8px 16px rgba(0,0,0,0.3)")
                .style("padding", "20px")
                .style("z-index", "1000");

            ventana.append("button")
                .text("✖")
                .attr("class", "cerrar-ventana")
                .style("position", "absolute")
                .style("top", "10px")
                .style("right", "10px")
                .style("border", "none")
                .style("background", "transparent")
                .style("font-size", "20px")
                .style("color", "#333")
                .style("cursor", "pointer")
                .on("mouseover", function () { d3.select(this).style("color", "red"); })
                .on("mouseout", function () { d3.select(this).style("color", "#333"); })
                .on("click", () => ventana.style("display", "none"));

            ventana.append("h2")
                .text("Gestión de Productos")
                .style("text-align", "center")
                .style("margin-bottom", "20px")
                .style("color", "#333");

            const form = ventana.append("div").style("padding", "20px");

            const AgregarCampo = (label: string, id: string, type: string) => {
                form.append("label")
                    .text(label)
                    .style("font-weight", "bold")
                    .style("display", "block")
                    .style("margin-top", "10px");

                form.append("input")
                    .attr("id", id)
                    .attr("type", type)
                    .style("width", "100%")
                    .style("padding", "8px")
                    .style("border", "1px solid #ccc")
                    .style("border-radius", "6px")
                    .style("font-size", "16px");
            };

            AgregarCampo("ID:", "id", "number");
            AgregarCampo("Nombre:", "nombre", "text");
            AgregarCampo("Categoría:", "categoria", "text");
            AgregarCampo("Precio:", "precio", "number");
            AgregarCampo("Stock:", "stock", "number");

            form.append("button")
                .text("Agregar Producto")
                .style("margin-top", "15px")
                .style("padding", "10px")
                .style("border", "none")
                .style("border-radius", "6px")
                .style("background", "linear-gradient(90deg, #ff7e5f, #feb47b)")
                .style("color", "white")
                .style("font-size", "16px")
                .style("cursor", "pointer")
                .style("width", "100%")
                .on("click", () => {
                    const id = Number((document.getElementById("id") as HTMLInputElement).value);
                    const nombre = (document.getElementById("nombre") as HTMLInputElement).value;
                    const categoria = (document.getElementById("categoria") as HTMLInputElement).value;
                    const precio = Number((document.getElementById("precio") as HTMLInputElement).value);
                    const stock = Number((document.getElementById("stock") as HTMLInputElement).value);
                    this.AgregarProducto(id, nombre, categoria, precio, stock);
                });

            ventana.append("table")
                .attr("id", "tabla-productos")
                .style("width", "100%")
                .style("border-collapse", "collapse");

            this.UI_ActualizarTabla();
        }

        private UI_ActualizarTabla(categoriaFiltro: string = ""): void {
            const tabla = d3.select("#tabla-productos");
            tabla.html("");

            const thead = tabla.append("thead").append("tr");
            ["ID", "Nombre", "Categoría", "Precio", "Stock", "Acciones"]
                .forEach(text => {
                    thead.append("th")
                        .text(text)
                        .style("padding", "10px")
                        .style("background", "#ff7e5f")
                        .style("color", "white")
                        .style("border", "2px solid black");
                });

            const tbody = tabla.append("tbody");

            this.productos.forEach(producto => {
                if (categoriaFiltro && !producto.categoria.toLowerCase().includes(categoriaFiltro.toLowerCase()))
                    return;

                const row = tbody.append("tr");

                row.append("td").text(producto.id).style("border", "2px solid black");
                row.append("td").text(producto.nombre).style("border", "2px solid black");
                row.append("td").text(producto.categoria).style("border", "2px solid black");
                row.append("td").text(`$${producto.precio}`).style("border", "2px solid black");
                row.append("td").text(producto.stock).style("border", "2px solid black");

                row.append("td")
                    .append("button")
                    .text("Eliminar")
                    .style("padding", "5px 10px")
                    .style("border", "none")
                    .style("border-radius", "4px")
                    .style("background", "red")
                    .style("color", "white")
                    .style("cursor", "pointer")
                    .on("click", () => this.EliminarProducto(producto.id));
            });
            tabla.style("border-collapse", "collapse");
        }
    }
}