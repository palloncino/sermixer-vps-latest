import { useState, useEffect, useCallback } from 'react';

export const useDiscount = (initialPrice: number, initialDiscount: number | null) => {
    const [price, setPrice] = useState(initialPrice);
    const [discount, setDiscount] = useState(initialDiscount);
    const [discountedPrice, setDiscountedPrice] = useState<number | null>(null);

    useEffect(() => {
        setPrice(initialPrice);
        setDiscount(initialDiscount);
        if (initialDiscount !== null && !isNaN(initialPrice)) {
            const initialDiscountedPrice = calculateDiscountedPrice(initialPrice, initialDiscount);
            setDiscountedPrice(initialDiscountedPrice);
        }
    }, [initialPrice, initialDiscount]);

    const calculateDiscountedPrice = (price: number, discount: number | null) => {
        if (discount === null || isNaN(price)) return null;
        return price - (price * discount) / 100;
    };

    const handlePriceChange = useCallback((value: number) => {
        setPrice(value);
        if (discount !== null && !isNaN(value)) {
            const newDiscountedPrice = calculateDiscountedPrice(value, discount);
            setDiscountedPrice(newDiscountedPrice);
        }
    }, [price, discount]);

    const handleDiscountChange = useCallback((value: number) => {
        if (isNaN(value)) return;
        setDiscount(value);
        if (!isNaN(price)) {
            const newDiscountedPrice = calculateDiscountedPrice(price, value);
            setDiscountedPrice(newDiscountedPrice);
        }
    }, [price, discount]);

    const handleDiscountedPriceChange = useCallback((value: number) => {
        if (isNaN(value)) return;
        setDiscountedPrice(value);
        if (!isNaN(price)) {
            const newDiscount = 100 - ((value / price) * 100);
            setDiscount(newDiscount);
        }
    }, [price, discountedPrice]);

    const resetDiscount = useCallback(() => {
        setDiscount(null);
        setDiscountedPrice(null);
    }, []);

    return {
        price,
        discount,
        discountedPrice,
        handlePriceChange,
        handleDiscountChange,
        handleDiscountedPriceChange,
        resetDiscount
    };
};
