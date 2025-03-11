import { Menu } from "@/app/libraries/mobileshop/type";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function MobileMenu({ menu }: { menu: Menu[] }) {
  const pathName = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const openMobileMenu = () => setIsOpen(true);
  const closeMobileMenu = () => setIsOpen(false);
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isOpen]);

  useEffect(() => {
    setIsOpen(false);
  }, [pathName, searchParams]);

  return (
    <>
        
    </>
  )
}
