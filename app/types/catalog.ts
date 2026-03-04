export interface Catalog {
  id: string;
  title: string;
  status: string;
  publication: {
    id: string;
  } | null;
  priceList: {
    id: string;
    currency: string;
    name: string;
  } | null;
  companyLocations?: {
    nodes: Array<{
      id: string;
      name: string;
      company: {
        id: string;
        name: string;
      };
    }>;
  };
}
