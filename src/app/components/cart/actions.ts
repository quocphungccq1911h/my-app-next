"use server";
import { createCart } from "@/app/libraries/mobileshop";
import { cookies } from "next/headers";

export async function createCartAndSetCookie() {
  const cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}
