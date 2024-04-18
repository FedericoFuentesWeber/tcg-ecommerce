const socket = io();

const addNewProduct = (userId) => {
    Swal.fire({
        title: "Agregar nuevo producto",
        html: 
        `<form id="productForm" class="row g-3" enctype="multipart/form-data">
            <div class="col-md-6">
                <label for="title" class="form-label">Título</label>
                <input type="text" class="form-control" id="title" name="title" placeholder="Título"/>
            </div>
            <div class="col-md-6">
                <label for="description" class="form-label">Descripción</label>
                <input type="text" class="form-control" id="description" name="description" placeholder="Descripción"/>
            </div>
            <div class="col-md-6">
                <label for="category" class="form-label">Categoria</label>
                <input type="text" class="form-control" id="category" name="category" placeholder="Categoria"/>
            </div>
            <div class="col-6">
                <label for="price" class="form-label">Precio</label>
                <input type="text" class="form-control" id="price" name="price" placeholder="Precio"/>
            </div>
            <div class="col-md-6">
                <label for="stock" class="form-label">Stock</label>
                <input type="text" class="form-control" id="stock" name="stock" placeholder="Stock"/>
            </div>
            <div class="col-md-6">
                <label for="code" class="form-label">Código</label>
                <input type="text" class="form-control" id="code" name="code" placeholder="Código"/>
            </div>
            <div class="col-md-6">
            <label for="thumbnails" class="form-label">Imagen</label>
                <input type="file" class="form-control" id="thumbnails" name="thumbnails" placeholder="Seleccione la imagen" multiple="multiple" accept="image/*"/>
            </div>
        </form>`,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Agregar",
        preConfirm: async () => {
            const formData = new FormData(document.getElementById("productForm"));
            formData.append("owner", userId);
            try {
                const response = await fetch("/api/products", {
                    method: "POST",
                    body: formData
                });
                if(!response.ok) {
                    throw new Error("Error al agregar el producto."); 
                }
                Swal.fire({
                    title: "El producto fue agregado correctamente.",
                    icon: "success"
                })
            } catch(error) {
                Swal.showValidationMessage(
                    `<i class="fa fa-info-circle"></i> ${error}`
                );
                console.log(error);
            }
        }
    });
};

const deleteProduct = (productId) => {
    Swal.fire({
        title: "Eliminar producto?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
        preConfirm: async () => {
            try {
                const response = await fetch(`/api/products/${productId}`, {
                    method: "DELETE"
                });
                if(!response.ok) {
                    throw new Error("Error al eliminar el producto");
                }
                Swal.fire({
                    title: "El producto fue eliminado correctamente",
                    icon: "success"
                })
            } catch(error) {
                Swal.showValidationMessage(
                    `<i class="fa fa-info-circle"></i> ${error}`
                );
                console.log(error);
            }
        }
    });
};

const updateTable = async (products) => {

    const user = await fetch('/api/sessions/current', {
        method: 'GET'
    });

    const userJson = await user.json();
    const userDetails = userJson.payload;

    let productsTableBody = document.getElementById("products_body");
    let content = ``;
    let deleteProductButton = ``;

    if(!products || products === 0) {
        content += `<tr><td colspan="7">No hay productos</td></tr>`
    } else {
        products.forEach((product) => {
            if(
                userDetails.role === "ADMIN" ||
                userDetails.role === "PREMIUM" && userDetails.id === product.owner
            ) {
                deleteProductButton = `
                <td class="px-4">
                    <a onclick="deleteProduct('${product.id}')" class="btn-sm clickable">
                        Borrar
                    </a>
                </td>`
            }
            content += `
                <tr>
                    <td>${product.title}</td>
                    <td>${product.description}</td>
                    <td>${product.code}</td>
                    <td>${product.category}</td>
                    <td>${product.price}</td>
                    <td>${product.stock}</td>
                    <td class="px-4">
                        <a onclick="showImage('${product.thumbnails}')" class="btn-sm clickable">
                            Imagen
                        </a>
                    </td>
                    ${deleteProductButton}
                </tr>`;
        });
    }
    productsTableBody.innerHTML = content;
};

socket.on("updateProductsEvent", async(products) => {
    updateTable(products);
});
