import axios from "axios";
import swal from "sweetalert2";

// Create
export const createProduct =
  (insertProduct, imageProduct) => async (dispatch) => {
    try {
      let inputForm = new FormData();
      inputForm.append("nama_product", insertProduct.nama_product);
      inputForm.append("harga_beli", insertProduct.harga_beli);
      inputForm.append("harga_jual", insertProduct.harga_jual);
      inputForm.append("stok", insertProduct.stok);
      inputForm.append("image", imageProduct);
      axios
        .post(
          `${process.env.REACT_APP_BACKEND_URL}/v1/product/product`,
          inputForm,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        )
        .then((res) => {
          console.log(res.data);
          swal.fire({
            title: "Product Added",
            text: `New Product have been added`,
            icon: "success",
          });
          window.location.reload();
        });
      dispatch({ type: "CREATE_PRODUCT", payload: "success" });
    } catch (err) {
      swal.fire({
        text: err.response.data.message,
        icon: "warning",
      });
    }
  };

// Delete
export const deleteProducts = (id) => async (dispatch) => {
  try {
    const result = await swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      const response = await axios.delete(
        `${process.env.REACT_APP_BACKEND_URL}/v1/product/${id}`
      );
      console.log(response);
      swal.fire({
        title: "Product Delete",
        text: `Delete Product Success`,
        icon: "success",
      });
      dispatch({ type: "DELETE_PRODUCT", payload: "success" });
      window.location.reload();
    }
  } catch (error) {
    swal.fire({
      text: "error delete product",
      icon: "warning",
    });
  }
};
