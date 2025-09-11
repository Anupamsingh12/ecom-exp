"use client";

import React, { useState } from "react";
import CategoriesSection from "@/components/shop-page/filters/CategoriesSection";
import ColorsSection from "@/components/shop-page/filters/ColorsSection";
import DressStyleSection from "@/components/shop-page/filters/DressStyleSection";
import PriceSection from "@/components/shop-page/filters/PriceSection";
import SizeSection from "@/components/shop-page/filters/SizeSection";
import { Button } from "@/components/ui/button";

const Filters = () => {
  const [filters, setFilters] = useState({
    categories: [],
    colors: "",
    dressStyle: '',
    price: [200, 1500] as [number, number],
    sizes: '',
  });

  const updateFilter = (key: string, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const applyFilters = () => {
    console.log("Full filter object:", filters);
    // 👉 you now have everything here to send to API or handle locally
  };

  return (
    <>
      <hr className="border-t-black/10" />
      <CategoriesSection
        value={filters.categories}
        onChange={(val) => updateFilter("categories", val)}
      />
      <hr className="border-t-black/10" />
      <PriceSection
        value={filters.price}
        onChange={(val) => updateFilter("price", val)}
      />
      <hr className="border-t-black/10" />
      <ColorsSection
        value={filters.colors}
        onChange={(val) => updateFilter("colors", val)}
      />
      <hr className="border-t-black/10" />
      <SizeSection
        value={filters.sizes}
        onChange={(val) => updateFilter("sizes", val)}
      />
      <hr className="border-t-black/10" />
      <DressStyleSection
        value={filters.dressStyle}
        onChange={(val) => updateFilter("dressStyle", val)}
      />
      <Button
        type="button"
        className="bg-black w-full rounded-full text-sm font-medium py-4 h-12"
        onClick={applyFilters}
      >
        Apply Filter
      </Button>
    </>
  );
};

export default Filters;
