namespace Nm_Vehiculos {
    export interface Vehiculo {
        Id?: number;
        Placa: string;
        CargaMaxima: number;
        Estado: string;
        FechaRegistro?: Date;
        FechaEdicion?: Date;
        UnidadCarga: string;
        Activo: boolean;
    }
}
