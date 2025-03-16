import { CartItem } from "@/app/libraries/mobileshop/type";
import { UpdateType } from "./cart-context";
import { useActionState } from "react";

export function EditItemQuantityButton({
    item, type, optimisticUpdate
} : {
    item: CartItem;
  type: 'plus' | 'minus';
  optimisticUpdate: UpdateType;
}) {
    const [message, formAction] = useActionState()
}