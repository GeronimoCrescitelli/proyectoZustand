import { useShallow } from "zustand/shallow"
import { tareaStore } from "../store/tareaStore"
import { editarTarea, eliminarTareaPorId, getAllTareas, postNuevaTarea } from "../http/tareas"
import type { ITarea } from "../types/iTarea"
import Swal from "sweetalert2"



export const useTareas = () => {

    const {tareas, setArrayTareas, agregarNuevaTarea, eliminarUnaTarea, editarUnaTarea} = tareaStore(useShallow((state)=>({
        tareas: state.tareas,
        setArrayTareas: state.setArrayTareas,
        agregarNuevaTarea: state.agregarNuevaTarea,
        eliminarUnaTarea: state.eliminarUnaTarea,
        editarUnaTarea: state.editarUnaTarea,
    })))

    const getTareas = async()=>{
        const data = await getAllTareas();
        if (data) setArrayTareas(data);
    }

    const crearTarea = async(nuevaTarea:ITarea)=>{
        agregarNuevaTarea(nuevaTarea);
        Swal.fire("Hecho!", "Tarea creada de manera exitosa!", "success")
       try {
        await postNuevaTarea(nuevaTarea);
       } catch (error) {
        eliminarUnaTarea(nuevaTarea.id!)
        console.log("Algo salio mal al crear la tarea")
       }
    }

    const putTareaEditar = async(tareaEditada:ITarea)=>{
       
        const estadoPrevio = tareas.find((el)=>el.id === tareaEditada.id)
        editarTarea(tareaEditada)
       Swal.fire("Hecho!", "Tarea editada de manera exitosa!", "success")
        try {
        await editarUnaTarea(tareaEditada);
       } catch (error) {
          if(estadoPrevio)  editarTarea(estadoPrevio);
          console.log("Algo salio mal al editar")
       }
    }

    const eliminarTarea = async(idTarea: string)=>{
       const estadoPrevio = tareas.find((el)=>el.id === idTarea)
        eliminarUnaTarea(idTarea);
        const confirm = await Swal.fire(
            {title: "Desea eliminar esta tarea?", 
              text:  "Una vez eliminada no hay vuelta atras", 
              icon: "warning",
              showCancelButton: true,
              confirmButtonText:  "Eliminar",
                cancelButtonText: "Cancelar"
              }   )
       
        if(!confirm.isConfirmed) return;
        eliminarTarea(idTarea);      
        try {
            await eliminarTareaPorId(idTarea);
            Swal.fire("Hecho!", "Tarea eliminada correctamente!", "success")
       
        } catch (error) {
            if (estadoPrevio) agregarNuevaTarea(estadoPrevio)
            console.log("Algo salio mal al eliminar una tarea")
        }
    }


  return {
    tareas, getTareas,crearTarea, putTareaEditar, eliminarTarea, agregarNuevaTarea
  }  
}

