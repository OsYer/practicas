namespace Nm_Vehiculos {
    export class editarVehiculo {
        mostrar(vehiculo: Vehiculo): Promise<Vehiculo> {
            // Lógica para editar un vehículo
            return new Promise((resolve) => {
                // Simula la edición del vehículo
                setTimeout(() => {
                    console.log(`Editando vehículo: ${vehiculo.Placa}`);
                    resolve(vehiculo); // Devuelve el vehículo editado
                }, 1000);
            });
        }
    }
}
