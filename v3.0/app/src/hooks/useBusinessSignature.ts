import { useState, useEffect } from "react";
import { request } from "../utils/request";

export const useBusinessSignature = () => {
    const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const fetchSignature = async () => {
        setLoading(true);
        try {
            const response = await request({
                url: `${process.env.REACT_APP_API_URL}/media/get-business-signature`,
                method: "GET",
            });
            setSignatureUrl(response.signatureUrl);
        } catch (error) {
            setError("Error fetching signature");
        } finally {
            setLoading(false);
        }
    };

    const uploadSignature = async (formData: FormData) => {
        setLoading(true);
        try {
            await request({
                url: `${process.env.REACT_APP_API_URL}/media/business-signature`,
                method: "POST",
                body: formData,
            });
            fetchSignature(); // Refresh the signature URL after upload
        } catch (error) {
            setError("Error uploading signature");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSignature();
    }, []);

    return { signatureUrl, uploadSignature, loading, error };
};
