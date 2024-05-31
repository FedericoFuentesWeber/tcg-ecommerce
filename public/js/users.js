const upgradeUser = (userId) => {
    Swal.fire({
        title: "Desea actualizar el rol del usuario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Actualizar",
        cancelButtonText: "Cancelar",
        preConfirm: async() => {
            try {
                const response = await fetch(
                    `/api/users/premium/${userId}`,
                    {
                        method: "GET"
                    }
                );
                if(!response.ok) {
                    throw new Error("Error al intentar actualizar el rol del usuario.");

                }
                Swal.fire({
                    title: "El rol del usuario fue actualizado con exito.",
                    icon: "success",
                    preConfirm: async() => {
                        location.reload();
                    }
                });
            } catch (error) {
                Swal.showValidationMessage(
                    `<i class="fa fa-info-circle"></i> ${error}`
                );
                console.log(error);
            }
        }
    })
}

const deleteUser = (userId) => {
    console.log("eliminar usuario")
    Swal.fire({
        title: "Desea eliminar el usuario?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        preConfirm: async() => {
            try {
                const response = await fetch(
                    `/api/users/${userId}`,
                    {
                        method: "DELETE"
                    }
                );
                if(!response.ok) {
                    throw new Error("Error al intentar eliminar el usuario.");

                }
                Swal.fire({
                    title: "El usuario fue eliminado con exito.",
                    icon: "success",
                    preConfirm: async() => {
                        location.reload();
                    }
                });
            } catch (error) {
                Swal.showValidationMessage(
                    `<i class="fa fa-info-circle"></i> ${error}`
                );
                console.log(error);
            }
        }
    })
}

const deleteInactiveUsers = () => {
    Swal.fire({
        title: "Desea eliminar los usuarios inactivos?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        preConfirm: async() => {
            try {
                const response = await fetch(
                    `/api/users/`,
                    {
                        method: "DELETE"
                    }
                );
                if(!response.ok) {
                    throw new Error("Error al intentar eliminar los usuarios inactivos.");

                }
                Swal.fire({
                    title: "Los usuarios fueron eliminados con exito.",
                    icon: "success",
                    preConfirm: async() => {
                        location.reload();
                    }
                });
            } catch (error) {
                Swal.showValidationMessage(
                    `<i class="fa fa-info-circle"></i> ${error}`
                );
                console.log(error);
            }
        }
    })
}