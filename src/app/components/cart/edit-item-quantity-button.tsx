import { CartItem } from "@/app/libraries/mobileshop/type";
import { UpdateType } from "./cart-context";
import { useActionState } from "react";
import { updateItemQuantity } from "./actions";
import clsx from "clsx";
import { MinusIcon, PlusIcon } from "@heroicons/react/24/outline";

function SubmitButton({
  type,
}: Readonly<{ type: Exclude<UpdateType, "delete"> }>) {
  return (
    <button
      type="submit"
      aria-label={
        type === "plus" ? "Increase item quantity" : "Reduce item quantity"
      }
      className={clsx(
        "ease flex h-full min-w-[36px] max-w-[36px] flex-none items-center justify-center rounded-full p-2 transition-all duration-200 hover:border-neutral-800 hover:opacity-80",
        {
          "ml-auto": type === "minus",
        }
      )}
    >
      {type === "plus" ? (
        <PlusIcon className="h-4 w-4 dark:text-neutral-500" />
      ) : (
        <MinusIcon className="h-4 w-4 dark:text-neutral-500" />
      )}
    </button>
  );
}

export function EditItemQuantityButton({
  item,
  type,
  optimisticUpdate,
}: Readonly<{
  item: CartItem;
  type: "plus" | "minus";
  optimisticUpdate: (key: string, action: UpdateType) => void;
}>) {
  const [message, formAction] = useActionState(updateItemQuantity, null);
  const payload = {
    merchandiseId: item.merchandise.id,
    quantity: type === "plus" ? item.quantity + 1 : item.quantity - 1,
  };

  const updateItemQuantityAction = formAction.bind(null, payload);

  return (
    <form
      action={async () => {
        optimisticUpdate(payload.merchandiseId, type);
        updateItemQuantityAction();
      }}
    >
      <SubmitButton type={type} />
      <output aria-live="polite" className="sr-only">
        {message}
      </output>
    </form>
  );
}
