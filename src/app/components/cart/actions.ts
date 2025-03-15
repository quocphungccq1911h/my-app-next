"use server";
import { createCart } from "@/app/libraries/mobileshop";
import { cookies } from "next/headers";

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}
