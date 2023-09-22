import { useEffect, useReducer, useState } from "react"
// import { useReducer } from "react";
import { Footer } from "./components/Header/Footer/Footer"
import { FormularioTareas } from "./components/Header/FormularioTarea/FormularioTareas"
import { Header } from "./components/Header/Header"
import { Tareas } from "./components/Tareas/Tareas"
import { tareaReduce } from "./reducers/tareaReduce"
import Swal from 'sweetalert2';

export const App = () => {
    
    const init = () => {
        return JSON.parse(localStorage.getItem("tareas")) || []
    }

    const [state, dispatch] = useReducer(tareaReduce, [], init)
    
    const [descripcion, setDescipcion] = useState("")

    useEffect(() => {
        localStorage.setItem("tareas", JSON.stringify(state))
    }, [state])

    const handleInputChange = (evento) => {
        setDescipcion(evento.target.value)
        console.log(descripcion)
    }
    const handleSubmit = (evento) => {
        evento.preventDefault();
        if (!descripcion.trim()) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'El campo de descripción no puede estar vacío.',
              });
              return;
          }
        const tareaNueva = {
            id: new Date().getTime(),
            descripcion: descripcion,
            realizado: false
        }
        const action = {
            type:"agregar",
            payload: tareaNueva,
        }
        dispatch(action)
        setDescipcion("");
        Swal.fire({
            icon: 'success',
            title: 'Tarea agregada',
            text: 'La tarea se ha agregado correctamente.',
          });
    }


    const handelCambiar = (id) => {
        dispatch({
            type: "cambiar",
            payload: id
        })

    }
    const handelEliminar = (id) => {
      
        Swal.fire({
            title: '¿Estás seguro?',
            text: `¿Deseas eliminar la tarea?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
          }).then((result) => {
            if (result.isConfirmed) {
                // El usuario confirmó la eliminación, puedes eliminar la tarea aquí
                dispatch({
                  type: "borrar",
                  payload: id
                });
          
                Swal.fire('Tarea eliminada', 'La tarea ha sido eliminada correctamente.', 'success');
              }
            });

    }
    // console.log(state)
    let terminadas = 0;
    for (let i = 0; i < state.length; i++) {
        if (state[i].realizado === true) {
            terminadas++;
        }

    }
    let porcentaje = terminadas / state.length
    // console.log(porcentaje)
    // const tareas = ["Estudiar react", "ver tele", "Terminar apuntes", "Hacer tarea de Cross", "Hacer Maqueta de Flutter", "Hacer Hola Mundo"]
    return (
        <>
            <Header />
           
            <div className="container">
                <div className="row">
                    <div className="col-md-5 col-xs-12 text-center p-0 d-flex justify-content-center">
                        <FormularioTareas descripcion={descripcion} handleInputChange={handleInputChange} handleSubmit={handleSubmit} />
                    </div>
                    <div className="col-md-7 col-xs-12 d-flex justify-content-center p-0">
                        <div className="row row-cols-1 row-cols-md-2 g-4 ">
                            {
                                state.map((tarea, index) => {
                                    return (

                                        <Tareas key={index} handelCambiar={handelCambiar} handelEliminar={handelEliminar} porcentaje={porcentaje} tarea={tarea} id={tarea.id} index={index} />

                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Footer porcentaje={porcentaje} />
        </>
    )
};