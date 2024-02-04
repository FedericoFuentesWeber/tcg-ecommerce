const showImage = (imageUrl) => {
    Swal.fire({
        imageUrl: imageUrl,
        imageWidth: 600,
        imageHeight: 550,
        imageAlt: "Product image",
        showConfirmButton: false
    });
};


const logout = async() => {
    try {
        const response = await fetch("/api/session/logout", {
            method: "GET"
        });

        if(!response.ok) {
            const parsedResponse = await response.json();
            throw new Error(parsedResponse.payload);
        }
        Swal.fire({
            text: "Se cerro la sesión exitosamente",
            icon: "success",
            timer: 1000,
            showConfirmButton: false
        }).then(function () {
            window.location.href = "/login";
        });
    } catch (error) {
        Swal.fire({
            text: "Error al cerrar sesión",
            icon: "warning"
        });
    }
};