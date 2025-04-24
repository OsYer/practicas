namespace Nm_Mascotas {
    export let UsuariosActivos: Usuario[] = [];

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
    }

    export interface Usuario {
        Id: number;
        Nombre: string;
        Correo: string;
        Telefono: string;
        Direccion: string;
        Activo: boolean;
    }

    export async function cargarUsuarios(): Promise<void> {
        if (UsuariosActivos.length === 0) {
            const res = await fetch(Nm_Mascotas.URL_BASE + "/ServicioMascotas.svc/ObtenerUsuarios");
            UsuariosActivos = await res.json();
        }
    }
}
