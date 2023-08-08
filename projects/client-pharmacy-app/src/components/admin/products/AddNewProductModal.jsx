import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Select,
} from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllCategory } from "../../../features/cartegory/categorySlice";
import { AUTH_TOKEN } from "../../../helpers/constant";
import axios from "axios";
import { getAllUnitConversion } from "../../../features/unit/unitConversion";
// import { getAllPromo } from "../../../features/promo/promoProductSlice";

function AddNewProductModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = localStorage.getItem(AUTH_TOKEN);
  const [formAddNewProduct, setFormAddNewProduct] = useState({
    idcategoryOne: "",
    idcategoryTwo: "",
    idcategoryThree: "",
    // idpromo: "",
    name: "",
    price: "",
    description: "",
    stock: "",
    unitProduct: "",
    weight: "",
  });
  const [resetFormAddNewProduct, setResetFormAddNewProduct] = useState({
    idcategoryOne: "",
    idcategoryTwo: "",
    idcategoryThree: "",
    // idpromo: "",
    name: "",
    price: "",
    description: "",
    stock: "",
    unitProduct: "",
    weight: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const categories = useSelector((state) => state.categories.categories);
  const units = useSelector((state) => state.units.units);
  // const promos = useSelector((state) => state.promos.promos);
  const [imagePreview, setImagePreview] = useState("");
  const [file, setFile] = useState();
  const [isAccept, setIsAccept] = useState(false);

  const onImageUploadHandler = (e) => {
    const fileDetail = e.target.files[0];
    const fileFormat = fileDetail.type.split("/")[1];

    if (fileDetail.size > 1024 * 1024) {
      setIsAccept(false);
    } else if (
      fileFormat === "jpeg" ||
      fileFormat === "png" ||
      fileFormat === "jpg"
    ) {
      setIsAccept(true);
      setFile(fileDetail);
      let preview = document.getElementById("productPhoto");
      preview.src = URL.createObjectURL(e.target.files[0]);
    } else {
      setIsAccept(false);
    }

    setImagePreview(URL.createObjectURL(e.target.files[0]));
    URL.revokeObjectURL(imagePreview);
  };

  const onClickSubmitHandler = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", formAddNewProduct.name);
    formData.append("price", formAddNewProduct.price);
    formData.append("description", formAddNewProduct.description);
    formData.append("stock", formAddNewProduct.stock);
    // formData.append("idpromo", formAddNewProduct.idpromo || null);
    formData.append("unitProduct", formAddNewProduct.unitProduct);
    formData.append("weight", formAddNewProduct.weight);
    if (formAddNewProduct.idcategoryOne)
      formData.append("idcategoryOne", formAddNewProduct.idcategoryOne);
    if (formAddNewProduct.idcategoryTwo)
      formData.append("idcategoryTwo", formAddNewProduct.idcategoryTwo);
    if (formAddNewProduct.idcategoryThree)
      formData.append("idcategoryThree", formAddNewProduct.idcategoryThree);

    try {
      setIsLoading(true);
      let response = await axios.post(
        `${process.env.REACT_APP_API_BE}/admin/products/`,
        formData,
        { headers: { authorization: `Bearer ${token}` } }
      );

      setIsLoading(false);
      onClose();
      window.location.reload();
      setFormAddNewProduct(resetFormAddNewProduct);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: response.data?.message,
      });
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: error.response?.data?.message || "Something went wrong!!",
      });
      setIsLoading(false);
      navigate("/admin/products");
    }
  };

  const handleAddProductForm = async (event) => {
    const key = event.target.name;
    setFormAddNewProduct({ ...formAddNewProduct, [key]: event.target.value });
  };

  const handleConfirmationAddProduct = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to add new product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Add product",
    });
    if (result.isConfirmed) {
      onClickSubmitHandler();
    }
  };

  useEffect(() => {
    dispatch(getAllCategory());
  }, []);

  useEffect(() => {
    dispatch(getAllUnitConversion());
    // dispatch(getAllPromo());
  }, []);

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New product</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-center">
                <p className=" text-slate-500">Upload picture</p>
                <div className="flex flex-col w-2/3">
                  <div>
                    {!isAccept ? (
                      <div className="mt-7 text-red-600 text-center">
                        *File must be in .jpeg or .png and size must not bigger
                        than 1MB
                      </div>
                    ) : null}
                  </div>
                  <div className="w-2/3">
                    <img id="productPhoto" src="" alt="" />
                  </div>
                  <input
                    className="w-2/3 border-2 border-slate-100 px-2 py-1 rounded-md"
                    onChange={onImageUploadHandler}
                    type="file"
                    id="profile_image"
                    name="file"
                  />
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className=" text-slate-500">Product name</p>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="-"
                  className="w-2/3 border-2 border-slate-100 px-2 py-1 rounded-md"
                  value={formAddNewProduct.name}
                  onChange={handleAddProductForm}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className=" text-slate-500">Price</p>
                <input
                  id="price"
                  name="price"
                  type="text"
                  placeholder="-"
                  className="w-2/3 border-2 border-slate-100 px-2 py-1 rounded-md"
                  value={formAddNewProduct.price}
                  onChange={handleAddProductForm}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className=" text-slate-500">Description</p>
                <textarea
                  id="description"
                  name="description"
                  type="text"
                  placeholder="-"
                  className="w-2/3 border-2 border-slate-100 px-2 py-1 rounded-md"
                  value={formAddNewProduct.description}
                  onChange={handleAddProductForm}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className=" text-slate-500">Stock</p>
                <input
                  id="stock"
                  name="stock"
                  type="text"
                  placeholder="-"
                  className="w-2/3 border-2 border-slate-100 px-2 py-1 rounded-md"
                  value={formAddNewProduct.stock}
                  onChange={handleAddProductForm}
                />
              </div>
              {/* <div className="flex justify-between items-center">
                <p className=" text-slate-500">Promo</p>
                <div className="flex w-2/3 border-slate-100 rounded-md">
                  <Select
                    placeholder="-"
                    id="idpromo"
                    name="idpromo"
                    onChange={handleAddProductForm}
                    value={formAddNewProduct.idpromo}
                  >
                    {promos.map((promo) => {
                      return (
                        <option value={promo.idpromo} key={promo.idpromo}>
                          {promo.name}
                        </option>
                      );
                    })}
                  </Select>
                </div>
              </div> */}
              <div className="flex justify-between items-center">
                <p className=" text-slate-500">Unit Product</p>
                <input
                  id="unitProduct"
                  name="unitProduct"
                  type="text"
                  placeholder="-"
                  className="w-2/3 border-2 border-slate-100 px-2 py-1 rounded-md"
                  value={formAddNewProduct.unitProduct}
                  onChange={handleAddProductForm}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className=" text-slate-500">Weight (gram)</p>
                <input
                  id="weight"
                  name="weight"
                  type="text"
                  placeholder="-"
                  className="w-2/3 border-2 border-slate-100 px-2 py-1 rounded-md"
                  value={formAddNewProduct.weight}
                  onChange={handleAddProductForm}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className=" text-slate-500">Category (I)</p>
                <div className="flex w-2/3 border-slate-100 rounded-md">
                  <Select
                    placeholder="-"
                    id="idcategoryOne"
                    name="idcategoryOne"
                    onChange={handleAddProductForm}
                    value={formAddNewProduct.idcategoryOne}
                  >
                    {categories.map((category, index) => {
                      return (
                        <option value={category.idcategory} key={index}>
                          {category.name}
                        </option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className=" text-slate-500">Category (II)</p>
                <div className="flex w-2/3 border-slate-100 rounded-md">
                  <Select
                    placeholder="-"
                    id="idcategoryTwo"
                    name="idcategoryTwo"
                    onChange={handleAddProductForm}
                    value={formAddNewProduct.idcategoryTwo}
                  >
                    {categories.map((category) => {
                      return (
                        <option
                          value={category.idcategory}
                          key={category.idcategory}
                        >
                          {category.name}
                        </option>
                      );
                    })}
                  </Select>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <p className=" text-slate-500">Category (III)</p>
                <div className="flex w-2/3 border-slate-100 rounded-md">
                  <Select
                    placeholder="-"
                    id="idcategoryThree"
                    name="idcategoryThree"
                    onChange={handleAddProductForm}
                    value={formAddNewProduct.idcategoryThree}
                  >
                    {categories.map((category) => {
                      return (
                        <option
                          value={category.idcategory}
                          key={category.idcategory}
                        >
                          {category.name}
                        </option>
                      );
                    })}
                  </Select>
                </div>
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button
              className="button-primary"
              colorScheme="blue"
              mr={3}
              onClick={handleConfirmationAddProduct}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default AddNewProductModal;
