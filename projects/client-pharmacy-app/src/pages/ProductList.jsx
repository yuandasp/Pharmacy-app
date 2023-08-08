import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { getAllProductsByFilter } from "../features/product/productSlice";
import { getAllCategory } from "../features/cartegory/categorySlice";
import {
  Stack,
  Button,
  Input,
  MenuButton,
  Menu,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import CardProduct from "../components/CardProduct";

function Productlist() {
  const dispatch = useDispatch();
  const [query, setQuery] = useState({
    order: "asc",
    productName: "",
    category: "",
    sortBy: "name",
    page: 1,
  });

  const productlist = useSelector((state) => state.products.productList);
  const totalPage = useSelector((state) => state.products.totalPage);
  const categories = useSelector((state) => state.categories.categories);

  const tempArray = Array.from({ length: totalPage }, (_, i) => i + 1);

  useEffect(() => {
    dispatch(getAllProductsByFilter(query));
    dispatch(getAllCategory());
  }, [query]);

  const getSortName = () => {
    if (query.sortBy === "name" && query.order === "asc") return "A-Z";
    if (query.sortBy === "name" && query.order === "desc") return "Z-A";
    if (query.sortBy === "price" && query.order === "asc")
      return "Lowest Price";
    if (query.sortBy === "price" && query.order === "desc")
      return "Highest Price";

    return "A-Z";
  };

  const getCategoryName = () => {
    if (!query.category) return "All Categories";
    if (query.category) return query.category;

    return "All Categories";
  };

  return (
    <div className="flex flex-col lg:flex-row p-5">
      <div className="p-6 justify-normal ">
        <div className="font-extrabold text-xl text-color-green">
          Product
          <hr className="mt-2" />
          {/* Filter Product */}
        </div>

        <div className="text-sm font-semibold mt-4">
          Product Name
          <Stack spacing={3} className="mt-2">
            <Input
              placeholder="Find Product"
              size="sm"
              onChange={(e) =>
                setQuery({ ...query, productName: e.target.value, page: 1 })
              }
            />
          </Stack>
        </div>

        {/* Sort */}
        <div className="mt-4 text-sm font-semibold">
          Sort Product
          <div className="mt-2">
            <Menu>
              <MenuButton
                size="sm"
                className="button-primary"
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                {getSortName()}
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={(e) =>
                    setQuery({ ...query, sortBy: "name", order: "asc" })
                  }
                >
                  A-Z
                </MenuItem>
                <MenuItem
                  onClick={(e) =>
                    setQuery({ ...query, sortBy: "name", order: "desc" })
                  }
                >
                  Z-A
                </MenuItem>
                <MenuItem
                  onClick={(e) =>
                    setQuery({ ...query, sortBy: "price", order: "asc" })
                  }
                >
                  Lowest Price
                </MenuItem>
                <MenuItem
                  onClick={(e) =>
                    setQuery({ ...query, sortBy: "price", order: "desc" })
                  }
                >
                  Highest Price
                </MenuItem>
              </MenuList>
            </Menu>
          </div>
        </div>
        <div className="mt-4 text-sm font-semibold">
          {/* Category */}
          Category Product
          <div className="mt-2">
            <Menu>
              <MenuButton
                size="sm"
                className="button-primary"
                as={Button}
                rightIcon={<ChevronDownIcon />}
              >
                {getCategoryName()}
              </MenuButton>
              <MenuList>
                <MenuItem onClick={() => setQuery({ ...query, category: "" })}>
                  All Categories
                </MenuItem>
                {categories.map((category) => {
                  return (
                    <MenuItem
                      onClick={() =>
                        setQuery({ ...query, category: category.name })
                      }
                    >
                      {category.name}
                    </MenuItem>
                  );
                })}
              </MenuList>
            </Menu>
          </div>
        </div>
        <hr className="mt-6" />
      </div>

      {productlist.length > 0 ? (
        <div className="flex flex-col mx-6 my-11">
          <div className="flex flex-wrap gap-4 mt-6">
            {productlist.map((product) => (
              <CardProduct product={product} />
            ))}
          </div>

          <div className="flex p-3 mt-3 justify-center">
            <Button
              size={"xs"}
              className="button-primary"
              onClick={() =>
                setQuery({
                  ...query,
                  page: query.page === 1 ? 1 : query.page - 1,
                })
              }
            >
              {"<"}
            </Button>
            <div className="flex flex-row mx-3">
              {tempArray.map((value) => (
                <p
                  className="mx-2 cursor-pointer"
                  onClick={() => setQuery({ ...query, page: value })}
                >
                  {value === query.page ? <b>{value}</b> : value}
                </p>
              ))}
            </div>
            <Button
              size={"xs"}
              className="button-primary"
              onClick={() =>
                setQuery({
                  ...query,
                  page: query.page === totalPage ? totalPage : query.page + 1,
                })
              }
            >
              {">"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="w-full my-11">
          <div className="flex flex-col items-center">
            <p className="text-xl mb-11 font-bold text-slate-400">
              No product found
            </p>
            <img
              src={"./assets/image-no-data-user.svg"}
              alt=""
              width="200px"
              className=""
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Productlist;
