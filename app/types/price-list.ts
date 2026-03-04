export interface PriceListPrice {
  variant: {
    id: string;
  };
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice: {
    amount: string;
    currencyCode: string;
  } | null;
}

/** Maps variant GID → wholesale price amount string */
export type PriceMap = Map<string, string>;
