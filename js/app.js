import { Carrito } from "./carrito.js";
import { ModalPagos } from "./modalPagos.js";

/**
 * Esperamos a que el DOM esté completamente cargado antes de inicializar el carrito y el modal de pagos.
 */
document.addEventListener("DOMContentLoaded", () => {
    Carrito.inicializar();
    ModalPagos.inicializar();
});