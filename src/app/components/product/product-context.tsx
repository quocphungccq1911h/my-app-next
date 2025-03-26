import { useSearchParams } from "next/navigation";
import { createContext, useMemo, useOptimistic } from "react";

type ProductState = {
  [key: string]: string;
} & {
  image?: string;
};

type ProductContextType = {
  state: ProductState;
  updateOption: (name: string, value: string) => ProductState;
  updateImage: (index: string) => ProductState;
};

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export function ProductProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const searchParams = useSearchParams();

  const getInitialState = () => {
    const params: ProductState = {};
    for (const [key, value] of searchParams.entries()) {
      params[key] = value;
    }
    return params;
  };

  const [state, setOptimisticState] = useOptimistic(
    getInitialState(),
    (prevState: ProductState, upadate: ProductState) => ({
      ...prevState,
      ...upadate,
    })
  );

  const updateOption = (name: string, value: string) => {
    const newState = { [name]: value };
    setOptimisticState(newState);
    return { ...state, ...newState };
  };

  const updateImage = (index: string) => {
    const newState = { image: index };
    setOptimisticState(newState);
    return { ...state, ...newState };
  };

  const value = useMemo(
    () => ({
      state,
      updateOption,
      updateImage,
    }),
    [state]
  );
  return (
    <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
  );
}
