import {
  Card,
  Text,
  Button,
  BlockStack,
  InlineStack,
  Icon,
  Thumbnail,
} from "@shopify/polaris";
import { XIcon } from "@shopify/polaris-icons";
import { useCartContext } from "./CartProvider";
import { formatMoney } from "../lib/utils/format";

interface CartSummaryProps {
  currencyCode: string;
  onReviewOrder: () => void;
}

export function CartSummary({
  currencyCode,
  onReviewOrder,
}: CartSummaryProps) {
  const { cart, updateQuantity, removeItem, totalItems, subtotal } =
    useCartContext();

  if (cart.items.length === 0) {
    return (
      <Card>
        <BlockStack gap="200">
          <Text as="h2" variant="headingMd">
            Cart
          </Text>
          <Text as="p" variant="bodySm" tone="subdued">
            No items yet. Browse the catalog and add products.
          </Text>
        </BlockStack>
      </Card>
    );
  }

  return (
    <Card>
      <BlockStack gap="400">
        <Text as="h2" variant="headingMd">
          {`Cart (${totalItems} item${totalItems !== 1 ? "s" : ""})`}
        </Text>

        {cart.items.map((item) => (
          <div key={item.variantId} className="rep-portal-cart-item">
            {item.imageUrl ? (
              <Thumbnail
                source={item.imageUrl}
                alt={item.productTitle}
                size="small"
              />
            ) : null}
            <BlockStack gap="100">
              <Text as="span" variant="bodySm" fontWeight="semibold">
                {item.productTitle}
              </Text>
              {item.variantTitle !== "Default Title" && (
                <Text as="span" variant="bodySm" tone="subdued">
                  {item.variantTitle}
                </Text>
              )}
              <InlineStack gap="200" blockAlign="center">
                <Button
                  size="micro"
                  onClick={() =>
                    updateQuantity(item.variantId, item.quantity - 1)
                  }
                >
                  -
                </Button>
                <Text as="span" variant="bodySm">
                  {String(item.quantity)}
                </Text>
                <Button
                  size="micro"
                  onClick={() =>
                    updateQuantity(item.variantId, item.quantity + 1)
                  }
                >
                  +
                </Button>
                <Text as="span" variant="bodySm">
                  {formatMoney(
                    String(parseFloat(item.price) * item.quantity),
                    currencyCode
                  )}
                </Text>
                <Button
                  variant="plain"
                  onClick={() => removeItem(item.variantId)}
                  icon={XIcon}
                  accessibilityLabel="Remove item"
                />
              </InlineStack>
            </BlockStack>
          </div>
        ))}

        <InlineStack align="space-between">
          <Text as="span" variant="bodyMd" fontWeight="bold">
            Subtotal
          </Text>
          <Text as="span" variant="bodyMd" fontWeight="bold">
            {formatMoney(String(subtotal), currencyCode)}
          </Text>
        </InlineStack>

        <Button variant="primary" fullWidth onClick={onReviewOrder}>
          Review Order
        </Button>
      </BlockStack>
    </Card>
  );
}
