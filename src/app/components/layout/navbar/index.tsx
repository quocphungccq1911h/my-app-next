import { Suspense } from "react";
import MobileMenu from "./mobile-menu";
import { getMenu } from "@/app/libraries/mobileshop";

export async function Navbar() {
  const menu = await getMenu("next-js-frontend-header-menu");
  return (
    <nav className="relative flex items-center justify-between p-4 lg:px-6">
      <div className="block flex-none md:hidden">
        <Suspense fallback={null}>
          <MobileMenu menu={menu} />
        </Suspense>
      </div>
    </nav>
  );
}
