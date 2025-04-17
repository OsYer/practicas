namespace N_Mascotas {
  export interface Mascota {
    Id: number;
    Nombre: string;
    Edad: number;
    Especie: string;
    Raza: string;
    Peso: number;
    Sexo: string;
    FechaRegistro?: string;
    FechaEdicion?: string;
    Activo?: boolean;
    IdUsuario: number;
  }
}
