// src/components/FormattedPrice/index.tsx

import React from "react";
import { NumericFormat } from "react-number-format";
import { Box } from "@mui/material";

interface FormattedPriceProps {
    value: number;
    prefix?: string;
}

const FormattedPrice: React.FC<FormattedPriceProps> = ({ value, prefix = "€" }) => {
    return (
        <Box component="span" sx={{ 
            fontFamily: '"Open Sans", "Roboto", "Lato", sans-serif',
            letterSpacing: '0.3px',
            fontVariantNumeric: 'tabular-nums',
            fontWeight: 500
        }}>
            <NumericFormat
                value={value}
                displayType="text"
                thousandSeparator="."
                decimalSeparator=","
                decimalScale={2}
                fixedDecimalScale
                prefix={prefix}
            />
        </Box>
    );
};

export default FormattedPrice;
