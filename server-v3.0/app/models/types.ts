type ComponentType = {
    id: string; // Add this for easier management
    name: string;
    price: number;
    description?: string;
    imgUrl?: string;
    included?: boolean;
    discount?: number;
};