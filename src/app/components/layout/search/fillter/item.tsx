"use client";
import { usePathname, useSearchParams } from "next/navigation";
import type { ListItem, PathFilterItem } from ".";
import Link from "next/link";
import { createUrl } from "@/app/libraries/utils";
import clsx from "clsx";

function PathFilterItem({ item }: { item: PathFilterItem }) {
  const pathName = usePathname();
  const active = pathName === item.path;
  const DynamicTag = active ? "p" : Link;
  const searchParams = useSearchParams();
  const newParams = new URLSearchParams(searchParams.toString());
  newParams.delete("q");

  return (
    <li className="mt-2 flex text-black dark:text-white" key={item.title}>
      <DynamicTag
        href={createUrl(pathName, newParams)}
        className={clsx(
          "w-full text-sm underline-offset-4 hover:underline dark:hover:text-neutral-100",
          {
            "underline underline-offset-4": active,
          }
        )}
      />
      {item.title}
    </li>
  );
}

export function FilterItem({ item }: { item: ListItem }) {
  return "path" in item ? <PathFilterItem item={item} /> : "SortFilterItem";
}
