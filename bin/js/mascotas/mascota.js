var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var Nm_Mascotas;
(function (Nm_Mascotas) {
    Nm_Mascotas.UsuariosActivos = [];
    function cargarUsuarios() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Nm_Mascotas.UsuariosActivos.length === 0) {
                const res = yield fetch(Nm_Mascotas.URL_BASE + "/ServicioMascotas.svc/ObtenerUsuarios");
                Nm_Mascotas.UsuariosActivos = yield res.json();
            }
        });
    }
    Nm_Mascotas.cargarUsuarios = cargarUsuarios;
})(Nm_Mascotas || (Nm_Mascotas = {}));
//# sourceMappingURL=mascota.js.map