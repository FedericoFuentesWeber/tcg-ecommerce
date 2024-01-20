const showImage = (imageUrl) => {
    Swal.fire({
        imageUrl: imageUrl,
        imageWidth: 600,
        imageHeight: 550,
        imageAlt: "Product image",
        showConfirmButton: false
    });
};
