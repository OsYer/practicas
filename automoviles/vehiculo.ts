namespace Nm_Vehiculos {
    export interface Vehiculo {
        Id?: number;
        Placa: string;
        CargaMaxima: number;
        Estado: string;
        FechaRegistro?: string;
        FechaEdicion?: string;
        UnidadCarga: string;
        TipoCarga?:  string;
        Activo: boolean;
    }
}
