import { obtenerToken } from "./obtenerToken.js"; // Importamos la función para obtener el token

export async function conectarConFactus(metodoPago, productos) {
    console.log(`Procesando pago con: ${metodoPago}`);

    const token = await obtenerToken(); // Obtenemos el token antes de continuar

    if (!token) {
        alert("No se pudo obtener el token de Factus.");
        return;
    }

    const facturaData = {
        numbering_range_id: 8,
        reference_code: "SETP990011535",
        observation: "Factura de prueba desde JS puro",
        payment_method_code: metodoPago, // Método de pago seleccionado
        customer: {
            identification: "1070814483",
            dv: "",
            company: "",
            trade_name: "",
            names: "Carluis Berrocal",
            address: "Kr 32 # 12-34",
            email: "carcoste@gmail.com",
            phone: "3148086523",
            legal_organization_id: 1,
            tribute_id: 21,
            identification_document_id: 1,
            // municipality_id: ""
        },
        items: productos,
    };
    

    try {
        const response = await fetch("https://api-sandbox.factus.com.co/v1/bills/validate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` // Enviamos el token en la petición
            },
            body: JSON.stringify(facturaData)
        });

        const data = await response.json();

        if (response.ok) {
            console.log("Factura procesada con éxito:", data);
            alert("Factura generada correctamente.");
        } else {
            console.error("Error al generar la factura:", data);
            alert("Error al generar la factura.");
        }
    } catch (error) {
        console.error("Error en la conexión con Factus:", error);
        alert("Error al conectar con Factus.");
    }
}
