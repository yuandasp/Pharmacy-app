import React, { useState, useEffect } from "react";
import Sidebar from "../../components/admin/Sidebar";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  TableContainer,
  Td,
  Button,
  Input,
  Checkbox,
  Select,
} from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import {
  assignDiscount,
  editDiscount,
  fetchDiscount,
} from "../../features/promo/promoSlice";
import { useSelector } from "react-redux";
import { fetchProducts } from "../../features/cart/productsSlice";
import ProductsDiscountRow from "../../components/admin/discounts/ProductsDiscountRow";
import { useParams } from "react-router-dom";

function ProductsDisount() {
  const dispatch = useDispatch();
  const { idPromo } = useParams();
  const discountData = useSelector((state) => state.promo.discount);
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(discountData.name);
  const [description, setDescription] = useState(discountData.description);
  const [condition, setCondition] = useState(discountData.condition);
  const [discount, setDiscount] = useState(discountData.discount);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [offset, setOffset] = useState(0);
  const [order, setOrder] = useState("ASC");
  const limit = 0;
  const products = useSelector((state) => state.product.products);
  const [assignedProducts, setAssignedProducts] = useState([]); // Array to store assigned product IDs
  const [selectAll, setSelectAll] = useState(false); // State to track the "Select All" checkbox

  const handleEditSave = () => {
    const editedData = {
      name: name,
      description: description,
      condition: 0,
      discount: discount,
    };
    dispatch(editDiscount(discountData.idpromo, editedData));
    setEdit(false); // Set edit back to false after saving
  };
  const handleProductCheck = (productId, isChecked) => {
    const updatedProducts = [...assignedProducts];
    const existingProductIndex = updatedProducts.findIndex(
      (item) => item.idproduct === productId
    );

    if (existingProductIndex !== -1) {
      // Update the existing product's checked value
      updatedProducts[existingProductIndex].checked = isChecked;
    } else {
      // Add a new product to the array
      updatedProducts.push({ idproduct: productId, checked: isChecked });
    }

    setAssignedProducts(updatedProducts);
  };
  const searchHandler = (e) => {
    setOffset(0);
    setSearch(e.target.value);
  };
  const filterHandler = (e) => {
    setOffset(0);
    setFilter(e.target.value);
  };
  const sortHandler = (e) => {
    setOffset(0);
    setOrder(e.target.value);
  };

  const handleSelectAllChange = (isChecked) => {
    setSelectAll(isChecked);
    if (isChecked) {
      const selectedProducts = products.map((product) => product.idproduct);
      setAssignedProducts(selectedProducts);
    }
  };
  const handleSave = () => {
    assignedProducts.map((idproduct) => {
      dispatch(assignDiscount(discountData.idpromo, idproduct));
    });
    setAssignedProducts([]);
  };

  useEffect(() => {
    dispatch(fetchDiscount(idPromo));
    dispatch(fetchProducts(order, filter, search, offset, limit));
  }, [search, order]);

  return (
    <div className="w-screen h-full flex justify-between bg-slate-50">
      <div className="sidebar-width">
        <Sidebar />
      </div>
      <div className="min-h-screen h-full bg-dashboard-admin p-8 lg:p-28 flex flex-col gap-11 content-width">
        <h1 className="text-3xl font-bold">Manage Discount</h1>

        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-bold">Discount Detail's</h2>

          <TableContainer>
            <Table Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Description</Th>
                  <Th>Minimum Transaction</Th>
                  <Th>Discount/Bonus</Th>
                  <Th>Action</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>
                    {edit ? (
                      <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                      />
                    ) : (
                      discountData.name
                    )}
                  </Td>
                  <Td>
                    {edit ? (
                      <Input
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                      />
                    ) : (
                      discountData.description
                    )}
                  </Td>
                  <Td>
                    {edit ? (
                      <Input
                        value={condition}
                        onChange={(e) => setCondition(e.target.value)}
                      />
                    ) : (
                      discountData.condition
                    )}
                    {discountData.type === "Bonus Item" && " Item"}
                  </Td>
                  <Td>
                    {edit ? (
                      <Input
                        value={discount}
                        onChange={(e) => setDiscount(e.target.value)}
                      />
                    ) : (
                      discountData.discount
                    )}
                    {discountData.type === "Bonus Item" && " Item"}
                  </Td>

                  <Td className="flex gap-3">
                    {edit ? (
                      <>
                        <Button
                          colorScheme="teal"
                          size="sm"
                          onClick={() => handleEditSave()}
                        >
                          Save
                        </Button>
                        <Button
                          colorScheme="red"
                          size="sm"
                          onClick={() => setEdit(false)}
                        >
                          Cancel
                        </Button>
                      </>
                    ) : (
                      <Button
                        colorScheme="teal"
                        size="sm"
                        onClick={() => setEdit(true)}
                      >
                        Edit
                      </Button>
                    )}
                  </Td>
                </Tr>
              </Tbody>
            </Table>
          </TableContainer>
        </div>

        {/* Card to show the product list for assigning the discount */}
        <div className="bg-white p-4 rounded shadow-md">
          <h2 className="text-lg font-bold py-3">Assign Promo</h2>
          <div className="flex flex-col lg:w-[28rem]  gap-4">
            <Select onChange={(e) => sortHandler(e)}>
              <option value="ASC">Sort By : Name (A-Z)</option>
              <option value="DESC">Sort By : Name (Z-A)</option>
            </Select>
            <div>
              <input
                type="text"
                placeholder="Search Products"
                className="bg-gray-50 border border-green-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full lg:w-[28rem] h-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 "
                onChange={(e) => searchHandler(e)}
              />
            </div>
          </div>

          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  <Th>Stock</Th>
                  <Th>Price</Th>
                  <Th>Discount/Bonus</Th>
                  <Th>
                    {/* "Select All" checkbox */}
                    <Checkbox
                      isChecked={selectAll}
                      onChange={(e) => handleSelectAllChange(e.target.checked)}
                    >
                      Select All
                    </Checkbox>
                  </Th>
                  {/* Add more table headers as needed */}
                </Tr>
              </Thead>
              <Tbody>
                {products.map((product) => (
                  <ProductsDiscountRow
                    key={product.id}
                    product={product}
                    discount={discountData}
                    onProductCheck={handleProductCheck}
                    selectAll={selectAll}
                  />
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </div>

        {/* Save button */}
        <div>
          <Button colorScheme="teal" size="sm" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ProductsDisount;
