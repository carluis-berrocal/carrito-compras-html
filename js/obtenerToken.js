export async function obtenerToken() {
    const url = "https://api-sandbox.factus.com.co/oauth/token";
    const credentials = {
        grant_type: "password",
        client_id: "tu_client_id", // Reemplaza con tu client_id
        username: "tu_usuario", // Reemplaza con tu usuario
        password: "tu_contraseña" // Reemplaza con tu contraseña
    };

    const tokenData = JSON.parse(localStorage.getItem("factus_token"));
    const now = Math.floor(Date.now() / 1000);

    if (tokenData && tokenData.expires_at > now) {
        console.log("Usando token almacenado:", tokenData.access_token);
        return tokenData.access_token;
    }

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials)
        });

        const data = await response.json();

        if (response.ok) {
            const expiresIn = data.expires_in || 3600;
            const expires_at = now + expiresIn;

            localStorage.setItem("factus_token", JSON.stringify({
                access_token: data.access_token,
                expires_at
            }));

            console.log("Nuevo token obtenido:", data.access_token);
            return data.access_token;
        } else {
            console.error("Error al obtener el token:", data);
            return null;
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        return null;
    }
}
