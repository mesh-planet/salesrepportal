import { useReducer, useCallback } from "react";
import type { CartState, CartAction, CartItem } from "../types";

const INITIAL_STATE: CartState = {
  companyLocationId: "",
  companyId: "",
  companyName: "",
  locationName: "",
  companyContactId: "",
  items: [],
  note: "",
};

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find(
        (item) => item.variantId === action.payload.variantId
      );
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.variantId === action.payload.variantId
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case "UPDATE_QUANTITY": {
      if (action.payload.quantity <= 0) {
        return {
          ...state,
          items: state.items.filter(
            (item) => item.variantId !== action.payload.variantId
          ),
        };
      }
      return {
        ...state,
        items: state.items.map((item) =>
          item.variantId === action.payload.variantId
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
      };
    }
    case "REMOVE_ITEM":
      return {
        ...state,
        items: state.items.filter(
          (item) => item.variantId !== action.payload.variantId
        ),
      };
    case "SET_NOTE":
      return { ...state, note: action.payload };
    case "SET_CONTACT":
      return { ...state, companyContactId: action.payload };
    case "SET_COMPANY":
      return {
        ...INITIAL_STATE,
        companyLocationId: action.payload.companyLocationId,
        companyId: action.payload.companyId,
        companyName: action.payload.companyName,
        locationName: action.payload.locationName,
      };
    case "CLEAR_CART":
      return INITIAL_STATE;
    default:
      return state;
  }
}

export function useCart() {
  const [cart, dispatch] = useReducer(cartReducer, INITIAL_STATE);

  const addItem = useCallback(
    (item: CartItem) => dispatch({ type: "ADD_ITEM", payload: item }),
    []
  );

  const updateQuantity = useCallback(
    (variantId: string, quantity: number) =>
      dispatch({ type: "UPDATE_QUANTITY", payload: { variantId, quantity } }),
    []
  );

  const removeItem = useCallback(
    (variantId: string) =>
      dispatch({ type: "REMOVE_ITEM", payload: { variantId } }),
    []
  );

  const setNote = useCallback(
    (note: string) => dispatch({ type: "SET_NOTE", payload: note }),
    []
  );

  const setContact = useCallback(
    (contactId: string) =>
      dispatch({ type: "SET_CONTACT", payload: contactId }),
    []
  );

  const setCompany = useCallback(
    (params: {
      companyLocationId: string;
      companyId: string;
      companyName: string;
      locationName: string;
    }) => dispatch({ type: "SET_COMPANY", payload: params }),
    []
  );

  const clearCart = useCallback(
    () => dispatch({ type: "CLEAR_CART" }),
    []
  );

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.items.reduce(
    (sum, item) => sum + parseFloat(item.price) * item.quantity,
    0
  );

  return {
    cart,
    addItem,
    updateQuantity,
    removeItem,
    setNote,
    setContact,
    setCompany,
    clearCart,
    totalItems,
    subtotal,
  };
}
