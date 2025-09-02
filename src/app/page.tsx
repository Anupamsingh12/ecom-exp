// src/app/page.tsx

import ProductListNew from "@/components/common/ProductListNew";
import Brands from "@/components/homepage/Brands";
import DressStyle from "@/components/homepage/DressStyle";
import Header from "@/components/homepage/Header";
import Reviews from "@/components/homepage/Reviews";
import { getAllProducts } from "@/services/products";
import { Toaster } from 'react-hot-toast';
export default async function Home() {
  let allProducts: any  = [];

  try {
    const res = await getAllProducts()
    allProducts = res.rows;
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }


  return (
    <>
      <Header />
      <Brands />
      <main className="my-[50px] sm:my-[72px]">
        <ProductListNew
          title="NEW ARRIVALS"
          data={allProducts}
          viewAllLink="/shop#new-arrivals"
        />
        <div className="max-w-frame mx-auto px-4 xl:px-0">
          <hr className="h-[1px] border-t-black/10 my-10 sm:my-16" />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <ProductListNew
            title="TOP SELLING"
            data={allProducts}
            viewAllLink="/shop#top-selling"
          />
        </div>
        <div className="mb-[50px] sm:mb-20">
          <DressStyle />
        </div>
        {/* <Reviews data={reviewsData} /> */}
      </main>
    </>
  );
}
