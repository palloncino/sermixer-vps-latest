import React from "react";
import { TextField, InputAdornment } from "@mui/material";
import { NumericFormat, NumericFormatProps } from "react-number-format";
import styled from "styled-components";

const StyledTextField = styled(TextField)`
  & .MuiInputBase-input {
    background: #fff;
    text-align: right;
  }
`;

interface EuroTextFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  fullWidth?: boolean;
  sx?: object;
  readOnly?: boolean;
}

const EuroTextField: React.FC<EuroTextFieldProps> = ({
  label,
  value,
  onChange,
  fullWidth = false,
  sx,
  readOnly,
}) => {
  const handleValueChange: NumericFormatProps['onValueChange'] = (values) => {
    const { formattedValue, value } = values;
    onChange(value); // Pass the numeric value to the parent
  };

  return (
    <NumericFormat
      customInput={StyledTextField}
      label={label}
      value={value}
      onValueChange={handleValueChange}
      thousandSeparator="."
      decimalSeparator=","
      decimalScale={2}
      fixedDecimalScale
      fullWidth={fullWidth}
      sx={sx}
      InputProps={{
        startAdornment: <InputAdornment position="start">€</InputAdornment>,
        readOnly: readOnly ? true : undefined,
      }}
    />
  );
};

export default EuroTextField;
