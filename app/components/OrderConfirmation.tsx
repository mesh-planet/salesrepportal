import {
  Card,
  Text,
  BlockStack,
  Banner,
  Button,
  InlineStack,
} from "@shopify/polaris";
import { formatMoney } from "../lib/utils/format";

interface OrderConfirmationProps {
  success: boolean;
  draftOrderName?: string;
  draftOrderId?: string;
  totalAmount?: string;
  currencyCode?: string;
  invoiceSent?: boolean;
  errors?: string[];
  onNewOrder: () => void;
  onViewOrder: () => void;
}

export function OrderConfirmation({
  success,
  draftOrderName,
  draftOrderId,
  totalAmount,
  currencyCode,
  invoiceSent,
  errors,
  onNewOrder,
  onViewOrder,
}: OrderConfirmationProps) {
  if (!success) {
    return (
      <Card>
        <BlockStack gap="300">
          <Banner tone="critical">
            <p>Failed to create the draft order.</p>
            {errors?.map((err, i) => (
              <p key={i}>{err}</p>
            ))}
          </Banner>
          <Button onClick={onNewOrder}>Try Again</Button>
        </BlockStack>
      </Card>
    );
  }

  return (
    <Card>
      <BlockStack gap="400">
        <Banner tone="success">
          <p>
            Draft order <strong>{draftOrderName}</strong> created successfully
            {invoiceSent ? " and invoice sent!" : "."}
          </p>
        </Banner>
        {totalAmount && currencyCode && (
          <Text as="p" variant="bodyMd">
            Total: {formatMoney(totalAmount, currencyCode)}
          </Text>
        )}
        <InlineStack gap="300">
          <Button variant="primary" onClick={onNewOrder}>
            Place Another Order
          </Button>
          <Button onClick={onViewOrder}>View Order</Button>
        </InlineStack>
      </BlockStack>
    </Card>
  );
}
