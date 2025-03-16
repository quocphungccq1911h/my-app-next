import { CartItem } from "@/app/libraries/mobileshop/type";
import { useActionState } from "react";

export function DeleteItemButton({item, optimisticUpdate} : Readonly<{item: CartItem,optimisticUpdate: any}>) {
    const [message, formAction] = useActionState(removeItem);
}