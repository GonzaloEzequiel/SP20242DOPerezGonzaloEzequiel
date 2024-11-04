import Vehiculo from "./Vehiculo.js";

class Auto extends Vehiculo {

    cantidadPuertas;
    asientos;

    constructor(id, modelo, anoFabricacion, velMax, cantidadPuertas, asientos) {
        super(id, modelo, anoFabricacion, velMax);
        this.cantidadPuertas = cantidadPuertas;
        this.asientos = asientos;
    }

}

export default Auto;