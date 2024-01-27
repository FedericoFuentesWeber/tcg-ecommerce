let cartId = sessionStorage.getItem("cartId");

const addProduct = (productId) => {
    Swal.fire({
        title: "Desea agregar el producto al carrito?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Agregar",
        cancelButtonText: "Cancelar",
        preConfirm: async() => {
            try {
                if(!cartId) {
                    const response = await fetch(`/api/carts`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            product: productId,
                            quantity: 1,
                        })
                      });
                      if (!response.ok) {
                        throw new Error("Error al agregar producto al carrito");
                      }
                      const jsonResponse = await response.json();
                      cartId = jsonResponse.cartId;
                      sessionStorage.setItem("cartId", cartId);
                } else {
                    const response = await fetch(
                        `/api/carts/${cartId}/products/${productId}`,
                        {
                            method: "POST"
                        }
                    );
                    if(!response.ok) {
                        throw new Error("Error al intentar agregar producto al carrito");
                    }
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