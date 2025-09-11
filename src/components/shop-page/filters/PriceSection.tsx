"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";

type Props = {
  value: [number, number];
  onChange: (val: [number, number]) => void;
};

const PriceSection: React.FC<Props> = ({ value, onChange }) => {
  return (
    <Accordion type="single" collapsible defaultValue="filter-price">
      <AccordionItem value="filter-price" className="border-none">
        <AccordionTrigger className="text-black font-bold text-xl hover:no-underline p-0 py-0.5">
          Price <div className="text-sm text-black/70 mt-2">
            ₹{value[0]} – ₹{value[1]}
          </div>
        </AccordionTrigger>
        <AccordionContent className="pt-4" contentClassName="overflow-visible">
          <Slider
            value={value}
            onValueChange={(val) => onChange([val[0], val[1]])}
            min={0}
            max={3000}
            step={1}
          />
          
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default PriceSection;
