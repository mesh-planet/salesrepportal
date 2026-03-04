export interface Company {
  id: string;
  name: string;
}

export interface Address {
  address1: string | null;
  city: string | null;
  province: string | null;
  country: string | null;
  zip: string | null;
}

export interface CatalogSummary {
  id: string;
  title: string;
  status: string;
  publication: {
    id: string;
  } | null;
  priceList: {
    id: string;
    currency: string;
  } | null;
}

export interface CompanyLocation {
  id: string;
  name: string;
  company: Company;
  billingAddress: Address | null;
  shippingAddress: Address | null;
  catalogs?: {
    nodes: CatalogSummary[];
  };
}

export interface CompanyContact {
  id: string;
  customer: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  isMainContact: boolean;
}
