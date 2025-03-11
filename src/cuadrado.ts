namespace N_Figuras {
    export class Cls_Cuadrado {
        private inputLado: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private ventana: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

        constructor() {
            this.UI_CrearVentana();
        }

        public CalcularArea(lado: number): number {
            return lado * lado;
        }

        public CalcularPerimetro(lado: number): number {
            return 4 * lado;
        }

        private UI_CrearVentana(): void {
            this.ventana = d3.select("#ventana-cuadrado");
            this.ventana = d3.select("body")
                .append("div")
                .attr("id", "ventana-cuadrado")
                .attr("class", "ventana")
                .style("position", "fixed")
                .style("top", "50%")
                .style("left", "50%")
                .style("transform", "translate(-50%, -50%)")
                .style("width", "90%")
                .style("max-width", "400px")
                .style("background", "#ffffff")
                .style("border", "1px solid #ccc")
                .style("border-radius", "12px")
                .style("box-shadow", "0px 8px 16px rgba(0,0,0,0.3)")
                .style("padding", "20px")
                .style("z-index", "1000")
                .style("text-align", "center");

            this.ventana.append("button")
                .text("X")
                .style("position", "absolute")
                .style("top", "10px")
                .style("right", "10px")
                .style("border", "none")
                .style("background", "transparent")
                .style("font-size", "20px")
                .style("color", "#333")
                .style("cursor", "pointer")
                .on("click", () => this.ventana.style("display", "none"));

            this.ventana.append("h2")
                .text("Calculadora de Cuadrado")
                .style("font-size", "clamp(18px, 4vw, 24px)")
                .style("margin-bottom", "15px")
                .style("color", "#333");

            const contenido = this.ventana
                .append("div")
                .style("padding", "10px");

            contenido.append("label")
                .text("Lado: ")
                .style("font-size", "16px")
                .style("display", "block")
                .style("margin-bottom", "5px");

            this.inputLado = contenido.append("input")
                .attr("type", "number")
                .attr("id", "lado")
                .style("width", "100%")
                .style("padding", "8px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "6px")
                .style("font-size", "16px")
                .style("margin-bottom", "10px");

            contenido.append("br");

            contenido.append("button")
                .text("Calcular")
                .style("width", "100%")
                .style("padding", "10px")
                .style("border", "none")
                .style("border-radius", "6px")
                .style("background", "linear-gradient(90deg, #ff7e5f, #feb47b)")
                .style("color", "white")
                .style("font-size", "16px")
                .style("cursor", "pointer")
                .on("click", () => this.RealizarCalculo());

            contenido.append("p")
                .attr("id", "resultado-cuadrado")
                .style("margin-top", "10px")
                .style("font-size", "16px")
                .style("color", "#555");

            contenido.append("svg")
                .attr("id", "cuadrado-svg")
                .attr("width", 200)
                .attr("height", 200)
                .style("margin-top", "20px")
                .style("border", "1px solid #000");
        }

        private RealizarCalculo(): void {
            const lado = parseFloat(this.inputLado.property("value"));

            if (isNaN(lado) || lado <= 0) {
                alert("Por favor, ingrese un valor válido.");
                return;
            }

            const area = this.CalcularArea(lado);
            const perimetro = this.CalcularPerimetro(lado);

            d3.select("#resultado-cuadrado")
            .text(`Área: ${area} - Perímetro: ${perimetro}`);
            this.DibujarCuadrado(lado);
        }

        private DibujarCuadrado(lado: number): void {
            const svg = d3.select("#cuadrado-svg");
            svg.selectAll("*").remove();

            const svgWidth = 200;
            const svgHeight = 200;

            const x = (svgWidth - lado) / 2;
            const y = (svgHeight - lado) / 2;

            svg.append("rect")
                .attr("x", x)
                .attr("y", y)
                .attr("width", lado)
                .attr("height", lado)
                .attr("fill", "green")
                .attr("stroke", "black")
                .attr("stroke-width", 2);
        }
    }
}
