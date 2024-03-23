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

const showTicket = (ticket) => {
    const date = new Date(ticket.purchase_datetime).toLocaleString(
        "es-AR",
        {
            timeZone: "America/Argentina/Buenos_Aires",
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        }
    );

    Swal.fire({
        title: "Compra",
        html: `<div>
            <p>ID Ticket: ${ticket._id}</p>
            <p>Fecha de compra: ${date}</p>
            <p>Monto: $${ticket.amount}</p>
            <p>Comprador: ${ticket.purchaser}</p>
        </div>`,
        icon: "success",
        preConfirm: () => {
            location.reload();
        }
    })
}

const purchase = (cartId) => {
    Swal.fire({
        title: "Desea finalizar la compra?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Finalizar",
        cancelButtonText: "Cancelar",
        preConfirm: async() => {
            try {
                const response = await fetch(
                    `/api/carts/${cartId}/purchase`,
                    {
                        method: "POST"
                    }
                );
                const responseContent = await response.json();

                if(!response.ok) {
                    throw new Error("Error al intentar finalizar la compra");
                }

                if(responseContent.purchase.allItemsBought) {
                    
                    Swal.fire({
                        title: "La compra finalizo correctamente.",
                        icon: "success",
                        preConfirm: () => {
                            showTicket(responseContent.purchase.ticket);
                        }
                    })
                } else {
                    Swal.fire({
                        title: "Finalizo la compra, todos los productos con stock insuficiente permaneceran en el carrito para futuras compras",
                        icon: "success",
                        preConfirm: () => {
                            showTicket(responseContent.purchase.ticket);
                        }
                    })
                }
            } catch(error) {
                Swal.showValidationMessage(
                    `<i class="fa fa-info-circle"></i> ${error}`
                );
                console.log(error);
            }
        }
    });
};