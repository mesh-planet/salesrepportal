import { useState, useMemo } from "react";
import {
  Card,
  ResourceList,
  ResourceItem,
  Text,
  TextField,
  Badge,
  InlineStack,
  BlockStack,
  Button,
  EmptyState,
} from "@shopify/polaris";
import type { CompanyLocation } from "../types";
import { formatAddress } from "../lib/utils/format";

interface CompanySelectorProps {
  locations: CompanyLocation[];
  onSelect: (locationId: string) => void;
}

export function CompanySelector({
  locations,
  onSelect,
}: CompanySelectorProps) {
  const [searchValue, setSearchValue] = useState("");

  const filteredLocations = useMemo(() => {
    if (!searchValue) return locations;
    const lower = searchValue.toLowerCase();
    return locations.filter(
      (loc) =>
        loc.name.toLowerCase().includes(lower) ||
        loc.company.name.toLowerCase().includes(lower) ||
        (loc.shippingAddress?.city?.toLowerCase().includes(lower) ?? false) ||
        (loc.shippingAddress?.country?.toLowerCase().includes(lower) ?? false)
    );
  }, [locations, searchValue]);

  if (locations.length === 0) {
    return (
      <Card>
        <EmptyState
          heading="No accounts assigned"
          image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        >
          <p>
            You don't have any company locations assigned to you yet. Contact
            your manager to get access.
          </p>
        </EmptyState>
      </Card>
    );
  }

  return (
    <Card padding="0">
      <div style={{ padding: "16px 16px 0" }}>
        <TextField
          label=""
          labelHidden
          placeholder="Search companies..."
          value={searchValue}
          onChange={setSearchValue}
          autoComplete="off"
          clearButton
          onClearButtonClick={() => setSearchValue("")}
        />
      </div>
      <ResourceList
        items={filteredLocations}
        renderItem={(location) => {
          const address = formatAddress(location.shippingAddress);
          const catalogCount = location.catalogs?.nodes?.length ?? 0;

          return (
            <ResourceItem
              id={location.id}
              onClick={() => onSelect(location.id)}
              accessibilityLabel={`Place order for ${location.company.name}`}
            >
              <InlineStack align="space-between" blockAlign="center">
                <BlockStack gap="100">
                  <Text as="h3" variant="headingMd" fontWeight="semibold">
                    {location.company.name}
                  </Text>
                  <Text as="p" variant="bodySm" tone="subdued">
                    {location.name} — {address}
                  </Text>
                  {catalogCount > 0 && (
                    <InlineStack gap="200">
                      <Badge tone="info">
                        {`${catalogCount} catalog${catalogCount !== 1 ? "s" : ""}`}
                      </Badge>
                    </InlineStack>
                  )}
                </BlockStack>
                <Button
                  onClick={() => onSelect(location.id)}
                >
                  Place Order
                </Button>
              </InlineStack>
            </ResourceItem>
          );
        }}
      />
    </Card>
  );
}
