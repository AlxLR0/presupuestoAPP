//variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');
let presupuesto;

//eventos

addEventListener();
function addEventListener() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto)
}

//clases
class Presupuesto {
    constructor(Presupuesto) {
        this.Presupuesto = Number(Presupuesto);
        this.restante = Number(Presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
        this.gastos= [...this.gastos,gasto]; 
        console.log(this.gastos);
        this.calcularRestante();
        
    }
    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        
        this.restante = this.Presupuesto - gastado; 
    
       
    }
    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        console.log(this.gastos);
        this.calcularRestante();
        
    }
    
}

class UI {
    insertarPresupuesto(cantidad){
         // Aquí necesitas acceder a las propiedades que definiste en la clase Presupuesto
         const { Presupuesto, restante } = cantidad; // Desestructurando correctamente el objeto
        
         document.querySelector('#total').textContent = Presupuesto; // Cambié 'presupuesto' por 'Presupuesto'
         document.querySelector('#restante').textContent = restante; 
    }

    imprimirAlerta(mensaje,tipo){
        //crear div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center','alert');

        if (tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        }else{
            divMensaje.classList.add('alert-success');
        }
        //mensaje error
        divMensaje.textContent = mensaje;

        //insertar en el html
        document.querySelector('.primario').insertBefore(divMensaje,formulario);

        //quitar el html
        setTimeout(()=>{
            divMensaje.remove();
        },2000);

    }

    agregarGastoListado(gastos){
        
        this.limpiarHTML();//elimina html previo

        //iterar sobre los gastos
        gastos.forEach(gasto => {
            const {cantidad, nombre, id} = gasto;

            //crear un li
            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            nuevoGasto.dataset.id = id;
            console.log(nuevoGasto);
            

            //agregar html del gasto
            nuevoGasto.innerHTML =`${nombre}<span class="badge badge-primary badge-pill">$ ${cantidad} </span>`;

            //boton para borrar el gasto
            const btnBorrar = document.createElement('button');
            btnBorrar.classList.add('btn', 'btn-danger','borrar-gasto');
            btnBorrar.innerHTML = 'Borrar &times';
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            }
            nuevoGasto.appendChild(btnBorrar);



            //agregar html
            gastoListado.appendChild(nuevoGasto);
            
        });
    }

    limpiarHTML(){
        while (gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = ` ${restante}`; // Asegúrate de pasar el número correcto
    }

    //comprobar el gasto que hizo el user y cambiar los colores
    comprobarPresupuesto(presupuestoObj) {
        const { Presupuesto, restante } = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');
    
    
        // Comprobar si el restante es menor o igual al 25% del presupuesto
        if (restante <= Presupuesto * 0.25 && restante > 0) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
            alertaToast('75% del presupuesto gastado', 'warning');
            
        } else if (restante <= Presupuesto * 0.50 && restante > Presupuesto * 0.25) {
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');
            alertaToast('50% del presupuesto gastado', 'warning');
            
        } else if (restante > Presupuesto * 0.50) {
            restanteDiv.classList.remove('alert-danger', 'alert-warning');
            restanteDiv.classList.add('alert-success');
        }

        // Si el presupuesto llega exactamente a 0
        if (restante === 0) {
            restanteDiv.classList.remove('alert-success', 'alert-warning', 'alert-danger');
            restanteDiv.classList.add('alert-danger');
            alertaToast('100% del presupuesto gastado', 'warning');

            formulario.querySelector('button[type=submit]').disabled=true;//para deshabilitar el btn del formulario
        }

        // Si el presupuesto es negativo
        if (restante < 0) {
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
            alertaToast('¡Has excedido tu presupuesto!', 'error');
            formulario.querySelector('button[type=submit]').disabled=true;//para deshabilitar el btn del formulario
        }
    }
    
    
    
}

                //se entiende como mensaje, al mensaje que incluye el toast y tipo al cual de todos los toast va a mandar llamar
function alertaToast(mensaje,tipo){
    if (tipo === 'warning') {
        const Toast = Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "warning",
            title: `${mensaje}`
          });
        
    }else if (tipo === 'error'){
        const Toast = Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 5000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "error",
            title: `${mensaje}`
          });
    }

    if (tipo === 'success') {
        const Toast = Swal.mixin({
            toast: true,
            position: "bottom-end",
            showConfirmButton: false,
            timer: 2000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: `${mensaje}`
          });
    }
    
}




//instancia
const ui = new UI();


//funciones
function preguntarPresupuesto() {
    // const presupuestoUsuario = ventanaInput();
    const presupuestoUsuario = prompt('ingresa presupuesto');

    console.log(Number(presupuestoUsuario));
    

    if (presupuestoUsuario==='' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <=0) {
        window.location.reload();
    }

    //presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
    
}

function agregarGasto(e) {
    e.preventDefault();

    // leer datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    // validar
    if (nombre === "" || cantidad === "") {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if (cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no válida', 'error');
        return;
    }

    // crear un objeto con el gasto
    const gasto = { nombre, cantidad, id: Date.now() };

    // añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    // mensaje de success
    ui.imprimirAlerta('Gasto agregado correctamente');

    // imprimir los gastos
    const { gastos, restante } = presupuesto; // Aquí obtienes el restante del objeto presupuesto
    ui.agregarGastoListado(gastos);

    // Actualiza el restante en la interfaz
    ui.actualizarRestante(restante); // Asegúrate de que 'restante' sea un número

    //para poder comprobar el presupuesto y poder cambiar el color del presupuesto restante
    ui.comprobarPresupuesto(presupuesto);

    // Resetear el formulario
    formulario.reset();
}


function ventanaInput() {
    Swal.fire({
        title: "¿Cual es tu presupuesto?",
        input: "text",
        inputAttributes: {
          autocapitalize: "off"
        },
        showCancelButton: true,
        confirmButtonText: "Aceptar",
        showLoaderOnConfirm: true,
        inputValidator: (value) => {
            if (!value || value <=0) {
              return "Ingresa un presupuesto valido!";
            }
          }
        
    });
}

function eliminarGasto(id) {
    //Elimina del objeto
    presupuesto.eliminarGasto(id);

    //elimina los gastos del HTML
    const {gastos,restante} = presupuesto;
    ui.agregarGastoListado(gastos);

    // Actualiza el restante en la interfaz
    ui.actualizarRestante(restante); // Asegúrate de que 'restante' sea un número

    //para poder comprobar el presupuesto y poder cambiar el color del presupuesto restante
    ui.comprobarPresupuesto(presupuesto);

    alertaToast('¡Presupuesto liberado!', 'success');
    formulario.querySelector('button[type=submit]').disabled=false;
}