import type { StaffMember } from "../../types";

export const CURRENT_STAFF_MEMBER_QUERY = `#graphql
  query CurrentStaffMember {
    currentStaffMember {
      id
      firstName
      lastName
      email
      active
      avatar {
        url
      }
      locale
    }
  }
`;

interface CurrentStaffMemberResponse {
  data?: {
    currentStaffMember: StaffMember | null;
  };
  errors?: Array<{ message: string }>;
}

export async function fetchCurrentStaffMember(
  admin: { graphql: Function }
): Promise<StaffMember> {
  const response = await admin.graphql(CURRENT_STAFF_MEMBER_QUERY);
  const json: CurrentStaffMemberResponse = await response.json();

  if (json.errors?.length) {
    throw new Error(
      `Failed to fetch current staff member: ${json.errors.map((e) => e.message).join(", ")}`
    );
  }

  if (!json.data?.currentStaffMember) {
    throw new Error("No current staff member found");
  }

  return json.data.currentStaffMember;
}
