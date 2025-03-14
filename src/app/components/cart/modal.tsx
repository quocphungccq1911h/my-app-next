import { useEffect, useRef, useState } from "react";
import { useCart } from "./cart-context";

export default function CartModal() {
  const [cart, updateCartItem] = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);

  useEffect(() => {
    if (!cart) {
    }
  });

  return (
    <>
      <div></div>
    </>
  );
}
