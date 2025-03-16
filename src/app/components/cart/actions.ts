"use server";
import { TAGS } from "@/app/libraries/constants";
import {
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "@/app/libraries/mobileshop";
import { revalidateTag } from "next/cache";
import { cookies } from "next/headers";

export async function createCartAndSetCookie() {
  const cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}

export async function removeItem(prevState: unknown, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) return "Error fetching cart";

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );
    if (lineItem?.id) {
      await removeFromCart([lineItem.id]);
      revalidateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: unknown,
  payload: {
    merchandiseId: string;
    quantity: number;
  }
) {
  const { merchandiseId, quantity } = payload;
  try {
    const cart = await getCart();

    if (!cart) return "Error fetching cart";

    const lineItem = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId
    );

    if (lineItem?.id) {
      if (quantity === 0) {
        removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if(quantity > 0) {
        // If the item doesn't exist in the cart and quantity > 0, add it
        await addToCart();
    }
  } catch {}
}
