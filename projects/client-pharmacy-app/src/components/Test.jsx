import React from "react";
import { forwardRef } from "react";

const Test = forwardRef(({ props }, ref) => {
  return (
    <label>
      {props.label} Testing
      <input ref={ref} />
    </label>
  );
});

export default Test;
