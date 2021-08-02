document.addEventListener('DOMContentLoaded', ()=>{
    const skill = document.querySelector('.lista-conocimientos');   
    if(skill){
        skill.addEventListener('click', agregarSkill);

        //una ves estando en editar llamar la funcion
        skillSeleccionado();
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

