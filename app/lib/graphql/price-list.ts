import type { PriceListPrice, PriceMap, PageInfo } from "../../types";
import { getCached, setCached } from "../cache.server";

export const PRICE_LIST_PRICES_QUERY = `#graphql
  query PriceListPrices($priceListId: ID!, $first: Int!, $after: String) {
    priceList(id: $priceListId) {
      id
      name
      currency
      prices(first: $first, after: $after) {
        nodes {
          variant {
            id
          }
          price {
            amount
            currencyCode
          }
          compareAtPrice {
            amount
            currencyCode
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

interface PriceListPricesResponse {
  data?: {
    priceList: {
      id: string;
      name: string;
      currency: string;
      prices: {
        nodes: PriceListPrice[];
        pageInfo: PageInfo;
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
}

export async function fetchPriceListPrices(
  admin: { graphql: Function },
  priceListId: string
): Promise<PriceMap> {
  const cacheKey = `pricelist:${priceListId}:prices`;
  const cached = getCached<PriceMap>(cacheKey);
  if (cached) return cached;

  const priceMap: PriceMap = new Map();
  let cursor: string | null = null;
  let hasNextPage = true;

  while (hasNextPage) {
    const response = await admin.graphql(PRICE_LIST_PRICES_QUERY, {
      variables: {
        priceListId,
        first: 250,
        after: cursor,
      },
    });

    const json: PriceListPricesResponse = await response.json();

    if (json.errors?.length) {
      throw new Error(
        `Failed to fetch price list: ${json.errors.map((e) => e.message).join(", ")}`
      );
    }

    if (!json.data?.priceList?.prices) {
      break;
    }

    for (const priceEntry of json.data.priceList.prices.nodes) {
      priceMap.set(priceEntry.variant.id, priceEntry.price.amount);
    }

    hasNextPage = json.data.priceList.prices.pageInfo.hasNextPage;
    cursor = json.data.priceList.prices.pageInfo.endCursor;
  }

  setCached(cacheKey, priceMap, "PRICE_LIST");
  return priceMap;
}
