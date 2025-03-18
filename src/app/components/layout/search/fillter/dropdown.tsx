'use client'

import { usePathname, useSearchParams } from "next/navigation";
import type { ListItem } from ".";
import { useEffect, useRef, useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { FilterItem } from "./item";

export default function FilterItemDropdown({ list }: Readonly<{ list: ListItem[] }>) {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState("");
  const [openSelect, setOpenSelect] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpenSelect(false);
      }
    };
    window.addEventListener("click", handleClickOutside);
    return () => window.removeEventListener("click", handleClickOutside);
  }, []);

  useEffect(() => {
    list.forEach((listItem: ListItem) => {
      if (
        ("path" in listItem && pathName === listItem.path) ||
        ("slug" in listItem && searchParams.get("sort") === listItem.slug)
      )
        setActive(listItem.title);
    });
  }, [pathName, list, searchParams]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpenSelect(!openSelect)}
        className="flex w-full items-center justify-between rounded-sm border border-black/30 px-4 py-2 text-sm dark:border-white/30"
      >
        <div>{active}</div>
        <ChevronDownIcon className="h-4" />
      </button>
      {openSelect && (
        <button
          className="absolute z-40 w-full rounded-b-md bg-white p-4 shadow-md dark:bg-black"
          onClick={() => setOpenSelect(false)}
        >
          {list.map((item: ListItem) => (
            <FilterItem item={item} key={item.title} />
          ))}
        </button>
      )}
    </div>
  );
}
