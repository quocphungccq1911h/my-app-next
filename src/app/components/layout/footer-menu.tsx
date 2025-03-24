"use client";

import { Menu } from "@/app/libraries/mobileshop/type";
import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function FooterMenuItem({ item }: Readonly<{ item: Menu }>) {
  const pathName = usePathname();
  const [active, setActive] = useState(pathName === item.path);

  useEffect(() => {
    setActive(pathName === item.path);
  }, [pathName, item.path]);

  return (
    <li>
      <Link
        href={item.path}
        className={clsx(
          "block p-2 text-lg underline-offset-4 hover:text-black hover:underline md:inline-block md:text-sm dark:hover:text-neutral-300",
          {
            "text-black dark:text-neutral-300": active,
          }
        )}
      >
        {item.title}
      </Link>
    </li>
  );
}

export default function FooterMenu({ menu }: Readonly<{ menu: Menu[] }>) {
  if (!menu.length) return null;

  return (
    <nav>
      <ul>
        {menu.map((item: Menu) => {
          return <FooterMenuItem item={item} key={item.title} />;
        })}
      </ul>
    </nav>
  );
}
