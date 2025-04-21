namespace Nm_Mascotas {
    export interface Mascota {
    Id: number;
    Nombre: string;
    Especie: string;
    Raza: string;
    Edad: number;
    Peso: number;
    Sexo: string;
    IdUsuario: number;
    FechaRegistro?: string;
    FechaEdicion?: string;
    Activo?: boolean;
}}
