var N_Mascotas;
(function (N_Mascotas) {
    class Cls_Mascotas {
        constructor() {
            this.mascotas = new Map();
            // Inicialización de los campos de entrada
            this.iniciarFormulario(); // Iniciar formulario de entrada
        }
        // Método para iniciar el formulario
        iniciarFormulario() {
            // Crear el formulario para agregar una mascota
            d3.select("body")
                .append("div")
                .attr("id", "ventana-mascotas")
                .style("display", "block")
                .style("margin-top", "20px")
                .style("padding", "20px")
                .style("border", "2px solid #ccc")
                .style("background-color", "#f9f9f9")
                .style("border-radius", "8px")
                .append("h3")
                .text("Formulario para agregar una mascota");
            d3.select("#ventana-mascotas")
                .append("form")
                .attr("id", "form-mascota")
                .html(`
                    <label>ID: <input type="number" id="input-id"></label><br>
                    <label>Nombre: <input type="text" id="input-nombre"></label><br>
                    <label>Especie: <input type="text" id="input-especie"></label><br>
                    <label>Raza: <input type="text" id="input-raza"></label><br>
                    <label>Edad: <input type="number" id="input-edad"></label><br>
                    <label>Peso: <input type="number" step="0.1" id="input-peso"></label><br>
                    <label>Sexo: <input type="text" id="input-sexo"></label><br>
                    <label>ID Usuario: <input type="number" id="input-id-usuario"></label><br>
                    <button type="button" id="btn-agregar">Agregar Mascota</button>
                `);
            // Inicializar los campos de entrada
            this.inputId = d3.select('#input-id');
            this.inputNombre = d3.select('#input-nombre');
            this.inputEspecie = d3.select('#input-especie');
            this.inputRaza = d3.select('#input-raza');
            this.inputEdad = d3.select('#input-edad');
            this.inputPeso = d3.select('#input-peso');
            this.inputSexo = d3.select('#input-sexo');
            this.inputIdUsuario = d3.select('#input-id-usuario');
            // Agregar el evento al botón de agregar mascota
            d3.select('#btn-agregar').on('click', () => this.agregarMascota());
        }
        // Método para agregar una nueva mascota
        agregarMascota() {
            const id = parseInt(this.inputId.property('value'));
            const nombre = this.inputNombre.property('value');
            const especie = this.inputEspecie.property('value');
            const raza = this.inputRaza.property('value');
            const edad = parseInt(this.inputEdad.property('value'));
            const peso = parseFloat(this.inputPeso.property('value'));
            const sexo = this.inputSexo.property('value');
            const idUsuario = parseInt(this.inputIdUsuario.property('value'));
            // Crear un objeto Mascota
            const nuevaMascota = {
                id: id,
                nombre: nombre,
                especie: especie,
                raza: raza,
                edad: edad,
                peso: peso,
                sexo: sexo,
                id_usuario: idUsuario
            };
            // Llamar al backend para insertar la mascota
            this.insertarMascotaEnBackend(nuevaMascota);
            // Limpiar los campos de entrada después de agregar
            this.limpiarCampos();
            console.log('Mascota agregada:', nuevaMascota);
        }
        // Método para insertar la mascota en el backend (servicio WCF)
        insertarMascotaEnBackend(mascota) {
            // Enviar una solicitud POST a la API WCF para insertar la mascota en la base de datos
            fetch('http://localhost:63221/Mascotas.svc/mascota', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(mascota) // Convertimos el objeto mascota en JSON
            })
                .then(response => response.json())
                .then(data => {
                console.log('Respuesta del servidor:', data);
            })
                .catch(error => {
                console.error('Error al insertar la mascota:', error);
            });
        }
        // Método para limpiar los campos de entrada
        limpiarCampos() {
            this.inputId.property('value', '');
            this.inputNombre.property('value', '');
            this.inputEspecie.property('value', '');
            this.inputRaza.property('value', '');
            this.inputEdad.property('value', '');
            this.inputPeso.property('value', '');
            this.inputSexo.property('value', '');
            this.inputIdUsuario.property('value', '');
        }
        // Método para mostrar las mascotas
        mostrarMascotas() {
            this.mascotas.forEach((mascota) => {
                console.log(mascota);
            });
        }
    }
    N_Mascotas.Cls_Mascotas = Cls_Mascotas;
})(N_Mascotas || (N_Mascotas = {}));
//# sourceMappingURL=mascotas.js.map