"use client";

import React, { useEffect, useState } from "react";
import { MdKeyboardArrowRight } from "react-icons/md";
import { getAllCategory } from "@/services/categories";

type Category = {
  title: string;
  slug: string;
};

type Props = {
  value: string[];
  onChange: (val: string[]) => void;
};

const CategoriesSection: React.FC<Props> = ({ value, onChange }) => {
  const [cats, setCats] = useState<Category[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getAllCategory();
      const mapped = categories.map((cat: any) => ({
        title: cat.name,
        slug: cat.name,
      }));
      setCats(mapped);
    };
    fetchCategories();
  }, []);

  const toggleCategory = (cat: string) => {
    if (value.includes(cat)) {
      onChange(value.filter((c) => c !== cat));
    } else {
      onChange([...value, cat]);
    }
  };

  return (
    <div className="flex flex-col space-y-1 text-black/80">
      {cats.map((cat, idx) => (
        <button
          key={idx}
          type="button"
          onClick={() => toggleCategory(cat.slug)}
          className={`flex items-center justify-between py-2 ${
            value.includes(cat.slug) ? "font-bold text-black" : ""
          }`}
        >
          {cat.title} <MdKeyboardArrowRight />
        </button>
      ))}
    </div>
  );
};

export default CategoriesSection;
