'use client'

import { useEffect, useRef, useState } from "react";
import { useCart } from "./cart-context";
import { createCartAndSetCookie } from "./actions";
import OpenCart from "./open-cart";

export default function CartModal() {
  const {cart, updateCartItem} = useCart();
  const [isOpen, setIsOpen] = useState(false);
  const quantityRef = useRef(cart?.totalQuantity);
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  useEffect(() => {
    if (!cart) {
      createCartAndSetCookie();
    }
  }, [cart]);

  useEffect(() => {
    if(cart?.totalQuantity && cart.totalQuantity !== quantityRef.current && cart.totalQuantity > 0) {
      if(!isOpen) setIsOpen(true);
      quantityRef.current = cart.totalQuantity;
    }
  }, [isOpen, cart?.totalQuantity, quantityRef])

  return (
    <>
      <button aria-label="open-cart" onClick={openCart}>
        <OpenCart quantity={cart?.totalQuantity}/>
      </button>
    </>
  );
}
