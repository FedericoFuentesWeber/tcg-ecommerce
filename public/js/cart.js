const deleteProductFrom = (productId, cartId) => {
    Swal.fire({
        title: "Desea eliminar el producto del carrito de compras?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        preConfirm: async() => {
            try {
                const response = await fetch(
                    `/api/carts/${cartId}/products/${productId}`,
                    {
                        method: "DELETE"
                    }
                );
                if(!response.ok) {
                    throw new Error("Error al intentar eliminar el producto");
                }

                Swal.fire({
                    title: "El producto fue eliminado correctamente",
                    icon: "success",
                    preConfirm: () => {
                        location.reload();
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

const deleteAllProductsFrom = (cartId) => {
    Swal.fire({
        title: "Desea vaciar el carrito de compras?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        preConfirm: async() => {
            try {
                const response = await fetch(
                    `/api/carts/${cartId}`,
                    {
                        method: "DELETE"
                    }
                );
                if(!response.ok) {
                    throw new Error("Error al intentar vaciar el carrito");
                }
    
                Swal.fire({
                    title: "El carrito se vacio correctamente",
                    icon: "success",
                    preConfirm: () => {
                        location.reload();
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