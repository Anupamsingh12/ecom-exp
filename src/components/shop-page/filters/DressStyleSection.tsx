"use client";

import React, { useEffect, useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MdKeyboardArrowRight } from "react-icons/md";
import { getAllClothingTypes } from "@/services/clothing-types";
import { cn } from "@/lib/utils";

type DressStyle = {
  title: string;
  slug: string;
};

type Props = {
  value: string;
  onChange: (val: string) => void;
};

const DressStyleSection: React.FC<Props> = ({ value, onChange }) => {
  const [dressStyles, setDressStyles] = useState<DressStyle[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const data: any = await getAllClothingTypes();
      const mapped = data.map((item: any) => ({
        title: item.name,
        slug: `/shop?style=${item.name}`,
      }));
      setDressStyles(mapped);
    };
    fetchData();
  }, []);

  return (
    <Accordion type="single" collapsible defaultValue="filter-style">
      <AccordionItem value="filter-style" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Dress Style
        </AccordionTrigger>
        <AccordionContent className="pt-4 pb-0">
          <div className="flex flex-col text-black/60 space-y-0.5">
            {dressStyles.map((dStyle, idx) => (
              <button
                key={idx}
                type="button"
                className={cn([
                  "flex items-center justify-between py-2 w-full text-left",
                  value === dStyle.title && "font-medium text-black",
                ])}
                onClick={() => onChange(dStyle.title)}
              >
                {dStyle.title} <MdKeyboardArrowRight />
              </button>
            ))}
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default DressStyleSection;
