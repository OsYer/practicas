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
    FechaRegistro: string;   // puede ser Date o string, dependiendo de cómo lo manejes
    FechaEdicion: string;    // puede ser Date o string
    Activo: boolean;
}}
