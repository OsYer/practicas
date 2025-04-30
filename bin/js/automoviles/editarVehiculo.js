var Nm_Vehiculos;
(function (Nm_Vehiculos) {
    class editarVehiculo {
        mostrar(vehiculo) {
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
    Nm_Vehiculos.editarVehiculo = editarVehiculo;
})(Nm_Vehiculos || (Nm_Vehiculos = {}));
//# sourceMappingURL=editarVehiculo.js.map