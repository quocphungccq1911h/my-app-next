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

export type MobileShopCreateCartOperation = {
  data: { cartCreate: { cart: MobileShopCart } };
};

export type MobileShopAddToCartOperation = {
  data: {
    cartLinesAdd: {
      cart: MobileShopCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type Menu = {
  title: string;
  path: string;
};

export type MobileShopMenuOperation = {
  data: {
    menu?: {
      items: {
        title: string;
        url: string;
      }[];
    };
  };
  variables: {
    handle: string;
  };
};

export type MobileShopRemoveFromCartOperation = {
  data: {
    cartLinesRemove: {
      cart: MobileShopCart;
    };
  };
  variables: {
    cartId: string;
    lineIds: string[];
  };
};

export type MobileShopUpdateCartOperation = {
  data: {
    cartLinesUpdate: {
      cart: MobileShopCart;
    };
  };
  variables: {
    cartId: string;
    lines: {
      id: string;
      merchandiseId: string;
      quantity: number;
    }[];
  };
};

export type SEO = {
  title: string;
  description: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type MobileShopProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: {
    maxVariantPrice: Money;
    minVariantPrice: Money;
  };
  variants: Connection<ProductVariant>;
  featuredImage: Image;
  images: Connection<Image>;
  seo: SEO;
  tags: string[];
  updatedAt: string;
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  price: Money;
};

export type Product = Omit<MobileShopProduct, "variants" | "images"> & {
  variants: ProductVariant[];
  images: Image[];
};

export type MobileShopCollectionsOperation = {
  data: {
    collections: Connection<MobileShopCollection>;
  };
};

export type MobileShopCollection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
};

export type Collection = MobileShopCollection & {
  path: string;
};

export type MobileShopProductsOperation = {
  data: {
    products: Connection<MobileShopProduct>;
  };
  variables: {
    query?: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type MobileShopCollectionProductsOperation = {
  data: {
    collection: {
      products: Connection<MobileShopProduct>;
    };
  };
  variables: {
    handle: string;
    reverse?: boolean;
    sortKey?: string;
  };
};

export type MobileShopProductOperation = {
  data: { product: MobileShopProduct };
  variables: {
    handle: string;
  };
};
