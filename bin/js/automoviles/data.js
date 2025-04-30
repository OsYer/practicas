var Nm_Vehiculos;
(function (Nm_Vehiculos) {
    function mostrarConfirmacion(mensaje) {
        return new Promise((resolve) => {
            const overlay = d3.select("body").append("div")
                .style("position", "fixed")
                .style("top", "0")
                .style("left", "0")
                .style("width", "100%")
                .style("height", "100%")
                .style("background-color", "rgba(0,0,0,0.3)")
                .style("z-index", "9998");
            const modal = d3.select("body").append("div")
                .style("position", "fixed")
                .style("top", "50%")
                .style("left", "50%")
                .style("transform", "translate(-50%, -50%)")
                .style("background-color", "#fff")
                .style("padding", "20px")
                .style("border-radius", "8px")
                .style("box-shadow", "0 4px 8px rgba(0, 0, 0, 0.2)")
                .style("z-index", "9999");
            modal.append("p")
                .text(mensaje)
                .style("margin-bottom", "20px");
            const buttonContainer = modal.append("div")
                .style("display", "flex")
                .style("justify-content", "center")
                .style("gap", "10px");
            buttonContainer.append("button")
                .text("Cancelar")
                .style("padding", "8px 20px")
                .style("background-color", "#6c757d")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "4px")
                .on("click", () => {
                overlay.remove();
                modal.remove();
                resolve(false);
            });
            buttonContainer.append("button")
                .text("Eliminar")
                .style("padding", "8px 20px")
                .style("background-color", "#dc3545")
                .style("color", "white")
                .style("border", "none")
                .style("border-radius", "4px")
                .on("click", () => {
                overlay.remove();
                modal.remove();
                resolve(true);
            });
        });
    }
    Nm_Vehiculos.mostrarConfirmacion = mostrarConfirmacion;
    function mostrarNotificacion(mensaje, color = "#28a745") {
        const noti = d3.select("body")
            .append("div")
            .text(mensaje)
            .style("position", "fixed")
            .style("top", "20px")
            .style("right", "20px")
            .style("background-color", color)
            .style("color", "white")
            .style("padding", "10px 20px")
            .style("border-radius", "6px")
            .style("box-shadow", "0 2px 6px rgba(0,0,0,0.2)")
            .style("z-index", "10000")
            .style("opacity", "0")
            .transition()
            .duration(200)
            .style("opacity", "1")
            .transition()
            .delay(2000)
            .duration(500)
            .style("opacity", "0")
            .remove();
    }
    Nm_Vehiculos.mostrarNotificacion = mostrarNotificacion;
    class DateUtils {
        static toWcfDate(date) {
            const timestamp = date.getTime(); // milisegundos desde 1970
            const offsetMin = -date.getTimezoneOffset();
            const sign = offsetMin >= 0 ? '+' : '-';
            const hours = Math.floor(Math.abs(offsetMin) / 60).toString().padStart(2, '0');
            const minutes = (Math.abs(offsetMin) % 60).toString().padStart(2, '0');
            return `/Date(${timestamp}${sign}${hours}${minutes})/`;
        }
        /** Devuelve "YYYY-MM-DDThh:mm:ss.SSSuuu±HH:MM" */
        static formatConMicroOffset(dt) {
            const pad2 = (n) => ('0' + n).slice(-2);
            const pad3 = (n) => ('00' + n).slice(-3);
            const year = dt.getFullYear();
            const month = pad2(dt.getMonth() + 1);
            const day = pad2(dt.getDate());
            const hour = pad2(dt.getHours());
            const minute = pad2(dt.getMinutes());
            const second = pad2(dt.getSeconds());
            const milli = pad3(dt.getMilliseconds());
            const micro = milli + '000';
            const offsetMin = -dt.getTimezoneOffset();
            const sign = offsetMin >= 0 ? '+' : '-';
            const offH = pad2(Math.floor(Math.abs(offsetMin) / 60));
            const offM = pad2(Math.abs(offsetMin) % 60);
            return `${year}-${month}-${day}T${hour}:${minute}:${second}.${micro}${sign}${offH}:${offM}`;
        }
        /** Transforma tu “/Date(…)/” a formato de pantalla con d3 */
        static formatearFecha(fecha) {
            if (!fecha)
                return 'Sin fecha';
            try {
                const timestamp = parseInt(fecha.replace('/Date(', '').replace(')/', ''), 10);
                const dateUTC = new Date(timestamp);
                // Ajuste huso MX (UTC−06:00)
                const offsetMin = -6 * 60;
                const localTime = new Date(dateUTC.getTime() + offsetMin * 60 * 1000);
                return DateUtils.formatoPantalla(localTime);
            }
            catch (_a) {
                return 'Fecha inválida';
            }
        }
    }
    DateUtils.formatoPantalla = d3.timeFormat('%d/%m/%Y %I:%M %p');
    DateUtils.ApiBase = 'http://localhost:50587';
    Nm_Vehiculos.DateUtils = DateUtils;
})(Nm_Vehiculos || (Nm_Vehiculos = {}));
//# sourceMappingURL=data.js.map