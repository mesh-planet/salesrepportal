export interface MoneyBag {
  shopMoney: {
    amount: string;
    currencyCode: string;
  };
  presentmentMoney?: {
    amount: string;
    currencyCode: string;
  };
}

export interface DraftOrderLineItem {
  id: string;
  title: string;
  quantity: number;
  originalUnitPriceSet: {
    shopMoney: {
      amount: string;
    };
  };
}

export interface PurchasingCompanyInfo {
  company: {
    id: string;
    name: string;
  };
  location: {
    id: string;
    name: string;
  };
}

export interface DraftOrder {
  id: string;
  name: string;
  status: string;
  email: string | null;
  createdAt: string;
  updatedAt: string;
  invoiceUrl: string | null;
  totalPriceSet: MoneyBag;
  customer: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  } | null;
  purchasingEntity: PurchasingCompanyInfo | null;
  lineItems: {
    nodes: DraftOrderLineItem[];
  };
}

export interface Order {
  id: string;
  name: string;
  createdAt: string;
  displayFinancialStatus: string | null;
  displayFulfillmentStatus: string | null;
  totalPriceSet: MoneyBag;
}
