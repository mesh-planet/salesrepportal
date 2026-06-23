import type { CustomerSearchResult } from "../../types";

// Direct lookup by email via customerByIdentifier. Unlike the customers(query:)
// search index, this is NOT eventually-consistent — it reliably finds a
// customer the instant they exist, including ones created seconds ago. The old
// indexed search missed recently-created customers, so the form reported "new
// email" while customerCreate then rejected it as "already taken".
const CUSTOMER_BY_EMAIL_QUERY = `#graphql
  query CustomerByEmail($identifier: CustomerIdentifierInput!) {
    customerByIdentifier(identifier: $identifier) {
      id
      firstName
      lastName
      email
      phone
      numberOfOrders
    }
  }
`;

interface CustomerByEmailResponse {
  data?: {
    customerByIdentifier: CustomerSearchResult | null;
  };
  errors?: Array<{ message: string }>;
}

export async function searchCustomerByEmail(
  admin: { graphql: Function },
  email: string,
): Promise<CustomerSearchResult | null> {
  const response = await admin.graphql(CUSTOMER_BY_EMAIL_QUERY, {
    variables: { identifier: { emailAddress: email } },
  });
  const json: CustomerByEmailResponse = await response.json();

  if (json.errors?.length) {
    console.error("[Customers] Lookup error:", json.errors);
    throw new Error(`Customer lookup failed: ${json.errors[0].message}`);
  }

  return json.data?.customerByIdentifier ?? null;
}

const CUSTOMER_CREATE_MUTATION = `#graphql
  mutation CustomerCreate($input: CustomerInput!) {
    customerCreate(input: $input) {
      customer {
        id
        firstName
        lastName
        email
        phone
      }
      userErrors {
        field
        message
      }
    }
  }
`;

interface CustomerCreateResponse {
  data?: {
    customerCreate: {
      customer: {
        id: string;
        firstName: string | null;
        lastName: string | null;
        email: string | null;
        phone: string | null;
      } | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  };
  errors?: Array<{ message: string }>;
}

interface CustomerCreateInput {
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export async function createCustomer(
  admin: { graphql: Function },
  input: CustomerCreateInput,
): Promise<{ customerId: string | null; errors: string[] }> {
  const response = await admin.graphql(CUSTOMER_CREATE_MUTATION, {
    variables: { input },
  });
  const json: CustomerCreateResponse = await response.json();

  if (json.errors?.length) {
    console.error("[Customers] Create error:", json.errors);
    return { customerId: null, errors: json.errors.map((e) => e.message) };
  }

  const result = json.data?.customerCreate;
  if (result?.userErrors?.length) {
    // If the email is already in use, the customer already exists — look them
    // up directly and reuse them instead of hard-failing. Guards against a
    // prior partial attempt (or search-index lag) leaving the customer created.
    const emailTaken = result.userErrors.some((e) =>
      /taken|already|in use|exists/i.test(e.message),
    );
    if (emailTaken) {
      const existing = await searchCustomerByEmail(admin, input.email);
      if (existing?.id) {
        return { customerId: existing.id, errors: [] };
      }
    }
    return {
      customerId: null,
      errors: result.userErrors.map((e) => e.message),
    };
  }

  return {
    customerId: result?.customer?.id ?? null,
    errors: [],
  };
}
