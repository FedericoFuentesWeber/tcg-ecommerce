const register = async() => {
    const formData = new FormData(authForm);
    const parsedFormData = {}
    try {
        formData.forEach((value, key) => {
            parsedFormData[key] = value;
        });
        const response = await fetch("/api/sessions/register", {
            method: "POST",
            body: JSON.stringify(parsedFormData),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });

        if(!response.ok) {
            const parsedResponse = await response.json();
            throw new Error(parsedResponse.payload);
        }

        Swal.fire({
            text: "Quedaste registrado",
            icon: "success",
            confirmButtonText: "Aceptar",
            preConfirm: async() => {
                try {
                    window.location.href = "/login";
                } catch (error) {
                    throw error;
                }
            }
        });
    } catch (error) {
        Swal.fire({
            text: `No se pudo registrar, error: ${error.message}`,
            icon: "warning"
        });
    }
};

const login = async() => {
    const formData = new FormData(authForm);
    const parsedFormData = {}
    try {
        formData.forEach((value, key) => {
            parsedFormData[key] = value;
        });
        const response = await fetch("/api/sessions/login", {
            method: "POST",
            body: JSON.stringify(parsedFormData),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        });
        console.log("got response...");

        if(!response.ok) {
            const parsedResponse = await response.json();
            throw new Error(parsedResponse.payload);
        }
        console.log("response ok.....");

        Swal.fire({
            text: "Login exitoso",
            icon: "success",
            confirmButtonText: "Aceptar",
            preConfirm: async() => {
                try {
                    window.location.href = "/products";
                } catch (error) {
                    throw error;
                }
            }
        });
    } catch (error) {
        Swal.fire({
            text: `No se pudo iniciar sesión, error: ${error.message}`,
            icon: "warning"
        });
    }
};

authForm.addEventListener("submit", function(event) {
    event.preventDefault();
    try {
        authForm.name == "loginForm" ? login() : register();
    } catch (error) {
        throw error;
    }
});
