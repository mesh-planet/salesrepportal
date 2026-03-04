export interface CartItem {
  variantId: string;
  productId: string;
  productTitle: string;
  variantTitle: string;
  sku: string;
  quantity: number;
  price: string;
  imageUrl: string;
}

export interface CartState {
  companyLocationId: string;
  companyId: string;
  companyName: string;
  locationName: string;
  companyContactId: string;
  items: CartItem[];
  note: string;
}

export type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "UPDATE_QUANTITY"; payload: { variantId: string; quantity: number } }
  | { type: "REMOVE_ITEM"; payload: { variantId: string } }
  | { type: "SET_NOTE"; payload: string }
  | { type: "SET_CONTACT"; payload: string }
  | { type: "SET_COMPANY"; payload: { companyLocationId: string; companyId: string; companyName: string; locationName: string } }
  | { type: "CLEAR_CART" };
