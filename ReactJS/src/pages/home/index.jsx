import React, { useState, useEffect, useRef } from "react";
import swal from "sweetalert";
import axios from "axios";
import "./home.css";
import { useNavigate } from "react-router-dom";
import { createProduct } from "../../redux/action/productAction";
import { deleteProducts } from "../../redux/action/productAction";
import { useDispatch } from "react-redux";
import DataTable from "react-data-table-component";
import AOS from "aos";
import "aos/dist/aos.css";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;

const Index = () => {
  // get Profile user/'
  const [users, setUsers] = useState({});
  const navigate = useNavigate();
  const data = JSON.parse(localStorage.getItem("users"));
  const id = data.users.id;

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/user/detail/${id}`)
      .then((res) => {
        console.log(res.data.data);
        setUsers(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  //update profile user
  const handleUpdate = (e) => {
    e.preventDefault();
    let formData = new FormData(e.target);
    formData.append("id", id);
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/user/update/${id}`,
        formData
      )
      .then((res) => {
        swal({
          title: "Update Success",
          text: `Your account have been updated`,
          icon: "success",
        }).then(() => {
          navigate("/");
          window.location.reload();
        });
      })
      .catch((err) => {
        swal({
          title: "Update Failed",
          icon: "error",
        });
      });
  };
  const hiddenFileInput = useRef(null);
  const handleClick = (event) => {
    hiddenFileInput.current.click();
  };
  const handleChange = (event) => {
    const fileUploaded = event.target.files[0];
    console.log(fileUploaded);
  };

  // get data Product by react data table
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/product/`)
      .then((response) => {
        console.log(response.data.data);
        setPosts(response.data.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const columns = [
    {
      name: "Update",
      selector: "id",
      sortable: true,
      width: "90px",
      cell: (row) => (
        <button
          data-bs-toggle="modal"
          data-bs-target="#exampleModalUpdatePersalinan"
          className="btn btn-success py-2"
          onClick={(e) => getDetailProduct(row.id, e)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-pencil-square text-white"
            viewBox="0 0 16 16"
          >
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
            <path
              fill-rule="evenodd"
              d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
            />
          </svg>
        </button>
      ),
    },
    {
      name: "Delete",
      selector: "id",
      sortable: true,
      width: "90px",
      cell: (row) => (
        <button
          onClick={(e) => deleteProduct(row.id, e)}
          className="btn btn-danger"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="currentColor"
            class="bi bi-trash text-white"
            viewBox="0 0 16 16"
          >
            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5Zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6Z" />
            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1ZM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118ZM2.5 3h11V2h-11v1Z" />
          </svg>
        </button>
      ),
    },
    {
      name: "Image",
      selector: "image",
      sortable: true,
      cell: (row) => (
        <img
          src={row.image}
          alt=""
          style={{
            width: "65px",
            height: "70px",
            marginBottom: "10px",
            marginTop: "10px",
            borderRadius: "15px",
          }}
        />
      ),
    },
    {
      name: "Nama Barang",
      selector: "nama_product",
      sortable: true,
    },
    {
      name: "Harga beli",
      selector: "harga_beli",
      sortable: true,
      cell: (row) => <p className="mt-3">{currencyFormat(row.harga_beli)}</p>,
    },
    {
      name: "harga Jual",
      selector: "harga_jual",
      sortable: true,
      cell: (row) => <p className="mt-3">{currencyFormat(row.harga_jual)}</p>,
    },

    {
      name: "Stok Barang",
      selector: "stok",
      sortable: true,
    },
    {
      name: "created_at",
      selector: "created_at",
      sortable: true,
    },
  ];
  const generatePDF = () => {
    const docDefinition = {
      content: [
        {
          table: {
            headerRows: 1,
            body: [
              [
                { text: "nama product", style: "tableHeader" },
                { text: "harga beli", style: "tableHeader" },
                { text: "harga jual", style: "tableHeader" },
                { text: "stok", style: "tableHeader" },
                { text: "created_at", style: "tableHeader" },
              ],
              ...posts.map((post) => [
                post.nama_product,
                post.harga_beli,
                post.harga_jual,
                post.stok,
                post.created_at,
              ]),
            ],
          },
        },
      ],
      styles: {
        tableHeader: {
          bold: true,
          fontSize: 15,
          color: "#000",
        },
      },
    };
    pdfMake.createPdf(docDefinition).download("product.pdf");
  };

  // delete Product
  const deleteProduct = (id) => {
    dispatch(deleteProducts(id));
  };

  // create product
  const dispatch = useDispatch();
  const [insertProduct, setInsertProduct] = useState({
    nama_product: "",
    image: "",
    harga_beli: "",
    harga_jual: "",
    stok: "",
  });
  const [imageProduct, setimageProduct] = useState();
  const [previewImage, setPreviewImage] = useState();

  const handleChangeProduct = (event) => {
    const fileUploaded = event.target.files[0];
    document.getElementById("addImage").innerHTML = fileUploaded.name;
    setimageProduct(fileUploaded);
    setPreviewImage([URL.createObjectURL(event.target.files[0])]);
  };

  const onSubmitInsertProduct = (e) => {
    e.preventDefault();
    dispatch(createProduct(insertProduct, imageProduct));
  };

  // update Product
  const [detailProduct, setDetailProduct] = useState({
    id: "",
    nama_product: "",
    harga_beli: "",
    harga_jual: "",
    stok: "",
  });

  const getDetailProduct = (id) => {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URL}/v1/product/${id}`)
      .then((res) => {
        console.log(res.data.data);
        setDetailProduct(res.data.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const [image, setImage] = useState(null);
  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };
  const handleInputChange = (event) => {
    setDetailProduct({
      ...detailProduct,
      [event.target.name]: event.target.value,
    });
  };
  const onUpdateProduct = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("id", detailProduct.id);
    formData.append("nama_product", detailProduct.nama_product);
    formData.append("image", image, image.name);
    formData.append("harga_beli", detailProduct.harga_beli);
    formData.append("stok", detailProduct.stok);
    axios
      .put(
        `${process.env.REACT_APP_BACKEND_URL}/v1/product/update/${detailProduct.id}`,
        formData
      )
      .then((res) => {
        console.log(res.data.data);
        swal({
          title: "Update Product Success",
          icon: "success",
        });
        window.location.reload();
      })
      .catch((error) => {
        console.log(error);
      });
  };

  // Logout
  const onLogout = (e) => {
    // e.prevenDefault();
    localStorage.clear();
    swal({
      title: "Logout Success",
      text: `Logout Success!`,
      icon: "success",
    });
    return navigate("/login");
  };

  //format rupiah
  const currencyFormat = (num) => {
    return (
      "Rp. " +
      Number(num)
        .toFixed(0)
        .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.")
    );
  };

  // filter search Product
  const [searchText, setSearchText] = useState("");
  const filteredData = searchText
    ? posts.filter((post) =>
        Object.values(post).some(
          (value) =>
            value &&
            value.toString().toLowerCase().includes(searchText.toLowerCase())
        )
      )
    : posts;

  useEffect(() => {
    AOS.init();
    AOS.refresh();
  }, []);
  return (
    <>
      {/* Side Left */}
      <aside
        className="sidebar  position-fixed top-0 left-0 overflow-auto h-100 float-left"
        id="show-side-navigation1"
      >
        <div className="sidebar-header d-flex justify-content-center align-items-center px-2 py-2 mt-2">
          <img
            className="rounded-5"
            width={60}
            height={60}
            src={
              users.avatar ? users.avatar : require("../../assets/dummy.png")
            }
            alt=""
            data-aos="zoom-in-right"
            data-aos-duration="1000"
          />

          <div className="ms-2">
            <h5 className="fs-6 mb-0">
              <a
                className="text-decoration-none"
                href="#"
                data-aos="zoom-in-left"
                data-aos-duration="1000"
              >
                {users.full_name}
              </a>
            </h5>
            <p
              className="mt-1 mb-0"
              data-aos="zoom-in-right"
              data-aos-duration="1000"
            >
              {" "}
              Admin
            </p>
          </div>
        </div>
        <div>
          <button
            style={{ border: "none", backgroundColor: "#6a30e9" }}
            type="button"
            className="btn text-white  px-3 d-flex m-auto "
            data-bs-toggle="modal"
            data-bs-target="#exampleModal"
            href="#collapseExample"
            role="button"
            aria-expanded="false"
            aria-controls="collapseExample"
            data-aos="zoom-in-left"
            data-aos-duration="1000"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              class="bi bi-pencil-square text-white me-2"
              viewBox="0 0 16 16"
              style={{ marginTop: "4px" }}
            >
              <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z" />
              <path
                fill-rule="evenodd"
                d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"
              />
            </svg>
            Edit
          </button>
        </div>

        <div className="search position-relative text-center px-4 py-3 mt-2">
          <input
            type="text"
            className="form-control w-100 border-0 bg-secondary text-white"
            placeholder="Search here"
            disabled
          />
          <i className="fa fa-search position-absolute d-block fs-6"></i>
        </div>

        <ul className="categories list-unstyled">
          <li
            className="has-dropdown"
            data-aos="zoom-in-right"
            data-aos-duration="1000"
          >
            <i className="uil-estate fa-fw"></i>
            <a href="#"> Dashboard</a>
          </li>
          <li
            className="has-dropdown"
            data-aos="zoom-in-left"
            data-aos-duration="1000"
          >
            <i className="uil-calendar-alt"></i>
            <a href="#">Product</a>
          </li>
          <li
            className="has-dropdown"
            data-aos="zoom-in-right"
            data-aos-duration="1000"
          >
            <i className="uil-envelope-download fa-fw"></i>
            <a href="#">Stock</a>
          </li>
        </ul>
      </aside>

      {/* Modal Users */}
      <div
        className="modal fade"
        id="exampleModal"
        tabindex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Update Profile
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form
              onSubmit={(e) => {
                handleUpdate(e);
              }}
            >
              <div className="modal-body">
                <div className="input-group mb-3">
                  <input
                    type="file"
                    name="avatar"
                    id="avatar"
                    className="form-control"
                    onChange={(e) => handleChange(e)}
                    ref={hiddenFileInput}
                  />
                </div>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Full Name"
                    defaultValue={users.full_name}
                    name="full_name"
                    id="full_name"
                  />
                </div>
                <div className="input-group mb-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Email"
                    defaultValue={users.email}
                    name="email"
                    id="email"
                    disabled
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  data-bs-dismiss="modal"
                >
                  Close
                </button>
                <button type="submit" className="btn btn-outline-success">
                  Update
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Side Right */}
      <section id="wrapper">
        <nav className="navbar navbar-expand-md ">
          <div className="container-fluid mx-2 ">
            <div className="navbar-header ">
              <h5
                className="navbar-brands text-white"
                href="# "
                data-aos="zoom-in-right"
                data-aos-duration="1000"
              >
                Admin
                <span
                  className="main-color ms-2"
                  data-aos="zoom-in-left"
                  data-aos-duration="1000"
                >
                  Product
                </span>
              </h5>
            </div>
            <div className="collapse navbar-collapse" id="toggle-navbar">
              <ul className="navbar-nav ms-auto">
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    id="navbarDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                    data-aos="zoom-in-right"
                    data-aos-duration="1000"
                  >
                    Settings
                  </a>
                  <ul
                    className="dropdown-menu bg-danger"
                    aria-labelledby="navbarDropdown"
                  >
                    <li>
                      <a
                        className="dropdown-item bg-danger text-white fw-bold"
                        onClick={onLogout}
                        style={{ cursor: "pointer" }}
                      >
                        Log out
                      </a>
                    </li>
                  </ul>
                </li>

                <li className="nav-item">
                  <a className="nav-link" href="#">
                    <i
                      data-show="show-side-navigation1"
                      className="uil-bars show-side-btn"
                    ></i>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>

        <div className="p-4">
          <div className="welcome">
            <div className="content rounded-3 p-3">
              <h1
                className="fs-3"
                data-aos="zoom-in-right"
                data-aos-duration="1000"
              >
                Welcome to Dashboard
              </h1>
              <p
                className="mb-0"
                data-aos="zoom-in-left"
                data-aos-duration="1000"
              >
                Hello{" "}
                <b
                  className="fw-bold text-white"
                  data-aos="zoom-in-right"
                  data-aos-duration="1000"
                >
                  {users.full_name}
                </b>{" "}
                , welcome to your awesome dashboard!
              </p>
            </div>
          </div>
        </div>

        <div className="m-3 p-4 ">
          <div className="row colum rounded-3">
            <h1
              className="fs-3 text-white mt-3"
              data-aos="zoom-in-right"
              data-aos-duration="1000"
            >
              List Product
            </h1>
            <div className="col-12">
              <div className="d-flex">
                <button
                  onClick={generatePDF}
                  className="btn btn-success me-3 d-flex "
                  data-aos="zoom-in-right"
                  data-aos-duration="1000"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-arrow-up-circle-fill iconss  me-2"
                    viewBox="0 0 16 16"
                    style={{ marginTop: "7px" }}
                    data-aos="zoom-in-left"
                    data-aos-duration="1000"
                  >
                    <path d="M16 8A8 8 0 1 0 0 8a8 8 0 0 0 16 0zm-7.5 3.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708l3-3a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V11.5z" />
                  </svg>
                  <span
                    className="exs mt-1"
                    data-aos="zoom-in-right"
                    data-aos-duration="1000"
                  >
                    {" "}
                    Export
                  </span>
                </button>
                <input
                  class="form-control searchs form-control-lg ms-auto"
                  type="text"
                  placeholder="Search..."
                  aria-label=".form-control-lg example"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  data-aos="zoom-in-right"
                  data-aos-duration="1000"
                />
                <button
                  type="button"
                  style={{ backgroundColor: "#6a30e9" }}
                  className="btn text-white  ms-3  d-flex"
                  data-bs-toggle="modal"
                  data-bs-target="#exampleCreate"
                  data-aos="zoom-in-left"
                  data-aos-duration="1000"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    fill="currentColor"
                    class="bi bi-plus-circle bi-arrow-up-circle-fill iconss  me-2"
                    viewBox="0 0 16 16"
                    style={{ marginTop: "7px" }}
                    data-aos="zoom-in-right"
                    data-aos-duration="1000"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4z" />
                  </svg>
                  <span
                    className="exs mt-1"
                    data-aos="zoom-in-right"
                    data-aos-duration="1000"
                  >
                    Create
                  </span>
                </button>

                {/* Modal Create Product*/}
                <div
                  class="modal fade"
                  id="exampleCreate"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div class="modal-dialog">
                    <div class="modal-content">
                      <form action="">
                        <div class="modal-header">
                          <h1 class="modal-title fs-5" id="exampleModalLabel">
                            Create New Product
                          </h1>
                          <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>

                        <div className="modal-body">
                          <img
                            style={{
                              borderRadius: "15px",
                            }}
                            className="mx-auto d-flex mb-3"
                            width="150"
                            height="150"
                            src={
                              previewImage
                                ? previewImage
                                : require("../../assets/product.png")
                            }
                            alt=""
                          />
                          <div className="input-group mb-3">
                            <input
                              id="addImage"
                              type="file"
                              src={
                                previewImage
                                  ? previewImage
                                  : require("../../assets/product.png")
                              }
                              className="form-control"
                              onChange={handleChangeProduct}
                            />
                          </div>

                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="nama product"
                              onChange={(e) => {
                                setInsertProduct({
                                  ...insertProduct,
                                  nama_product: e.target.value,
                                });
                              }}
                            />
                          </div>

                          <div className="input-group mb-3">
                            <span
                              className="input-group-text"
                              id="inputGroup-sizing-default"
                            >
                              Rp.
                            </span>
                            <input
                              type="number"
                              className="form-control"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              placeholder="harga beli"
                              onChange={(e) => {
                                setInsertProduct({
                                  ...insertProduct,
                                  harga_beli: e.target.value,
                                });
                              }}
                            />
                          </div>
                          <div className="input-group mb-3">
                            <span
                              className="input-group-text"
                              id="inputGroup-sizing-default"
                            >
                              Rp.
                            </span>
                            <input
                              type="number"
                              className="form-control"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              placeholder="harga jual"
                              onChange={(e) => {
                                setInsertProduct({
                                  ...insertProduct,
                                  harga_jual: e.target.value,
                                });
                              }}
                            />
                          </div>

                          <div className="input-group mb-3">
                            <input
                              type="number"
                              className="form-control"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              placeholder="stok"
                              onChange={(e) => {
                                setInsertProduct({
                                  ...insertProduct,
                                  stok: e.target.value,
                                });
                              }}
                            />
                          </div>
                        </div>

                        <div class="modal-footer">
                          <button
                            type="button"
                            class="btn btn-outline-danger"
                            data-bs-dismiss="modal"
                          >
                            Close
                          </button>
                          <button
                            onClick={onSubmitInsertProduct}
                            type="submit"
                            class="btn btn-outline-primary"
                          >
                            Create
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>

                {/* Modal Update Product*/}
                <div
                  className="modal fade"
                  id="exampleModalUpdatePersalinan"
                  tabindex="-1"
                  aria-labelledby="exampleModalLabel"
                  aria-hidden="true"
                >
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <form
                        onSubmit={(e) => {
                          onUpdateProduct(e);
                        }}
                      >
                        <div className="modal-header">
                          <h1
                            className="modal-title fs-5"
                            id="exampleModalLabel"
                          >
                            Update Product
                          </h1>
                          <button
                            type="button"
                            className="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        <div className="modal-body">
                          <div className="input-group mb-3">
                            <input
                              type="file"
                              src={previewImage}
                              className="form-control"
                              name="image"
                              onChange={handleImageChange}
                            />
                          </div>

                          <div className="input-group mb-3">
                            <input
                              type="text"
                              className="form-control"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              placeholder="Mother Name"
                              value={detailProduct.nama_product}
                              name="nama_product"
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="input-group mb-3">
                            <span
                              className="input-group-text"
                              id="inputGroup-sizing-default"
                            >
                              Rp.
                            </span>
                            <input
                              type="number"
                              className="form-control"
                              aria-label="Sizing example input"
                              aria-describedby="inputGroup-sizing-default"
                              placeholder="Mother Age"
                              value={detailProduct.harga_beli}
                              name="harga_beli"
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="input-group mb-3">
                            <span
                              className="input-group-text"
                              id="inputGroup-sizing-default"
                            >
                              Rp.
                            </span>
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Gestational Age"
                              value={detailProduct.harga_jual}
                              name="harga_jual"
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="input-group mb-3 ">
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Stok"
                              value={detailProduct.stok}
                              name="stok"
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        <div className="modal-footer">
                          <button
                            type="button"
                            className="btn px-4 btn-outline-danger"
                            data-bs-dismiss="modal"
                          >
                            Close
                          </button>
                          <button
                            type="submit"
                            className="btn px-3 btn-outline-success"
                          >
                            Update
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Get product by React data table */}
            <div className="col-12  p-3">
              <div
                className="container"
                data-aos="zoom-in-right"
                data-aos-duration="1000"
              >
                <DataTable
                  columns={columns}
                  data={filteredData}
                  pagination={true}
                  paginationPerPage={3}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Navbar */}
      <section>
        <div className="mobile-nav">
          <div class="bottom-nav">
            <div class="bottom-link-nav ms-2">
              <a href="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  fill="currentColor"
                  class="bi bi-newspaper me-3"
                  viewBox="0 0 16 16"
                >
                  <path d="M0 2.5A1.5 1.5 0 0 1 1.5 1h11A1.5 1.5 0 0 1 14 2.5v10.528c0 .3-.05.654-.238.972h.738a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 1 1 0v9a1.5 1.5 0 0 1-1.5 1.5H1.497A1.497 1.497 0 0 1 0 13.5v-11zM12 14c.37 0 .654-.211.853-.441.092-.106.147-.279.147-.531V2.5a.5.5 0 0 0-.5-.5h-11a.5.5 0 0 0-.5.5v11c0 .278.223.5.497.5H12z" />
                  <path d="M2 3h10v2H2V3zm0 3h4v3H2V6zm0 4h4v1H2v-1zm0 2h4v1H2v-1zm5-6h2v1H7V6zm3 0h2v1h-2V6zM7 8h2v1H7V8zm3 0h2v1h-2V8zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1zm-3 2h2v1H7v-1zm3 0h2v1h-2v-1z" />
                </svg>
              </a>
              <a href="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  fill="currentColor"
                  class="bi bi-journal-bookmark-fill me-3"
                  viewBox="0 0 16 16"
                >
                  <path
                    fill-rule="evenodd"
                    d="M6 1h6v7a.5.5 0 0 1-.757.429L9 7.083 6.757 8.43A.5.5 0 0 1 6 8V1z"
                  />
                  <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z" />
                  <path d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z" />
                </svg>
              </a>
              <a href="">
                <svg
                  class="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                  ></path>
                </svg>
              </a>
              <a href="">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="27"
                  height="27"
                  fill="currentColor"
                  class="bi bi-layout-text-window-reverse me-3"
                  viewBox="0 0 16 16"
                >
                  <path d="M13 6.5a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5zm0 3a.5.5 0 0 0-.5-.5h-5a.5.5 0 0 0 0 1h5a.5.5 0 0 0 .5-.5zm-.5 2.5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1 0-1h5z" />
                  <path d="M14 0a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12zM2 1a1 1 0 0 0-1 1v1h14V2a1 1 0 0 0-1-1H2zM1 4v10a1 1 0 0 0 1 1h2V4H1zm4 0v11h9a1 1 0 0 0 1-1V4H5z" />
                </svg>
              </a>
              <a
                className="nav-link dropdown-toggle"
                id="navbarDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <img
                  width={36}
                  height={36}
                  className="rounded-5"
                  src={
                    users.avatar
                      ? users.avatar
                      : require("../../assets/dummy.png")
                  }
                  alt=""
                />
                <ul className="dropdown-menu " aria-labelledby="navbarDropdown">
                  <li>
                    <button
                      className="dropdown-item fw-bold"
                      style={{ cursor: "pointer" }}
                      data-bs-toggle="modal"
                      data-bs-target="#exampleModal"
                      href="#collapseExample"
                      role="button"
                      aria-expanded="false"
                      aria-controls="collapseExample"
                      type="button"
                    >
                      <p>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="21"
                          height="21"
                          fill="currentColor"
                          class="bi bi-person-circle "
                          viewBox="0 0 16 16"
                        >
                          <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                          <path
                            fill-rule="evenodd"
                            d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8zm8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1z"
                          />
                        </svg>
                        : {users.full_name}
                      </p>
                    </button>
                  </li>
                  <li>
                    <a
                      className="dropdown-item text-danger fw-bold"
                      onClick={onLogout}
                      style={{ cursor: "pointer" }}
                    >
                      Log out
                    </a>
                  </li>
                </ul>
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Index;
