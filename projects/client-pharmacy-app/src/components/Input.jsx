import React from "react";
import { Input, InputGroup, InputLeftElement } from "@chakra-ui/react";

function InputComponent({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  ...props
}) {
  return (
    <>
      <InputGroup>
        <InputLeftElement pointerEvents="none">{props.icon}</InputLeftElement>
        <Input type="text" {...field} {...props} />
      </InputGroup>
    </>
  );
}

export default InputComponent;
