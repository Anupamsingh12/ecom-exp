// src/app/product/[...slug]/page.tsx

import ProductListNew from "@/components/common/ProductListNew";
import BreadcrumbProduct from "@/components/product-page/BreadcrumbProduct";
import Header from "@/components/product-page/Header";
import Tabs from "@/components/product-page/Tabs";
import { getProductById, getAllProducts } from "@/services/products";
import { Products, SingleProductDetails } from "@/types/product.types";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: { slug: string[] };
}) {
  const productId = params?.slug?.[0];

  if (!productId) {
    notFound();
  }

  let productData: SingleProductDetails | null = null;
  let relatedProducts: Products[] = [];

  try {
    productData = await getProductById(productId);
    const dd = await getAllProducts();
    relatedProducts = dd.rows;
  } catch (error) {
    console.error("Error fetching product or related products:", error);
  }

  if (!productData?.id) {
    notFound();
  }

  return (
    <main>
      <div className="max-w-frame mx-auto px-4 xl:px-0">
        <hr className="h-[1px] border-t-black/10 mb-5 sm:mb-6" />
        <BreadcrumbProduct title={productData?.name ?? "Product"} />
        <section className="mb-11">
          <Header product={productData} />
        </section>
        <Tabs />
      </div>

      <div className="mb-[50px] sm:mb-20">
        <ProductListNew
          title="You might also like"
          data={relatedProducts ? relatedProducts : []}
        />
      </div>
    </main>
  );
}
