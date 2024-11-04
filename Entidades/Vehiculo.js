class Vehiculo {
    id;
    modelo;
    anoFabricacion;
    velMax;

    constructor(id, modelo, anoFabricacion, velMax) {
        this.id = id;
        this.modelo = modelo;
        this.anoFabricacion = anoFabricacion;
        this.velMax = velMax;
    }

    toString() {
        return JSON.stringify(this);
    }
}

export default Vehiculo;