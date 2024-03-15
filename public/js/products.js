let cartId = sessionStorage.getItem("cartId");

const addProduct = (productId, cartId) => {
    console.log("cartId", cartId);
    console.log("productId", productId);
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
                    icon: "success"
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