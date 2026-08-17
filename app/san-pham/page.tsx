import type { Metadata } from "next";
import { Navbar } from "../components/Navbar";
import { ProductCatalog } from "../components/ProductCatalog";

export const metadata: Metadata = {
  title: "Sản phẩm | Nhựa Cửu Long",
  description: "Danh mục túi nhựa, ống nhựa, tấm nhựa, thùng nhựa, bao bì và màng nhựa.",
};

export default function ProductsPage() {
  return <><Navbar/><ProductCatalog/></>;
}
