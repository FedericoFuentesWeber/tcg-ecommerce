const socket = io();

const showImage = (imageUrl) => {
    Swal.fire({
        imageUrl: imageUrl,
        imageWidth: 600,
        imageHeight: 550,
        imageAlt: "Product image",
        showConfirmButton: false
    });
};

const addNewProduct = () => {
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
            <label for="thumbnail" class="form-label">Imagen</label>
                <input type="file" class="form-control" id="thumbnail" name="thumbnail" placeholder="Seleccione la imagen" multiple="multiple" accept="image/*"/>
            </div>
        </form>`,
        showCancelButton: true,
        cancelButtonText: "Cancelar",
        confirmButtonText: "Agregar",
        preConfirm: async () => {
            const formData = new FormData(document.getElementById("productForm"));

            try {
                fetch("/", { method: "POST", body: formData })
                    .then((response) => {
                        if(response.ok) {
                            return response.json();
                        }
                        throw new Error("Error al agregar el producto.");
                    })
                    .then((data) => {
                        socket.emit("addProductEvent", data);
                    });
            } catch(error) {
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
    })
    .then((result) => {
        if(result.isConfirmed) {
            socket.emit("deleteProductEvent", productId);
            updateTable();
        }
    })
    .catch((error) => {
        console.log(error.message)
    });
};

const updateTable = async (products) => {
    let productsTableBody = document.getElementById("products_body");
    let content = ``;

    if(!products || products === 0) {
        content += `<tr><td colspan="7">No hay productos</td></tr>`
    } else {
        products.forEach((product) => {
            content += `
                <tr>
                    <td>${product.title}</td>
                    <td>${product.description}</td>
                    <td>${product.code}</td>
                    <td>${product.price}</td>
                    <td>${product.stock}</td>
                    <td class="px-4">
                        <a onclick="showImage('${product.thumbnail}')" class="btn-sm clickable">
                            Imagen
                        </a>
                    </td>
                    <td class="px-4">
                        <a onclick="deleteProduct('${product.id}')" class="btn-sm clickable">
                            Borrar
                        </a>
                    </td>
                </tr>`;
        });
    }
    productsTableBody.innerHTML = content;
};

socket.on("updateProductsEvent", async(products) => {
    updateTable(products);
})