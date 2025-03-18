import { SortFilterItem } from "@/app/libraries/constants";
import { Suspense } from "react";
import { FilterItem } from "./item";
import FilterItemDropdown from "./dropdown";

export type ListItem = SortFilterItem | PathFilterItem;
export type PathFilterItem = { title: string; path: string };

function FilterItemList({ list }: Readonly<{ list: ListItem[] }>) {
  return (
    <>
      {list.map((item: ListItem, i) => (
        <FilterItem item={item} key={i.toLocaleString()} />
      ))}
    </>
  );
}

export default function FilterList({
  list,
  title,
}: Readonly<{
  list: ListItem[];
  title?: string;
}>) {
  return (
    <nav>
      {title ? (
        <h3 className="hidden text-xs text-neutral-500 md:block dark:text-neutral-400">
          {title}
        </h3>
      ) : null}
      <ul className="hidden md:block">
        <Suspense fallback={null}>
          <FilterItemList list={list} />
        </Suspense>
      </ul>
      <ul className="md:hidden">
        <Suspense fallback={null}><FilterItemDropdown list={list} /></Suspense>
      </ul>
    </nav>
  );
}
