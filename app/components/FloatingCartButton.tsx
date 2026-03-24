import { useCartContext } from "./CartProvider";
import { formatMoney } from "../lib/utils/format";

interface FloatingCartButtonProps {
  currencyCode: string;
  onReviewOrder: () => void;
}

export function FloatingCartButton({
  currencyCode,
  onReviewOrder,
}: FloatingCartButtonProps) {
  const { totalItems, subtotal } = useCartContext();

  if (totalItems === 0) return null;

  return (
    <button
      className="rep-portal-floating-cart"
      onClick={onReviewOrder}
      type="button"
    >
      <span className="rep-portal-floating-cart__badge">{totalItems}</span>
      <span className="rep-portal-floating-cart__text">
        Cart — {formatMoney(String(subtotal), currencyCode)}
      </span>
    </button>
  );
}
