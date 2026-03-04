export interface ProductImage {
  url: string;
  altText: string | null;
}

export interface SelectedOption {
  name: string;
  value: string;
}

export interface ProductVariant {
  id: string;
  title: string;
  sku: string | null;
  price: string;
  availableForSale: boolean;
  inventoryQuantity: number | null;
  selectedOptions: SelectedOption[];
  image: ProductImage | null;
}

export interface ProductOption {
  name: string;
  values: string[];
}

export interface Product {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  status: string;
  featuredImage: ProductImage | null;
  variants: {
    nodes: ProductVariant[];
  };
  options: ProductOption[];
  totalInventory: number | null;
}

export interface PageInfo {
  hasNextPage: boolean;
  endCursor: string | null;
}
