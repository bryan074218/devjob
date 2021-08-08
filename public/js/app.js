import axios from 'axios';
import Swal from 'sweetalert2';


document.addEventListener('DOMContentLoaded', ()=>{
    const skill = document.querySelector('.lista-conocimientos');   

    //limpiando las alertas
    let alerta = document.querySelector('.alertas');
    if(alerta){
        limpiarAlerta();
    }



    if(skill){
        skill.addEventListener('click', agregarSkill);

        //una ves estando en editar llamar la funcion
        skillSeleccionado();
    }

    const vacantesListado = document.querySelector('.panel-administracion');
    if(vacantesListado){
        vacantesListado.addEventListener('click', accionesListado);
    }
});

const skill = new Set();
const agregarSkill = (e)=>{
    if(e.target.tagName === 'LI'){
        if(e.target.classList.contains('activo')){
            //quitarlo del set
            skill.delete(e.target.textContent);
            e.target.classList.remove('activo');
        }else{
            //agregarlo a la clase
            skill.add(e.target.textContent);
            e.target.classList.add('activo');
        }


    }
    const skillArrays = [...skill];
    document.querySelector('#skills').value = skillArrays;
}

const skillSeleccionado= ()=>{
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo'));

    seleccionadas.forEach(seleccionada=>{
        skill.add(seleccionada.textContent); 
    })

    //inyectarlor en el hidden
    const skillArrays = [...skill];
    document.querySelector('#skills').value = skillArrays;
}


const limpiarAlerta = () =>{
    const alertas = document.querySelector('.alertas');
    const interval = setInterval(()=>{
        if(alertas.children.length >0){
            alertas.removeChild(alertas.children[0]);
        }else if(alertas.children.length ===0){
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    },2000);
}
//eliminar vacantes
const accionesListado = e => {
    e.preventDefault();

    if(e.target.dataset.eliminar){
        // eliminar por axios
        Swal.fire({
            title: '¿Confirmar Eliminación?',
            text: "Una vez eliminada, no se puede recuperar",
            type: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText : 'No, Cancelar'
          }).then((result) => {
            if (result.value) {

                // enviar la petición con axios
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;

                // Axios para eliminar el registro
                axios.delete(url, { params: {url} })
                    .then(function(respuesta) {
                        if(respuesta.status === 200) {
                            Swal.fire(
                                'Eliminado',
                                respuesta.data,
                                'success'
                            );

                            //Eliminar del DOM
                            // console.log(e.target);
                            // e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                        }
                    })
                    .catch(() => {
                        Swal.fire({
                            type:'error',
                            title: 'Hubo un error',
                            text: 'No Se pudo eliminar'
                        })
                    })



             
            }
          })
    }  else if(e.target.tagName === 'A') {
        window.location.href = e.target.href;
    }
}