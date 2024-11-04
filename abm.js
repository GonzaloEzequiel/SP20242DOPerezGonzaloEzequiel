import Auto from "./Entidades/Auto.js";
import Camion from "./Entidades/Camion.js";

var frm_LST = document.getElementById("formLista");
var frm_ABM = document.getElementById("formABM");
var spinner = document.getElementById("spinner");

var urlServidor = "https://examenesutn.vercel.app/api/VehiculoAutoCamion";

var vehiculos;

var btnAgregar = document.getElementById("btn_agregar");
btnAgregar.addEventListener("click", () => { MostrarABM(vehiculos) });

var titulo_operacion = document.getElementById("operacion_ABM");
var frm_id = document.getElementById("frm_id");
var frm_modelo = document.getElementById("frm_modelo");
var frm_anoFabricacion = document.getElementById("frm_anoFabricacion");
var frm_velMax = document.getElementById("frm_velMax");
var frm_tipo = document.getElementById("frm_tipo");
frm_tipo.addEventListener("change", (e) => {   
    e.preventDefault();                     
    if(frm_tipo.value == "Auto") {

        lblAtr3.textContent = "cantidadPuertas: ";
        lblAtr4.textContent = "asientos: ";
    }
    else{

        lblAtr3.textContent = "carga: ";
        lblAtr4.textContent = "autonomia: ";
    }
});
var lblAtr3 = document.getElementById("lbl_atr3"); 
var frm_atr3 = document.getElementById("frm_atr3");
var lblAtr4 = document.getElementById("lbl_atr4");
var frm_atr4 = document.getElementById("frm_atr4");
var btn_aceptar = document.getElementById("btn_aceptar");
var btn_cancelar = document.getElementById("btn_cancelar");
btn_cancelar.addEventListener("click", (e) => {
    e.preventDefault();
    MostrarDatos(vehiculos);
})

/**
 * Funcion principal de carga de datos iniciales que se ejecuta al "cargar la ventana" (window load)
 */
function Main(){     
    
    let vehiculosJSON;

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        
        bloqueaLaPantalla("Cargando datos iniciales ...")

        if (xhttp.readyState == 4) {
            if (xhttp.status==200){

                vehiculosJSON = JSON.parse(xhttp.response);

                vehiculos = vehiculosJSON.map( (vehiculo) => {

                    if(vehiculo.hasOwnProperty("cantidadPuertas")){
                        return new Auto(vehiculo.id, vehiculo.modelo, vehiculo.anoFabricacion, vehiculo.velMax, vehiculo.cantidadPuertas, vehiculo.asientos);                  
                    }
                    else if(vehiculo.hasOwnProperty("carga")) {
                        return new Camion(vehiculo.id, vehiculo.modelo, vehiculo.anoFabricacion, vehiculo.velMax, vehiculo.carga, vehiculo.autonomia);
                    }

                });

                DibujarTabla(vehiculos);                
                desbloqueaLaPantalla();
            
            }else{
                alert("Error al cargar los datos iniciales");
            }
        }        
        
    }; 
    xhttp.open("GET", urlServidor); 
    xhttp.setRequestHeader('Content-type', 'application/json');
    xhttp.send();
    
}

/**
 * Pobla la tabla del Formulario Lista con los elementos del array
 * @param {*} array elementos para poblar la tabla
 */
function DibujarTabla(array){

    let tabla = document.getElementById("tabla_cuerpo");
    let auxFila;
    let auxCelda;
    let auxBoton;
    
    BorrarTabla();

    array.forEach(vehic => {

        if(vehic instanceof Auto || vehic instanceof Camion) {

            auxFila = document.createElement("tr");
            auxFila.setAttribute("idElemento", vehic.id);

            auxCelda = document.createElement("td");
            auxCelda.appendChild(document.createTextNode(vehic.id));
            auxFila.appendChild(auxCelda);

            auxCelda = document.createElement("td");
            auxCelda.appendChild(document.createTextNode(vehic.modelo));
            auxFila.appendChild(auxCelda);

            auxCelda = document.createElement("td");
            auxCelda.appendChild(document.createTextNode(vehic.anoFabricacion));
            auxFila.appendChild(auxCelda);
            
            auxCelda = document.createElement("td");
            auxCelda.appendChild(document.createTextNode(vehic.velMax));
            auxFila.appendChild(auxCelda);
            
            auxCelda = document.createElement("td");
            if(vehic instanceof Auto) {
                auxCelda.appendChild(document.createTextNode(vehic.cantidadPuertas));
            }
            else{
                auxCelda.appendChild(document.createTextNode("N/A"));
            }
            auxFila.appendChild(auxCelda);
            
            auxCelda = document.createElement("td");
            if(vehic instanceof Auto) {
                auxCelda.appendChild(document.createTextNode(vehic.asientos));
            }
            else{
                auxCelda.appendChild(document.createTextNode("N/A"));
            }
            auxFila.appendChild(auxCelda);
            
            auxCelda = document.createElement("td");
            if(vehic instanceof Camion) {
                auxCelda.appendChild(document.createTextNode(vehic.carga));
            }
            else{
                auxCelda.appendChild(document.createTextNode("N/A"));
            }
            auxFila.appendChild(auxCelda);
            
            auxCelda = document.createElement("td");
            if(vehic instanceof Camion) {
                auxCelda.appendChild(document.createTextNode(vehic.autonomia));
            }
            else{
                auxCelda.appendChild(document.createTextNode("N/A"));
            }
            auxFila.appendChild(auxCelda);
            
            auxCelda = document.createElement("td");
            auxBoton = document.createElement("button");
            auxBoton.appendChild(document.createTextNode("Modificar"));
            auxBoton.setAttribute("id", "modificar_"+vehic.id);
            auxBoton.addEventListener("click", () => { MostrarABM(vehic) })
            auxCelda.appendChild(auxBoton);
            auxFila.appendChild(auxCelda);

            auxCelda = document.createElement("td");
            auxBoton = document.createElement("button");
            auxBoton.appendChild(document.createTextNode("Eliminar"));
            auxBoton.setAttribute("id", "eliminar_"+vehic.id);
            auxBoton.addEventListener("click", () => { MostrarABM(vehic) })
            auxCelda.appendChild(auxBoton);
            auxFila.appendChild(auxCelda);

            tabla.appendChild(auxFila);
        }
    });
}

/**
 * Muestra el Formulario ABM para nuevas altas, o con los datos de un vehiculo para modificar o eliminar
 * @param {*} vehiculo vehiculo a modificar/eliminar
 */
function MostrarABM(vehiculo) {

    event.preventDefault();

    frm_LST.style.display = "none";
    frm_ABM.style.display = "block";

    if(event.currentTarget.id == "btn_agregar") {

        titulo_operacion.textContent = "Alta nuevo Vehiculo";
        frm_id.value = "Autogenerado";
        frm_modelo.value = null;
        frm_anoFabricacion.value = null;
        frm_velMax.value = null;
        frm_tipo.value = "";
        frm_atr3.value = null;
        frm_atr4.value = null;

        configurarBotonAceptar("alta");
    }
    else {

        frm_id.value = vehiculo.id;
        frm_modelo.value = vehiculo.modelo;
        frm_anoFabricacion.value = vehiculo.anoFabricacion;
        frm_velMax.value = vehiculo.velMax;
        frm_tipo.disabled = true;

        if(vehiculo instanceof Auto) {
            frm_tipo.value = "Auto";
            lblAtr3.textContent = "cantidadPuertas: ";
            lblAtr4.textContent = "asientos: ";
            frm_atr3.value = vehiculo.cantidadPuertas;
            frm_atr4.value = vehiculo.asientos;   
        }
        else {
            frm_tipo.value = "Camion";
            lblAtr3.textContent = "carga: ";
            lblAtr4.textContent = "autonomia: ";
            frm_atr3.value = vehiculo.carga;
            frm_atr4.value = vehiculo.autonomia;             
        }

        if(event.currentTarget.id.startsWith("modificar")) {

            titulo_operacion.textContent = "Modificar Vehiculo";
            configurarBotonAceptar("modificar", vehiculo);
    
        }
        else if(event.currentTarget.id.startsWith("eliminar")) {

            titulo_operacion.textContent = "Eliminar Vehiculo";
            configurarBotonAceptar("eliminar", vehiculo);
        }
    }
}

/**
 * Realiza el cambio entre formularios, ocultando el Formulario ABM y (limpiando y) mostrando el Formulario Lista actualizado
 * @param {*} array array de elementos a mostrar en lista
 */
function MostrarDatos(array) {

    frm_ABM.style.display = "none";
    frm_LST.style.display = "block";

    BorrarTabla();
    DibujarTabla(array);

}

/**
 * Limpia todos los elementos del Formulario Lista
 */
function BorrarTabla() {
    let tabla = document.getElementById("tabla_cuerpo");
    while(tabla.hasChildNodes()) {
        tabla.removeChild(tabla.lastChild);
    }
}

/**
 * Activa el Spinner y muestra un título informativo
 * @param {*} titulo título de la operación
 */
function bloqueaLaPantalla(titulo) {
    let mensaje = document.getElementById("titulo_spinner");
    mensaje.textContent = titulo;
    spinner.style.display = 'flex';
}

/**
 * Desactiva el Spinner cuando la operación finalizó
 */
function desbloqueaLaPantalla() {
    spinner.style.display = 'none';
}

/**
 * Realiza el alta de un nuevo vehiculo si los datos son respaldados por la petición asíncrona
 */
async function altaVehiculo() {

    if(validarDatosIngresados()) {

        bloqueaLaPantalla("Creando nuevo Vehiculo ...");

        let length = vehiculos.length;        
        let auxVehiculoJson = `{
                            "modelo":"${frm_modelo.value}",
                            "anoFabricacion":"${frm_anoFabricacion.value}",
                            "velMax":"${frm_velMax.value}",
                            "${lblAtr3.textContent.slice(0,-2)}":"${frm_atr3.value}",
                            "${lblAtr4.textContent.slice(0,-2)}":"${frm_atr4.value}"
                        }`;

        await fetch(urlServidor, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: auxVehiculoJson,
        })
        .then(response => response.json())
        .then((data) => { 
                
            frm_id.value = data.id;

            if(frm_tipo.value == "Auto")
            {
                try {
                    let auxAuto = new Auto(frm_id.value, frm_modelo.value, frm_anoFabricacion.value, frm_velMax.value, frm_atr3.value, frm_atr4.value);
                    vehiculos.push(auxAuto);
                }
                catch(error) {
                    alert(error);
                }
                
            }
            else if((frm_tipo.value=="Camion"))
            {
                try {
                    let auxCamion = new Camion(frm_id.value, frm_modelo.value, frm_anoFabricacion.value, frm_velMax.value, frm_atr3.value, frm_atr4.value);
                    vehiculos.push(auxCamion);
                }
                catch(error) {
                    alert(error);
                }                   
            }
        })
        .then( () => {

            desbloqueaLaPantalla();

            if(vehiculos.length > length) {
                MostrarDatos(vehiculos);
            }

        })
        .catch( error => {

            desbloqueaLaPantalla();
            MostrarDatos(vehiculos);
            alert(error);
            
        });

    }
        
}

/**
 * Realiza la modificación de un vehiculo existente si los datos son respaldados por la respuesta de la promesa
 * @param {*} vehiculo vehiculo a modificar
 */
function modificarVehiculo(vehiculo) {

    if(validarDatosIngresados()) {    

        bloqueaLaPantalla("Modificando Vehiculo ...");

        let auxVehiculoJson =`{
                            "id":"${frm_id.value}",
                            "modelo":"${frm_modelo.value}",
                            "anoFabricacion":"${frm_anoFabricacion.value}",
                            "velMax":"${frm_velMax.value}",
                            "${lblAtr3.textContent.slice(0,-2)}":"${frm_atr3.value}",
                            "${lblAtr4.textContent.slice(0,-2)}":"${frm_atr4.value}"
                        }`;

        fetch(urlServidor, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: auxVehiculoJson,
        })
        .then(respuesta => {

            if(respuesta.status == 200) {

                vehiculo.modelo = frm_modelo.value;
                vehiculo.anoFabricacion = frm_anoFabricacion.value;
                vehiculo.velMax = frm_velMax.value;
                vehiculo[lblAtr3.textContent.slice(0,-2)] = frm_atr3.value;
                vehiculo[lblAtr4.textContent.slice(0,-2)] = frm_atr4.value;

                MostrarDatos(vehiculos);
                desbloqueaLaPantalla();
            }
            else {
                return respuesta.text().then(errorText => {

                    throw new Error("No se pudo modificar el Vehiculo. " + errorText);

                })
            }        
        })
        .catch(error  => {
            alert( error);

            MostrarDatos(vehiculos);
            desbloqueaLaPantalla();
        });
    }
}

/**
 * Elimina un vehuiculo existente si los datos son respaldados por la respuesta de la petición
 * @param {*} vehiculo vehiculo a eliminar
 */
function eliminarVehiculo(vehiculo) {

    if(validarDatosIngresados()) {

        bloqueaLaPantalla("Eliminando  Vehiculo ...");

        fetch(urlServidor, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: `{"id":"${vehiculo.id}"}`,
        })
        .then(respuesta => {

            if(respuesta.status == 200) {
                return respuesta.text();
            }
            else{
                return respuesta.text().then(errorText => {

                    throw new Error("No se pudo eliminar el Vehiculo. " + errorText);

                })
            }
        })
        .then((textoRespuesta ) => {

            console.log("Texto de respuesta:", textoRespuesta);
            
            let indice = vehiculos.findIndex(vehiculo => vehiculo.id == frm_id.value);
            vehiculos.splice(indice, 1);       

        })
        .then(() => {

            MostrarDatos(vehiculos);
            desbloqueaLaPantalla();

        })
        .catch(error => { 
            alert(error);

            MostrarDatos(vehiculos);
            desbloqueaLaPantalla();    
        });
    }   
}

/**
 * Maneja los eventListeners de botón aceptar según el tipo de operación que se desea realizar
 * @param {*} tipo tipo de operación (alta/baja/modif)
 * @param {*} vehiculo vehiculo a modificar/eliminar
 */
function configurarBotonAceptar(tipo, vehiculo = null) {

    btn_aceptar.onclick = null;
    switch (tipo) {

        case "alta":

            btn_aceptar.onclick = altaVehiculo;
            break;

        case "modificar":

            btn_aceptar.onclick = () => modificarVehiculo(vehiculo);
            break;

        case "eliminar":
            btn_aceptar.onclick = () => eliminarVehiculo(vehiculo);
            break;

        default:
            break;
    }
}

/**
 * Valida los datos ingresados en los campos del Formulario ABM para las tres operaciones
 * @returns booleano indicando si los valores son correctos
 */
function validarDatosIngresados() {

    let todoEnOrden = true;

    console.log(todoEnOrden);

    if (!frm_id.value.match(/^\d+$/) || frm_id.value <= 0) {
        alert("El ID debe ser numérico y mayor a 0!.");
        todoEnOrden = false;
    }
    if (!frm_modelo.value.match(/^[a-zA-Z0-9 ]+$/) || frm_modelo.value == null) {
        alert("El Modelo debe ser un string no nulo!");
        todoEnOrden = false;
    }
    if (!frm_anoFabricacion.value.match(/^\d+$/) || frm_anoFabricacion.value <= 1985) {
        alert("El Año de Fabricación er numérico y mayor a 1985!.");
        todoEnOrden = false;
    }
    if (!frm_velMax.value.match(/^\d+(\.\d+)?$/) || frm_velMax.value <= 0) {
        alert("La Vel.Máx. debe ser numérica y mayor a 0!.");
        todoEnOrden = false;
    }
    if(frm_tipo.value == "Auto") {

        if(!frm_atr3.value.match(/^\d+(\.\d+)?$/) || frm_atr3.value <= 2) {
            alert("La Cantidad de Puertas debe ser numérica y mayor a 2!.");
            todoEnOrden = false;
        }
        if(!frm_atr4.value.match(/^\d+(\.\d+)?$/) || frm_atr4.value <= 2) {
            alert("La cantidad de Asientos debe ser numérica y mayor a 2!.");
            todoEnOrden = false;
        }
    }
    else if(frm_tipo.value == "Camion") {

        if(!frm_atr3.value.match(/^\d+(\.\d+)?$/) || frm_atr3.value <= 0) {
            alert("La catidad de Carga debe ser numérica y mayor a 0!.");
            todoEnOrden = false;
        }
        if(!frm_atr4.value.match(/^\d+(\.\d+)?$/) || frm_atr4.value <= 0) {
            alert("La Autonomía debe ser numérica y mayor a 0!.");
            todoEnOrden = false;
        }
    }

    return todoEnOrden;
}

window.addEventListener("load", Main);