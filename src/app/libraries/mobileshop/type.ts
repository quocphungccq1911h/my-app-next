export type Connection<T> = {
  edges: Array<Edge<T>>;
};

export type Edge<T> = {
  node: T;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type CartProduct = {
  id: string;
  handle: string;
  title: string;
  featuredImage: Image;
};

export type CartItem = {
  id: string | undefined;
  quantity: number;
  cost: {
    totalAmount: Money;
  };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: {
      name: string;
      value: string;
    }[];
    product: CartProduct;
  };
};

/**
 * MobileShopCart là khuôn mẫu dữ liệu giỏ hàng của MobileShop
 * Sử dụng cho công việc call API with GraphQL
 */
export type MobileShopCart = {
  id: string | undefined;
  checkoutUrl: string;
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
  lines: Connection<CartItem>;
  totalQuantity: number;
};

/**
 * Cart dùng cho mặt hiển thị giao diện
 * Thay vì sử dụng Connection<CartItem> thì sử dụng Array<CartItem> để đơn giản hơn về mặt cấu trúc dữ liệu
 */
export type Cart = Omit<MobileShopCart, "lines"> & {
  lines: CartItem[];
};

export type MobileCartOperation = {
  data: {
    cart: MobileShopCart;
  };
  variables: {
    cartId: string;
  };
};
