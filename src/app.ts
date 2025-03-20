namespace App {
    export class Cls_App {
        constructor() {
            this.UI_App();
        }

        private UI_App(): void {
            let I_Cuadrado: N_Figuras.Cls_Cuadrado | null = null;
            let I_Rectangulo: N_Figuras.Cls_Rectangulo | null = null;
            let I_Empleados: N_Empleados.Cls_Empleados | null = null;
            let I_Productos: N_Productos.Cls_Productos | null = null;
            let I_Usuarios: N_Usuarios.Cls_Usuarios | null = null;
            let I_Mascotas: N_Mascotas.Cls_Mascotas | null = null;
            d3.select("body")
                .append("h2")
                .text("Menú de Prácticas")
                .attr("class", "titulo-menu")
                .style("font-size", "clamp(20px, 4vw, 32px)")
                .style("color", "#ffffff")
                .style("margin-bottom", "20px");

            d3.select("body")
                .append("button")
                .text("Mostrar Calculadora de Rectángulo")
                .attr("class", "boton-estandar")
                .on("click", () => {
                    if (!I_Rectangulo) {
                        I_Rectangulo = new N_Figuras.Cls_Rectangulo();
                    } else {
                        d3.select("#ventana-rectangulo").style("display", "block");
                    }
                });

            d3.select("body")
                .append("button")
                .text("Mostrar Calculadora de Cuadrado")
                .attr("class", "boton-estandar")
                .on("click", () => {
                    if (!I_Cuadrado) {
                        I_Cuadrado = new N_Figuras.Cls_Cuadrado();
                    } else {
                        d3.select("#ventana-cuadrado").style("display", "block");
                    }
                });

            d3.select("body")
                .append("button")
                .text("Ejemplo de Uso de en Array")
                .attr("class", "boton-estandar")
                .on("click", () => {
                    if (!I_Empleados) {
                        I_Empleados = new N_Empleados.Cls_Empleados();
                    } else {
                        d3.select("#ventana-empleados").style("display", "block");
                    }
                });

            d3.select("body")
                .append("button")
                .text("Gestión de productos con Map")
                .attr("class", "boton-estandar")
                .on("click", () => {
                    if (!I_Productos) {
                        I_Productos = new N_Productos.Cls_Productos();
                    } else {
                        d3.select("#ventana-productos").style("display", "block");
                    }
                });

                d3.select("body")
                .append("button")
                .text("Usuarios")
                .attr("class", "boton-estandar")
                .on("click", () => {
                    if (!I_Usuarios) {
                        I_Usuarios = new N_Usuarios.Cls_Usuarios();
                    } else {
                        d3.select("#ventana-usuarios").style("display", "block");
                    }
                });  
                
                d3.select("body")
                .append("button")
                .text("Backend")
                .attr("class", "boton-estandar")
                .on("click", () => {
                    if (!I_Mascotas) {
                        I_Mascotas = new N_Mascotas.Cls_Mascotas();
                    // } else {
                    //     d3.select("#ventana-mascotas").style("display", "block");
                    // }
                    }
                });

            d3.select("body")
                .style("display", "flex")
                .style("flex-direction", "column")
                .style("align-items", "center")
                .style("justify-content", "center")
                .style("min-height", "100vh")
                .style("background", "linear-gradient(45deg, #0f1e45, #2a5298)")
                .style("font-family", "Arial, sans-serif");

            d3.selectAll(".boton-estandar")
                .style("width", "80%")
                .style("max-width", "400px")
                .style("padding", "12px 20px")
                .style("font-size", "clamp(14px, 2vw, 18px)")
                .style("margin", "10px")
                .style("border", "none")
                .style("border-radius", "8px")
                .style("background", "linear-gradient(90deg, #ff7e5f, #feb47b)")
                .style("color", "white")
                .style("box-shadow", "0px 4px 6px rgba(0,0,0,0.1)")
                .style("cursor", "pointer")
                .style("transition", "all 0.3s ease-in-out")
                .on("mouseover", function () {
                    d3.select(this)
                        .style("background", "linear-gradient(90deg, #feb47b, #ff7e5f)")
                        .style("transform", "scale(1.05)");
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .style("background", "linear-gradient(90deg, #ff7e5f, #feb47b)")
                        .style("transform", "scale(1)");
                });
        }
    }
}
const I_App = new App.Cls_App();
