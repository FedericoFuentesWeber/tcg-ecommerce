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
        const response = await fetch("/api/sessions/logout", {
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
            text: `Error al cerrar sesión, error: ${error.message}`,
            icon: "warning"
        });
    }
};

let cartId = sessionStorage.getItem("cartId");
const addProduct = (productId, cartId) => {
    Swal.fire({
        title: "Desea agregar el producto al carrito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Agregar",
        cancelButtonText: "Cancelar",
        preConfirm: async() => {
            try {
                const response = await fetch(
                    `/api/carts/${cartId}/products/${productId}`,
                    {
                        method: "POST"
                    }
                );
                if(!response.ok) {
                    throw new Error("Error al intentar agregar producto al carrito");
                }
                Swal.fire({
                    title: "El producto fue agregado correctamente al carrito",
                    icon: "success",
                    preConfirm: async() => {
                        location.reload()
                    }
                });
            } catch(error) {
                Swal.showValidationMessage(
                    `<i class="fa fa-info-circle"></i> ${error}`
                );
                console.log(error);
            }
        }
    });
};