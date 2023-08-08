import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Box,
  Text,
  VStack,
  Radio,
  RadioGroup
} from "@chakra-ui/react";

function ChooseDiscountModal({ isOpen, onClose, discounts, handleDiscountChange, applyDiscount, totalPrice }) {
  const [selectedDiscount, setSelectedDiscount] = useState(null);

  const handleRadioChange = (value) => {
    setSelectedDiscount(JSON.parse(value));
  };

  const handleApplyDiscount = () => {
    if (selectedDiscount) {
      handleDiscountChange(selectedDiscount);
      applyDiscount();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Choose Discount</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
  <VStack spacing={4} align="stretch">
    <RadioGroup value={selectedDiscount ? JSON.stringify(selectedDiscount) : null} onChange={handleRadioChange}>
      {discounts.map((discount, index) => (
        <Radio
          key={discount.idpromo}
          value={JSON.stringify({ percentage: discount.discount, id: discount.idpromo })}
          isDisabled={totalPrice.totalPrice < discount.condition}
          mb={index !== discounts.length - 1 ? 4 : 0} // Add bottom margin to all except the last one
        >
          <Box
            p={4}
            borderWidth={1}
            borderRadius="md"
            boxShadow="md"
            cursor="pointer"
            _hover={{ backgroundColor: "gray.100" }}
          >
            <Text fontWeight="bold" fontSize="lg">
              {discount.name}
            </Text>
            <Text>{discount.description}</Text>
          </Box>
        </Radio>
      ))}
    </RadioGroup>
  </VStack>
</ModalBody>
        <ModalFooter>
          <Button colorScheme="teal" mr={3} onClick={handleApplyDiscount} disabled={!selectedDiscount}>
            Apply Discount
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}

export default ChooseDiscountModal;
