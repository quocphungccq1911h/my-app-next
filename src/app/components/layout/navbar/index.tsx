import { Suspense } from "react";
import MobileMenu from "./mobile-menu";

export async function Navbar() {
    return (
        <nav className="relative flex items-center justify-between p-4 lg:px-6">
            <div className="block flex-none md:hidden">
                <Suspense fallback={null}>
                    <MobileMenu />
                </Suspense>
            </div>
        </nav>
    )
}