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
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getAllCategory } from "../../../features/cartegory/categorySlice";
import { AUTH_TOKEN } from "../../../helpers/constant";
import axios from "axios";
import { getAllUnitConversion } from "../../../features/unit/unitConversion";
import { fetchDetailProduct } from "../../../features/cart/productsSlice";
import { getAllPromo } from "../../../features/promo/promoProductSlice";

function EditProductModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const params = useParams();
  const token = localStorage.getItem(AUTH_TOKEN);
  const [formEditProduct, setFormEditProduct] = useState({
    idcategoryOne: "",
    idcategoryTwo: "",
    idcategoryThree: "",
    idpromo: "",
    name: "",
    price: "",
    description: "",
    unitProduct: "",
    weight: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const categories = useSelector((state) => state.categories.categories);
  const units = useSelector((state) => state.units.units);
  const promos = useSelector((state) => state.promos.promos);
  const [file, setFile] = useState();
  const [isAccept, setIsAccept] = useState(false);
  const product = useSelector((state) => state.products.product);
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
  };

  const handleEditProductForm = async (event) => {
    const key = event.target.name;
    setFormEditProduct({ ...formEditProduct, [key]: event.target.value });
  };

  const handleConfirmationEditProduct = async (onClose) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You want to edit this product?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Edit product",
    });
    if (result.isConfirmed) {
      onClickSubmitEditHandler(params.idproduct);
    }
  };

  const onClickSubmitEditHandler = async () => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("name", formEditProduct.name);
    formData.append("price", formEditProduct.price);
    formData.append("description", formEditProduct.description);
    formData.append("idpromo", formEditProduct.idpromo || null);
    formData.append("unitProduct", formEditProduct.unitProduct);
    formData.append("weight", formEditProduct.weight);
    if (formEditProduct.idcategoryOne)
      formData.append("idcategoryOne", formEditProduct.idcategoryOne);
    if (formEditProduct.idcategoryTwo)
      formData.append("idcategoryTwo", formEditProduct.idcategoryTwo);
    if (formEditProduct.idcategoryThree)
      formData.append("idcategoryThree", formEditProduct.idcategoryThree);

    try {
      setIsLoading(true);
      let response = await axios.put(
        `${process.env.REACT_APP_API_BE}/admin/products/${params.idproduct}`,
        formData,
        { headers: { authorization: `Bearer ${token}` } }
      );

      setIsLoading(false);
      onClose();
      dispatch(fetchDetailProduct(params.idproduct));
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
      navigate(`/admin/products/${params.idproduct}`);
    }
  };

  useEffect(() => {
    dispatch(getAllCategory());
  }, []);

  useEffect(() => {
    dispatch(getAllUnitConversion());
    dispatch(getAllPromo());
  }, []);

  useEffect(() => {
    if (isOpen) {
      setFormEditProduct({
        idcategoryOne: product?.categories[0]?.idcategory,
        idcategoryTwo: product?.categories[1]?.idcategory,
        idcategoryThree: product?.categories[2]?.idcategory,
        idpromo: product.idpromo,
        name: product.name,
        price: product.price,
        description: product.description,
        unitProduct: product.unit_product,
        productImage: product.product_image,
        weight: product.weight,
      });
    }
  }, [isOpen]);

  return (
    <div>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit product</ModalHeader>
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
                  <div>
                    <div className="w-2/3">
                      <img
                        id="productPhoto"
                        src={`${process.env.REACT_APP_API_BE}/uploads/${formEditProduct.productImage}`}
                        alt=""
                      />
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
              </div>
              <div className="flex justify-between items-center">
                <p className=" text-slate-500">Product name</p>
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="-"
                  className="w-2/3 border-2 border-slate-100 px-2 py-1 rounded-md"
                  value={formEditProduct.name}
                  onChange={handleEditProductForm}
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
                  value={formEditProduct.price}
                  onChange={handleEditProductForm}
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
                  value={formEditProduct.description}
                  onChange={handleEditProductForm}
                />
              </div>
              <div className="flex justify-between items-center">
                <p className=" text-slate-500">Promo</p>
                <div className="flex w-2/3 border-slate-100 rounded-md">
                  <Select
                    placeholder="-"
                    id="idpromo"
                    name="idpromo"
                    onChange={handleEditProductForm}
                    value={formEditProduct.idpromo}
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
              </div>
              <div className="flex justify-between items-center">
                <p className=" text-slate-500">Unit Product</p>
                <input
                  id="unitProduct"
                  name="unitProduct"
                  type="text"
                  placeholder="-"
                  className="w-2/3 border-2 border-slate-100 px-2 py-1 rounded-md"
                  value={formEditProduct.unitProduct}
                  onChange={handleEditProductForm}
                  required
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
                  value={formEditProduct.weight}
                  onChange={handleEditProductForm}
                  required
                />
              </div>
              <div className="flex justify-between items-center">
                <p className=" text-slate-500">Category (I)</p>
                <div className="flex w-2/3 border-slate-100 rounded-md">
                  <Select
                    placeholder="-"
                    id="idcategoryOne"
                    name="idcategoryOne"
                    onChange={handleEditProductForm}
                    value={formEditProduct.idcategoryOne}
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
                <p className=" text-slate-500">Category (II)</p>
                <div className="flex w-2/3 border-slate-100 rounded-md">
                  <Select
                    placeholder="-"
                    id="idcategoryTwo"
                    name="idcategoryTwo"
                    onChange={handleEditProductForm}
                    value={formEditProduct.idcategoryTwo}
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
                    onChange={handleEditProductForm}
                    value={formEditProduct.idcategoryThree}
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
              onClick={() => handleConfirmationEditProduct(onClose)}
            >
              Edit
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
}

export default EditProductModal;
