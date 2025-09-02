import { cn } from "@/lib/utils";
import React from "react";

type DressStyleCardProps = {
  title: string;
  url: string;
  className?: string;
  style?: any
};

const DressStyleCard = ({ title, url, className, style } : DressStyleCardProps) => {
  return (
    <a
      href={url}
      className={cn("p-4 text-white flex items-end", className)}
      style={style}
    >
      <h3 className="text-lg font-semibold">{title}</h3>
    </a>
  );
};

export default DressStyleCard;
