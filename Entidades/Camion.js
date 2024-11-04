import Vehiculo from "./Vehiculo.js";

class Camion extends Vehiculo {

    carga;
    autonomia;

    constructor(id, modelo, anoFabricacion, velMax, carga, autonomia){
        super(id, modelo, anoFabricacion, velMax);
        this.carga = carga;
        this.autonomia = autonomia;
    }
}

export default Camion;