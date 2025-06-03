// modalPagos.js
import { conectarConFactus } from "./facturar.js"; // Importamos la función para conectar con Factus
import { Carrito } from "./carrito.js"; 
export const ModalPagos = {
    modal: null,
    btnAbrirModal: null,
    btnCerrarModal: null,

    inicializar() {
        this.modal = document.getElementById("modal-pagos");
        this.btnAbrirModal = document.getElementById("procesar-compra");
        this.btnCerrarModal = document.querySelector(".cerrar-modal");

        if (this.modal) {
            this.modal.style.display = "none"; // Asegurar que esté oculto al iniciar
        }

        if (this.btnAbrirModal) {
            this.btnAbrirModal.addEventListener("click", (e) => {
                e.preventDefault();
                // Obtener productos del carrito
                const productos = Carrito.obtenerProductos();

                // Verificar si hay productos antes de proceder
                if (productos.length === 0) {
                    Swal.fire(  
                        "Carrito",
                        "El carrito está vacío, agrega productos antes de pagar.",
                        "warning"
                    );
                    return;
                }
                this.abrirModal();
            });
        }

        if (this.btnCerrarModal) {
            this.btnCerrarModal.addEventListener("click", () => this.cerrarModal());
        }

        window.addEventListener("click", (e) => {
            if (e.target === this.modal) {
                this.cerrarModal();
            }
        });

        document.querySelectorAll(".pago-opcion").forEach(btn => {
            btn.addEventListener("click", function () {
                const metodoPago = this.getAttribute("data-metodo");
               
               
                // Obtener productos del carrito
                const productos = Carrito.obtenerProductos();

                // Cerrar el modal de pagos
                ModalPagos.cerrarModal();
                Carrito.finalizarVenta(); // Limpiar el carrito después de la compra

                // Llamar a Factus con los productos y el método de pago seleccionado
                // conectarConFactus(metodoPago, productos);
            });
        });
    },

    abrirModal() {
        if (this.modal) {
            this.modal.style.display = "flex";
        }
    },

    cerrarModal() {
        if (this.modal) {
            this.modal.style.display = "none";
        }
    }
};