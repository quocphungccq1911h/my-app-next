"use server";
import { createCart, getCart } from "@/app/libraries/mobileshop";
import { cookies } from "next/headers";

export async function createCartAndSetCookie() {
  const cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) return "Error fetching cart";

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );
    if(lineItem && lineItem.id) {
      await removeF
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}
