import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Button,
  Tooltip,
  Card,
  CardBody,
  CardFooter,
  Image,
  Stack,
  Heading,
  Text,
  Divider,
  ButtonGroup,
  Badge,
} from "@chakra-ui/react";
import { currency } from "../helpers/currency";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addProductToCart } from "../features/cart/cartSlice";

function CardProduct({ product }) {
  const myCart = useSelector((state) => state.cart.cart);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const getName = (name) => {
    if (name.length > 15) {
      return name.slice(0, 15) + "...";
    }
    return name;
  };

  const calculateDiscountedPrice = (price, discount) => {
    return price - (price * discount) / 100;
  };

  useEffect(() => {
    localStorage.setItem("myCart", JSON.stringify(myCart));
  }, [myCart]);

  return (
    <div className="max-w-xs flex flex-col items-center p-2 shadow-card-tagline border-y-2 rounded-md">
      <Card maxW="xs">
        {product.discount ? (
          <Badge
            position="absolute"
            top="1"
            right="1"
            colorScheme="teal"
            fontSize="xs"
            py="1"
            px="2"
            rounded="md"
          >
            {product.type === "Bonus Item"
              ? product.promo_description
              : `${product.discount} %off`}
          </Badge>
        ) : (
          <></>
        )}
        <CardBody>
          <div className="w">
            <Image
              src={
                product.product_image
                  ? `${process.env.REACT_APP_API_BE}/uploads/${product.product_image}`
                  : "./assets/icon-medicine.png"
              }
              alt="medicine"
              className="w-20 h-20 mx-auto"
            />
          </div>
          <Stack mt="6" spacing="4">
            <Tooltip label={product.name}>
              {/* <Heading size="md">{product.name}</Heading> */}
              <Heading size="md">{getName(product.name)}</Heading>
            </Tooltip>
            {product.type === "Bonus Item" ? (
              <Text color="black" className="text-sm font-medium">
                {currency(product.price)}
              </Text>
            ) : product.discount ? (
              <>
                <Text color="gray.500" className="text-sm">
                  <del>{currency(product.price)}</del>
                </Text>
                <Text color="black" className="text-sm font-medium">
                  {currency(
                    calculateDiscountedPrice(product.price, product.discount)
                  )}
                </Text>
              </>
            ) : (
              <Text color="black" className="text-sm font-medium">
                Price: {currency(product.price)}
              </Text>
            )}
          </Stack>
        </CardBody>
        <Divider />
        <CardFooter>
          <ButtonGroup spacing="2">
            <Button
              size={"sm"}
              className="border-button"
              onClick={() =>
                dispatch(addProductToCart(product, calculateDiscountedPrice))
              }
            >
              Add to Cart
            </Button>
            <Button
              className="button-primary"
              variant={"ghost"}
              size={"sm"}
              onClick={() => navigate("/detail/" + product.idproduct)}
            >
              Detail
            </Button>
          </ButtonGroup>
        </CardFooter>
      </Card>
    </div>
  );
}

export default CardProduct;
