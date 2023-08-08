import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { AUTH_TOKEN } from "../../helpers/constant";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../components/admin/Sidebar";
import { Button, Tooltip, Divider } from "@chakra-ui/react";
import {
  fetchDetailProduct,
  fetchProducts,
} from "../../features/cart/productsSlice";
import { currency } from "../../helpers/currency";
import { updateStock } from "../../features/cart/productsSlice";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Input,
} from "@chakra-ui/react";
import EditProductModal from "../../components/admin/products/EditProductModal";
import TableHistoryStockByIdProduct from "../../components/admin/products/TableHistoryStockByIdProduct";

function DetailProduct() {
  const navigate = useNavigate();
  const params = useParams();
  const dispatch = useDispatch();
  const token = localStorage.getItem(AUTH_TOKEN);
  const product = useSelector((state) => state.product.product);
  const [isEdit, setEdit] = useState(false);
  const [stock, setStock] = useState(product.stock);
  const [stockOnOpenModal, setStockOnOpenModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [modalEditProductOpen, setModalEditProductOpen] = useState(false);

  let updatedStock = stock - product.stock;

  const saveHandler = async (id, unit) => {
    setStockOnOpenModal(false);
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to update product stock",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Update stock",
    });
    if (result.isConfirmed) {
      dispatch(updateStock(id, stock, setEdit, updatedStock, unit));
    }
  };

  const deleteHandler = async (id, unit) => {
    const deletedStock = 0;
    updatedStock = deletedStock - product.stock;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to set out of stock?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Out of stock!",
    });
    if (result.isConfirmed) {
      setStock(0);
      dispatch(updateStock(id, deletedStock, setEdit, updatedStock, unit));
    }
  };

  const handleDeleteProductOnAdmin = async (idproduct) => {
    try {
      let response = await axios.delete(
        `${process.env.REACT_APP_API_BE}/admin/products/${idproduct}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate("/admin/products");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message,
      });
    }
  };

  const handleConfirmationDeleteProduct = async (idproduct) => {
    fetchProducts();
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this question",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Delete",
    });
    if (result.isConfirmed) {
      handleDeleteProductOnAdmin(idproduct);
    }
  };

  useEffect(() => {
    dispatch(fetchDetailProduct(params.idproduct));
  }, []);

  useEffect(() => {
    setStock(product.stock);
  }, [product.stock]);

  return (
    <>
      <div className="w-screen h-full flex justify-between bg-slate-50">
        <div className="sidebar-width">
          <Sidebar />
        </div>
        <div className="min-h-screen h-full bg-dashboard-admin p-8 lg:p-28 flex flex-col gap-6 content-width">
          <p className="text-3xl font-bold ">Detail Product</p>
          <div className="flex flex-col lg:flex-row gap-11 my-11 mx-auto">
            <img
              src={
                product.product_image
                  ? `${process.env.REACT_APP_API_BE}/uploads/${product.product_image}`
                  : "./assets/icon-medicine.png"
              }
              alt=""
              width="240px"
              height="fit-content"
              style={{ height: "fit-content" }}
            />
            <div className="w-full">
              <div className="flex justify-between w-full items-start gap-4">
                <p className="font-bold text-3xl lg:text-5xl">{product.name}</p>
                <div className="flex gap-2 lg:gap-4">
                  <Button
                    colorScheme="blue"
                    className="lg:w-full w-4"
                    onClick={() => {
                      setModalEditProductOpen(true);
                    }}
                  >
                    <div className="block lg:hidden">
                      <svg
                        fill="none"
                        stroke="white"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                        ></path>
                      </svg>
                    </div>
                    <p className="hidden lg:block">Edit</p>
                  </Button>
                  <Button
                    colorScheme="red"
                    className="lg:w-full w-4"
                    onClick={() =>
                      handleConfirmationDeleteProduct(product.idproduct)
                    }
                  >
                    <div className="block lg:hidden">
                      <svg
                        fill="none"
                        stroke="white"
                        strokeWidth="1.5"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                        className="w-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                        ></path>
                      </svg>
                    </div>
                    <p className="hidden lg:block">Delete</p>
                  </Button>
                </div>
              </div>
              <div className="w-full lg:w-3/4 my-6">
                <p>{product.description}</p>
              </div>
              <div>
                <div className="text-xl lg:text-2xl mt-11 mb-4 font-semibold">
                  <p>Detail Product</p>
                </div>
                <div className="flex">
                  <div className="flex flex-col gap-4 w-full lg:w-1/5">
                    <p>Category</p>
                    <p>Price</p>
                    <p>Weight</p>
                  </div>
                  <div className="flex flex-col gap-4 text-right lg:text-left">
                    <div className="flex gap-2">
                      {(product.categories || []).length > 0
                        ? (product.categories || []).map((category) => {
                            return (
                              <p key={category.idcategory}>
                                {category.name || "-"}
                              </p>
                            );
                          })
                        : "-"}
                    </div>
                    <p>{currency(product.price)}</p>
                    <p>{product.weight || "-"} gram</p>
                  </div>
                </div>
              </div>
              <div>
                <div className="text-xl lg:text-2xl mt-11 mb-4 font-semibold">
                  <p>Stock Detail</p>
                </div>
                <div className="flex">
                  <div className="w-full lg:w-1/5">
                    <p>Stock</p>
                  </div>

                  {product.stock === 0 ? (
                    <p className="text-red-600 font-bold">Out of stock</p>
                  ) : (
                    <div className="flex gap-2">
                      <p>{product.stock}</p>
                      <p>{product.unit_product}</p>
                    </div>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 mt-6">
                  <Button
                    className="button-primary"
                    onClick={() => setStockOnOpenModal(true)}
                  >
                    Update stock
                  </Button>
                  <Button
                    onClick={() =>
                      deleteHandler(product.idproduct, product.unit_product)
                    }
                    className="border-button"
                  >
                    Set out of stock
                  </Button>
                </div>
              </div>
            </div>
          </div>
          <div />
          <Divider orientation="horizontal" />
          <div>
            <div className="text-2xl font-semibold flex flex-wrap lg:flex-nowrap gap-2">
              <p>History Stock of</p>
              <p className="text-blue-700">{product.name}</p>
            </div>
            <div>
              <TableHistoryStockByIdProduct
                idproduct={params.idproduct}
                stock={product.stock}
              />
            </div>
          </div>
        </div>

        <Modal
          isOpen={stockOnOpenModal}
          onClose={() => setStockOnOpenModal(false)}
        >
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update stock</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <div className="">
                <label htmlFor="email" className="sr-only" />

                <div>
                  <Input
                    type="text"
                    placeholder={product.stock}
                    className="shadow-sm mt-4"
                    value={stock}
                    onChange={(e) => setStock(e.target.value)}
                  />
                </div>
              </div>
            </ModalBody>
            <ModalFooter>
              <Button
                className="button-primary"
                colorScheme="blue"
                mr={3}
                type="submit"
                isLoading={isLoading}
                onClick={() =>
                  saveHandler(product.idproduct, product.unit_product)
                }
              >
                Save
              </Button>
              <Button onClick={() => setStockOnOpenModal(false)}>Cancel</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
        <EditProductModal
          product={product}
          isOpen={modalEditProductOpen}
          onClose={() => setModalEditProductOpen(false)}
        />
      </div>
    </>
  );
}

export default DetailProduct;
