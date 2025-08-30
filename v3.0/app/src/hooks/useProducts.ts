import { useState, useCallback } from "react";
import { request } from "../utils/request";
import { ProductAPIResponse, ProductType } from '../types';
import { dataURLtoFile } from '../utils/base64Utils';
import { v4 as uuidv4 } from 'uuid';

export type ProductsStateType = {
  products: ProductType[];
  getProducts: () => Promise<void>;
  getProductsIsLoading: boolean;
  getProductsError: string | null;
  addProduct: (productData: ProductType) => Promise<{ success: boolean; product: ProductType }>;
  addProductIsLoading: boolean;
  addProductError: string | null;
  setAddProductError: (error: string | null) => void;
  editProduct: (productData: ProductType) => Promise<{ success: boolean; product: ProductType }>
  editProductIsLoading: boolean;
  editProductError: string | null;
  deleteProducts: (productIds: string[]) => Promise<void>;
  deleteProductIsLoading: boolean;
  deleteProductError: string | null;
  handleSaveProduct: (product: ProductType & { image?: File }, isEditing: boolean) => Promise<{ product: ProductType } | undefined>;
  getProductById: (id: number) => Promise<{ success: boolean; product: ProductType }>;
  loading: boolean;
  error: any;
};

export const useProducts = (): ProductsStateType => {
  const [products, setProducts] = useState<ProductType[]>([]);
  const [getProductsIsLoading, setGetProductsIsLoading] = useState(false);
  const [getProductsError, setGetProductsError] = useState<string | null>(null);
  const [addProductIsLoading, setAddProductIsLoading] = useState(false);
  const [addProductError, setAddProductError] = useState<string | null>(null);
  const [editProductIsLoading, setEditProductIsLoading] = useState(false);
  const [editProductError, setEditProductError] = useState<string | null>(null);
  const [deleteProductIsLoading, setDeleteProductIsLoading] = useState(false);
  const [deleteProductError, setDeleteProductError] = useState<string | null>(null);
  const [error, setError] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const getProductById = useCallback(async (id: number): Promise<{ success: boolean; product: ProductType }> => {
    setLoading(true);
    try {
      const data = await request({
        url: `${process.env.REACT_APP_API_URL}/products/get-product/${id}`,
      });
      return data;
    } catch (err: any) {
      setError(err.message ? err.message : err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getProducts = useCallback(async () => {
    setGetProductsIsLoading(true);
    try {
      const data = await request({
        url: `${process.env.REACT_APP_API_URL}/products/get-products`,
      });
      setProducts(data);
      setGetProductsError(null);
    } catch (err) {
      setGetProductsError(err.message);
    } finally {
      setGetProductsIsLoading(false);
    }
  }, []);

  const addProduct = async (formData: FormData): Promise<{ success: boolean; product: ProductType }> => {
    setAddProductIsLoading(true);
    try {

      const response = await request({
        url: `${process.env.REACT_APP_API_URL}/products/create-product`,
        method: "POST",
        body: formData,
        isFormData: true,
      });

      setProducts((prev) => [...prev, response.product]);
      return response;
    } catch (error) {
      setAddProductError(error.message);
      throw error;
    } finally {
      setAddProductIsLoading(false);
    }
  };

  const editProduct = async (formData: FormData): Promise<{ success: boolean; product: ProductType }> => {
    setEditProductIsLoading(true);
    try {
      const data = await request({
        url: `${process.env.REACT_APP_API_URL}/products/edit-product`,
        method: "PUT",
        body: formData,
        isFormData: true,
      });
      if (data.success) {
        setProducts((prev) => prev.map((p) => (p.id === data.product.id ? data.product : p)));
      }
      return data;
    } catch (err) {
      console.error("Error updating product:", err);
      setEditProductError(err.message);
      throw err;
    } finally {
      setEditProductIsLoading(false);
    }
  };

  const deleteProducts = async (productIds: string[] = []) => {
    setDeleteProductIsLoading(true);
    try {
      const response = await request({
        url: `${process.env.REACT_APP_API_URL}/products/delete-products`,
        method: "DELETE",
        body: { ids: productIds },
      });
      const deletedIds = response.ids;
      setProducts((prev) => prev.filter((p) => !deletedIds.includes(p.id)));
      return response;
    } catch (err) {
      setDeleteProductError(err.message);
      throw err;
    } finally {
      setDeleteProductIsLoading(false);
    }
  };

  const handleSaveProduct = async (product: ProductType, isEditing: boolean): Promise<ProductAPIResponse> => {
    const formData = new FormData();

    // Prepare productData JSON
    const productData = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      imgUrl: product.imgUrl,
      components: product.components?.map((c) => ({
        discount: c.discount,
        description: c.description,
        included: false,
        imgUrl: c.imgUrl,
        name: c.name,
        price: c.price,
        quantity: 1,
      })) || [],
      company: product.company,
      discount: product.discount,
    };

    formData.append('productData', JSON.stringify(productData));

    // Add main product image if it exists
    if (product.image instanceof File) {
      formData.append('image', product.image);
    }

    // Add component images
    product.components?.forEach((component, index) => {
      if (component.image instanceof File) {
        formData.append(`componentImages[${index}]`, component.image);
      }
    });

    try {
      let response;
      if (isEditing) {
        response = await editProduct(formData);
      } else {
        response = await addProduct(formData);
      }
      return response;
    } catch (error) {
      console.error(`Failed to ${isEditing ? 'update' : 'add'} product:`, error);
      throw error;
    }
  };

  return {
    getProductById,
    products,
    getProducts,
    getProductsIsLoading,
    getProductsError,
    addProduct,
    addProductIsLoading,
    setAddProductError,
    addProductError,
    editProduct,
    editProductIsLoading,
    editProductError,
    deleteProducts,
    deleteProductIsLoading,
    deleteProductError,
    handleSaveProduct,
    error,
    loading
  };
};
