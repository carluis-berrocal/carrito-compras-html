// carrito.js

// Seleccionamos los elementos del DOM necesarios para manejar el carrito
const carrito = document.querySelector("#carrito"); // Contenedor del carrito
const listaCursos = document.querySelector("#lista-cursos"); // Lista de cursos disponibles
const contenedorCarrito = document.querySelector("#lista-carrito tbody"); // Tabla donde se mostrarán los cursos agregados
const vaciarCarritoBtn = document.querySelector("#vaciar-carrito"); // Botón para vaciar el carrito
const contador = document.querySelector('#contador-carrito'); // Contador de cursos en el carrito
// Array donde almacenaremos los cursos agregados al carrito
let articulosCarrito = [];

// Objeto `Carrito` que encapsula toda la funcionalidad del carrito
const Carrito = {
    /**
     * Inicializa los event listeners del carrito.
     * Este método debe ser llamado una sola vez al cargar la página.
     */
    inicializar() {
        this.alert("info", "Bienvenido a la tienda de cursos");
        listaCursos.addEventListener("click", this.agregarCurso);
        carrito.addEventListener("click", this.eliminarCurso);
        vaciarCarritoBtn.addEventListener("click", this.limpiarCarrito);
    },

    /**
     * Captura el evento de "Agregar al carrito" y obtiene la información del curso.
     * @param {Event} e - Evento de clic en un botón "Agregar al carrito".
     */
    agregarCurso(e) {
        e.preventDefault();
        if (e.target.classList.contains("agregar-carrito")) {
            // Buscamos el elemento padre que contiene toda la información del curso
            const curso = e.target.parentElement.parentElement;
            // console.log(curso);
            // return
            Carrito.leerDatosCurso(curso);
        }
    },

    /**
     * Extrae la información del curso seleccionado y lo agrega al carrito.
     * @param {HTMLElement} curso - Elemento HTML que contiene la información del curso.
     */
    leerDatosCurso(curso) {
        // Extraemos la información relevante del curso
        const infoCurso = {
            imagen: curso.querySelector("img").src, // URL de la imagen
            titulo: curso.querySelector("h4").textContent, // Nombre del curso
            precio: curso.querySelector(".precio span").textContent, // Precio del curso
            id: curso.querySelector("a").getAttribute("data-id"), // ID del curso
            cantidad: 1, // Inicialmente se agrega 1 unidad
        };

        // Verificamos si el curso ya está en el carrito
        const existe = articulosCarrito.find((curso) => curso.id === infoCurso.id);
        if (existe) {
            // Si el curso ya está en el carrito, aumentamos la cantidad
            existe.cantidad++;
        } else {
            // Si no existe, lo agregamos al array del carrito
            articulosCarrito.push(infoCurso);
        }
        Carrito.alert("success", "Curso agregado al carrito");
        // Actualizamos el contenido del carrito en el DOM
        Carrito.renderizar();
    },

    /**
     * Elimina un curso del carrito según su ID.
     * @param {Event} e - Evento de clic en un botón "Eliminar".
     */
    eliminarCurso(e) {
        e.preventDefault();
        if (e.target.classList.contains("borrar-curso")) {
            // Obtenemos el ID del curso que se quiere eliminar
            const cursoId = e.target.getAttribute("data-id");

            // Filtramos el array para eliminar el curso con ese ID
            articulosCarrito = articulosCarrito.filter((curso) => curso.id !== cursoId);
            Carrito.alert("success", "Curso eliminado del carrito");
            // Volvemos a renderizar el carrito
            Carrito.renderizar();
        }
    },

    limpiarCarrito() { 
        if (articulosCarrito.length === 0) {
            Carrito.alert("warning", "El carrito ya está vacío");
            return;
        }
        Swal.fire({
            title: "Esta seguro de Limpiar el Carrito?",
            text: "No podras revertir esto!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Si, vaciar carrito!"
          }).then((result) => {
            if (result.isConfirmed) {
                Swal.fire({
                    title: "Eliminado!",
                    text: "Carrito limpiado correctamente.",
                    icon: "success"
                });
                Carrito.vaciarCarrito();
                articulosCarrito = []; // Limpiamos el array de cursos
                contador.textContent = 0;
                
            }
        });
    },

    /**
     * Muestra el carrito en el HTML, creando filas para cada curso agregado.
     */
    renderizar() {
        // Limpiamos el contenido previo del carrito
        Carrito.vaciarCarrito();
    
        let totalProductos = 0; // acumulador de cantidades
    
        // Recorremos el array de cursos y los agregamos a la tabla
        articulosCarrito.forEach((curso) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td><img src="${curso.imagen}" width="100"></td>
                <td>${curso.titulo}</td>
                <td>${curso.precio}</td>
                <td>${curso.cantidad}</td>
                <td><a href="#" class="borrar-curso" data-id="${curso.id}">X</a></td>
            `;
            contenedorCarrito.appendChild(row);
    
            totalProductos += curso.cantidad; // sumamos la cantidad del producto actual
        });
    
        // Actualizamos el contador de cursos en el carrito
        contador.textContent = totalProductos;
    
    },
    

    /**
     * Vacía completamente el carrito en el DOM.
     */
    vaciarCarrito() {
        // Mientras existan elementos dentro de la tabla, los eliminamos
        while (contenedorCarrito.firstChild) {
            contenedorCarrito.removeChild(contenedorCarrito.firstChild);
        }
       
    },

    finalizarVenta() {
        articulosCarrito = []; // Limpiamos el array de cursos
        Carrito.renderizar(); // Actualizamos el carrito en el DOM
        Swal.fire({
            title: "Compra realizada!",
            text: "Gracias por su compra.",
            icon: "success",
            confirmButtonText: "Aceptar"
        });
    },

    /**
     * Devuelve los productos actualmente en el carrito.
     * @returns {Array} - Lista de productos en el carrito.
     */
    obtenerProductos() {
        return articulosCarrito.map(producto => ({
            code_reference: producto.id,
            name: producto.titulo,
            quantity: producto.cantidad,
            discount_rate: 0, // Si hay descuentos, se pueden calcular aquí
            price: parseFloat(producto.precio.replace(/[^0-9.-]+/g, "")), // Convertimos a número
            tax_rate: 0, // Ajustar según el producto si es necesario
            unit_measure_id: 70,
            standard_code_id: 1,
            is_excluded: 0,
            tribute_id: 1,
            withholding_taxes: [] // Si hay impuestos de retención, agregarlos aquí
        }));
    },

    alert(accion, mensaje) {
        // Usamos SweetAlert para mostrar una notificación de toast
        const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: accion,
            title: mensaje,
          });
    }
};

// Exportamos el objeto Carrito para poder usarlo en otros archivos
export { Carrito };
