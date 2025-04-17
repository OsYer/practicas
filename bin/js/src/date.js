var N_Mascotas;
(function (N_Mascotas) {
    class DateUtils {
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
    N_Mascotas.DateUtils = DateUtils;
})(N_Mascotas || (N_Mascotas = {}));
//# sourceMappingURL=date.js.map