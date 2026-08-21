export interface CustomerContactPayload {
  full_name: string;
  phone: string;
  email: string;
  category_id: number;
  consultation_content: string;
}

const getErrorMessage = (payload: unknown, fallback: string) => {
  if (!payload || typeof payload !== "object") return fallback;

  const response = payload as { message?: unknown; errors?: unknown };
  if (response.errors && typeof response.errors === "object") {
    const validationMessages = Object.values(response.errors as Record<string, unknown>)
      .flatMap((value) => Array.isArray(value) ? value : [value])
      .filter((value): value is string => typeof value === "string");
    if (validationMessages.length) return validationMessages.join(" ");
  }

  return typeof response.message === "string" ? response.message : fallback;
};

export async function createCustomerContact(payload: CustomerContactPayload) {
  const response = await fetch("/api/customer-contacts", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const responsePayload: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(getErrorMessage(responsePayload, `Không thể gửi yêu cầu tư vấn (${response.status})`));
  }

  return responsePayload;
}
