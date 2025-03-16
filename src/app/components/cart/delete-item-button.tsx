import { CartItem } from "@/app/libraries/mobileshop/type";
import { useActionState } from "react";
import { removeItem } from "./actions";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { UpdateType } from "./cart-context";

export function DeleteItemButton({
  item,
  optimisticUpdate,
}: Readonly<{
  item: CartItem;
  optimisticUpdate: (key: string, action: UpdateType) => void;
}>) {
  const [message, formAction] = useActionState(removeItem, null);
  const merchandiseId = item.merchandise.id;
  const removeItemAction = formAction.bind(null, merchandiseId);

  return (
    <form
      action={async () => {
        optimisticUpdate("merchandiseId", "delete");
        removeItemAction();
      }}
    >
      <button
        type="submit"
        aria-label="Remove cart item"
        className="flex h-[24px] w-[24px] items-center justify-center rounded-full bg-neutral-500"
      >
        <XMarkIcon className="mx-[1px] h-4 w-4 text-white dark:text-black" />
      </button>
      <output aria-live="polite" className="sr-only">
        {message}
      </output>
    </form>
  );
}
