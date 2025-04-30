namespace Nm_Vehiculos {
    export class DateUtils {
      private static formatoPantalla = d3.timeFormat('%d/%m/%Y %I:%M %p');
      public static readonly ApiBase = 'http://localhost:50587';
     
      public static toWcfDate(date: Date): string {
        const timestamp = date.getTime(); // milisegundos desde 1970
        const offsetMin = -date.getTimezoneOffset();
        const sign = offsetMin >= 0 ? '+' : '-';
        const hours = Math.floor(Math.abs(offsetMin) / 60).toString().padStart(2, '0');
        const minutes = (Math.abs(offsetMin) % 60).toString().padStart(2, '0');
        return `/Date(${timestamp}${sign}${hours}${minutes})/`;
    }
    
      /** Devuelve "YYYY-MM-DDThh:mm:ss.SSSuuu±HH:MM" */
      public static formatConMicroOffset(dt: Date): string {
        const pad2 = (n: number) => ('0' + n).slice(-2);
        const pad3 = (n: number) => ('00' + n).slice(-3);
  
        const year   = dt.getFullYear();
        const month  = pad2(dt.getMonth() + 1);
        const day    = pad2(dt.getDate());
        const hour   = pad2(dt.getHours());
        const minute = pad2(dt.getMinutes());
        const second = pad2(dt.getSeconds());
        const milli  = pad3(dt.getMilliseconds());
        const micro  = milli + '000';
  
        const offsetMin = -dt.getTimezoneOffset();
        const sign      = offsetMin >= 0 ? '+' : '-';
        const offH      = pad2(Math.floor(Math.abs(offsetMin) / 60));
        const offM      = pad2(Math.abs(offsetMin) % 60);
  
        return `${year}-${month}-${day}T${hour}:${minute}:${second}.${micro}${sign}${offH}:${offM}`;
      }
  
      /** Transforma tu “/Date(…)/” a formato de pantalla con d3 */
      public static formatearFecha(fecha: string): string {
        if (!fecha) return 'Sin fecha';
        try {
          const timestamp = parseInt(fecha.replace('/Date(', '').replace(')/', ''), 10);
          const dateUTC   = new Date(timestamp);
  
          // Ajuste huso MX (UTC−06:00)
          const offsetMin = -6 * 60;
          const localTime = new Date(dateUTC.getTime() + offsetMin * 60 * 1000);
  
          return DateUtils.formatoPantalla(localTime);
        } catch {
          return 'Fecha inválida';
        }
      }
    }
  }