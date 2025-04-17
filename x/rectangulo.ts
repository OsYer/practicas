namespace N_Figuras {
    export class Cls_Rectangulo {
        private inputBase: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private inputAltura: d3.Selection<HTMLInputElement, unknown, HTMLElement, any>;
        private ventana: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

        constructor() {
            this.UI_CrearVentana();
        }

        public CalcularArea(base: number, altura: number): number {
            return base * altura;
        }

        public CalcularPerimetro(base: number, altura: number): number {
            return 2 * (base + altura);
        }

        private UI_CrearVentana(): void {
            this.ventana = d3.select("body")
                .append("div")
                .attr("id", "ventana-rectangulo")
                .attr("class", "ventana")
                .style("display", "none")
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
                .text("Calculadora de Rectángulo")
                .style("font-size", "clamp(18px, 4vw, 24px)")
                .style("margin-bottom", "15px")
                .style("color", "#333");

            const contenido = this.ventana.append("div")
                .style("padding", "10px");

            contenido.append("label")
                .attr("for", "input-base-rectangulo")
                .text("Base: ")
                .style("font-size", "16px")
                .style("display", "block")
                .style("margin-bottom", "5px");

            this.inputBase = contenido.append("input")
                .attr("type", "number")
                .attr("id", "input-base-rectangulo")
                .attr("name", "base")
                .style("width", "100%")
                .style("padding", "8px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "6px")
                .style("font-size", "16px")
                .style("margin-bottom", "10px");

            contenido.append("label")
                .attr("for", "input-altura-rectangulo")
                .text("Altura: ")
                .style("font-size", "16px")
                .style("display", "block")
                .style("margin-top", "10px")
                .style("margin-bottom", "5px");

            this.inputAltura = contenido.append("input")
                .attr("type", "number")
                .attr("id", "input-altura-rectangulo")
                .attr("name", "altura")
                .style("width", "100%")
                .style("padding", "8px")
                .style("border", "1px solid #ccc")
                .style("border-radius", "6px")
                .style("font-size", "16px")
                .style("margin-bottom", "10px");

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
                .style("transition", "0.3s")
                .style("box-shadow", "0px 4px 6px rgba(0,0,0,0.1)")
                .on("mouseover", function () {
                    d3.select(this)
                        .style("background", "linear-gradient(90deg, #feb47b, #ff7e5f)")
                        .style("transform", "scale(1.05)");
                })
                .on("mouseout", function () {
                    d3.select(this)
                        .style("background", "linear-gradient(90deg, #ff7e5f, #feb47b)")
                        .style("transform", "scale(1)");
                })
                .on("click", () => this.RealizarCalculo());

            contenido.append("p")
                .attr("id", "resultado-rectangulo")
                .style("margin-top", "10px")
                .style("font-size", "16px")
                .style("color", "#555");

            contenido.append("svg")
                .attr("id", "rectangulo-svg")
                .attr("width", "200")
                .attr("height", "200")
                .style("margin-top", "20px")
                .style("border", "1px solid #000");
        }

        private RealizarCalculo(): void {
            const base = parseFloat(this.inputBase.property("value"));
            const altura = parseFloat(this.inputAltura.property("value"));

            if (isNaN(base) || isNaN(altura) || base <= 0 || altura <= 0) {
                alert("Por favor, ingrese valores válidos.");
                return;
            }

            const area = this.CalcularArea(base, altura);
            const perimetro = this.CalcularPerimetro(base, altura);

            d3.select("#resultado-rectangulo")
                .text(`Área: ${area} - Perímetro: ${perimetro}`);

            this.DibujarRectangulo(base, altura);
        }

        private DibujarRectangulo(base: number, altura: number): void {
            const svg = d3.select("#rectangulo-svg");
            svg.selectAll("*").remove();

            const svgWidth = 200;
            const svgHeight = 200;

            const x = (svgWidth - base) / 2;
            const y = (svgHeight - altura) / 2;

            svg.append("rect")
                .attr("x", x)
                .attr("y", y)
                .attr("width", base)
                .attr("height", altura)
                .attr("fill", "blue")
                .attr("stroke", "black")
                .attr("stroke-width", 2);
        }
    }
}
