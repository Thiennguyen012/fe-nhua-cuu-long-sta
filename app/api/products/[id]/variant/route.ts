const getBackendApiUrl = () =>
  (process.env.API_URL ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api").replace(/\/$/, "");

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!/^\d+$/.test(id)) {
    return Response.json({ message: "Mã sản phẩm không hợp lệ." }, { status: 400 });
  }

  const optionIds = new URL(request.url).searchParams
    .getAll("option_ids[]")
    .filter((optionId) => /^\d+$/.test(optionId) && Number(optionId) > 0);

  if (!optionIds.length) {
    return Response.json({ message: "Vui lòng chọn đầy đủ thuộc tính sản phẩm." }, { status: 400 });
  }

  const backendQuery = new URLSearchParams();
  optionIds.forEach((optionId) => backendQuery.append("option_ids[]", optionId));

  try {
    const backendResponse = await fetch(
      `${getBackendApiUrl()}/products/${id}/variant?${backendQuery}`,
      {
        headers: { Accept: "application/json", lang: "vi" },
        cache: "no-store",
      },
    );

    return new Response(await backendResponse.text(), {
      status: backendResponse.status,
      headers: {
        "Content-Type": backendResponse.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (error) {
    console.error("Failed to resolve product variant:", error);
    return Response.json(
      { message: "Không thể kết nối đến hệ thống sản phẩm." },
      { status: 502 },
    );
  }
}
