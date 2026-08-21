const getBackendApiUrl = () =>
  (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api").replace(/\/$/, "");

const getBackendOrigin = () => new URL(getBackendApiUrl()).origin;

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const csrfResponse = await fetch(`${getBackendOrigin()}/sanctum/csrf-cookie`, {
      headers: { Accept: "application/json" },
      cache: "no-store",
    });

    if (!csrfResponse.ok) {
      return Response.json(
        { message: `Không thể khởi tạo phiên gửi yêu cầu (${csrfResponse.status})` },
        { status: 502 },
      );
    }

    const cookies = csrfResponse.headers.getSetCookie();
    const cookieHeader = cookies.map((cookie) => cookie.split(";", 1)[0]).join("; ");
    const xsrfCookie = cookieHeader
      .split("; ")
      .find((cookie) => cookie.startsWith("XSRF-TOKEN="));
    const xsrfToken = xsrfCookie
      ? decodeURIComponent(xsrfCookie.slice("XSRF-TOKEN=".length))
      : "";

    if (!xsrfToken || !cookieHeader) {
      return Response.json(
        { message: "Backend không trả về CSRF token hợp lệ." },
        { status: 502 },
      );
    }

    const backendResponse = await fetch(`${getBackendApiUrl()}/customer-contacts`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Cookie: cookieHeader,
        "X-XSRF-TOKEN": xsrfToken,
        lang: "vi",
      },
      body,
      cache: "no-store",
    });

    return new Response(await backendResponse.text(), {
      status: backendResponse.status,
      headers: {
        "Content-Type": backendResponse.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to submit customer contact:", error);
    return Response.json(
      { message: "Không thể kết nối đến hệ thống tiếp nhận yêu cầu." },
      { status: 502 },
    );
  }
}
