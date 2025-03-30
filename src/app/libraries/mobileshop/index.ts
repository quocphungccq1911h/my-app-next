import { cookies } from "next/headers";
import {
  HIDDEN_PRODUCT_TAG,
  MOBILESHOP_GRAPHQL_API_ENDPOINT,
  TAGS,
} from "../constants";
import { handleFetchError } from "../type-guards";
import { ensureStartsWith } from "../utils";
import {
  Cart,
  Collection,
  Connection,
  Image,
  Menu,
  MobileCartOperation,
  MobileShopAddToCartOperation,
  MobileShopCart,
  MobileShopCollection,
  MobileShopCollectionProductsOperation,
  MobileShopCollectionsOperation,
  MobileShopCreateCartOperation,
  MobileShopMenuOperation,
  MobileShopProduct,
  MobileShopProductOperation,
  MobileShopProductsOperation,
  MobileShopRemoveFromCartOperation,
  MobileShopUpdateCartOperation,
  Product,
} from "./type";
import { getCartQuery } from "./queries/cart";
import {
  unstable_cacheTag as cacheTag,
  unstable_cacheLife as cacheLife,
} from "next/cache";
import { getMenuQuery } from "./queries/menu";
import {
  addToCartMutation,
  createCartMutation,
  editCartItemsMutation,
  removeFromCartMutation,
} from "./mutations/cart";
import {
  getCollectionProductsQuery,
  getCollectionsQuery,
} from "./queries/collection";
import { getProductQuery, getProductsQuery } from "./queries/product";

const domain = process.env.MOBILESHOP_STORE_DOMAIN
  ? ensureStartsWith(process.env.MOBILESHOP_STORE_DOMAIN, "https://")
  : "";
const endpoint = `${domain}${MOBILESHOP_GRAPHQL_API_ENDPOINT}`;
const key = process.env.MOBILESHOP_STOREFRONT_ACCESS_TOKEN!;

type ExtractVariables<T> = T extends { variables: object }
  ? T["variables"]
  : never;

const removeEdgesAndNodes = <T>(array: Connection<T>): T[] => {
  return array.edges.map((edge) => edge.node);
};

const reshapeCart = (cart: MobileShopCart): Cart => {
  if (!cart.cost?.totalAmount) {
    cart.cost.totalAmount = {
      amount: "0.0",
      currencyCode: cart.cost.totalAmount.currencyCode,
    };
  }
  return {
    ...cart,
    lines: removeEdgesAndNodes(cart.lines),
  };
};

export async function mobileShopFetch<T>({
  headers,
  query,
  variables,
}: {
  headers?: HeadersInit;
  query: string;
  variables?: ExtractVariables<T>;
}): Promise<{ status: number; body: T }> {
  try {
    const result = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": key,
        ...headers,
      },
      body: JSON.stringify({
        ...(query && { query }),
        ...(variables && { variables }),
      }),
    });

    const body = await result.json();

    if (body.errors) {
      throw body.errors[0];
    }

    return {
      status: result.status,
      body,
    };
  } catch (e) {
    handleFetchError(e, query);
  }
}

export async function getCart(): Promise<Cart | undefined> {
  const cartId = (await cookies()).get("cartId")?.value;

  if (!cartId) return undefined;

  const res = await mobileShopFetch<MobileCartOperation>({
    query: getCartQuery,
    variables: { cartId },
  });
  // Old carts becomes `null` when you checkout.
  if (!res.body.data.cart) {
    return undefined;
  }
  return reshapeCart(res.body.data.cart);
}

export async function createCart(): Promise<Cart> {
  const res = await mobileShopFetch<MobileShopCreateCartOperation>({
    query: createCartMutation,
  });
  return reshapeCart(res.body.data.cartCreate.cart);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value ?? "";
  const res = await mobileShopFetch<MobileShopRemoveFromCartOperation>({
    query: removeFromCartMutation,
    variables: {
      cartId,
      lineIds,
    },
  });
  return reshapeCart(res.body.data.cartLinesRemove.cart);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value ?? "";
  const res = await mobileShopFetch<MobileShopUpdateCartOperation>({
    query: editCartItemsMutation,
    variables: {
      cartId,
      lines,
    },
  });
  return reshapeCart(res.body.data.cartLinesUpdate.cart);
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[]
): Promise<Cart> {
  const cartId = (await cookies()).get("cartId")?.value ?? "";
  const res = await mobileShopFetch<MobileShopAddToCartOperation>({
    query: addToCartMutation,
    variables: {
      cartId: cartId,
      lines: lines,
    },
  });
  return reshapeCart(res.body.data.cartLinesAdd.cart);
}

export async function getMenu(handle: string): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const res = await mobileShopFetch<MobileShopMenuOperation>({
    query: getMenuQuery,
    variables: {
      handle,
    },
  });

  return (
    res.body?.data?.menu?.items.map((item: { title: string; url: string }) => ({
      title: item.title,
      path: item.url
        .replace(domain, "")
        .replace("/collections", "/search")
        .replace("/pages", ""),
    })) || []
  );
}

const reshapeCollection = (
  collection: MobileShopCollection
): Collection | undefined => {
  if (!collection) {
    return undefined;
  }
  return {
    ...collection,
    path: `/search/${collection.handle}`,
  };
};

const reshapeCollections = (collections: MobileShopCollection[]) => {
  const reshapedCollections = [];
  for (const collection of collections) {
    if (collection) {
      const reshapedCollection = reshapeCollection(collection);
      if (reshapedCollection) {
        reshapedCollections.push(reshapedCollection);
      }
    }
  }
  return reshapedCollections;
};

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const res = await mobileShopFetch<MobileShopCollectionsOperation>({
    query: getCollectionsQuery,
  });

  const mobileShopCollections = removeEdgesAndNodes(res.body.data.collections);
  const collections = [
    {
      handle: "",
      title: "All",
      description: "All products",
      seo: {
        title: "All",
        description: "All products",
      },
      path: "/search",
      updatedAt: new Date().toISOString(),
    },
    // Filter out the `hidden` collections.
    // Collections that start with `hidden-*` need to be hidden on the search page.
    ...reshapeCollections(mobileShopCollections).filter(
      (collection) => !collection.handle.startsWith("hidden")
    ),
  ];
  return collections;
}

//#region Images
const reshapeImages = (images: Connection<Image>, productTitle: string) => {
  const flattened = removeEdgesAndNodes(images);
  return flattened.map((image) => {
    const regex = /.*\/(.*)\..*/;
    const match = regex.exec(image.url);
    const filename = match ? match[1] : null;
    return {
      ...image,
      altText: image.altText || `${productTitle} - ${filename}`,
    };
  });
};
//#endregion

//#region Product
const reshapeProduct = (
  product: MobileShopProduct,
  filterHiddenProducts: boolean = true
) => {
  if (
    !product ||
    (filterHiddenProducts && product.tags.includes(HIDDEN_PRODUCT_TAG))
  ) {
    return undefined;
  }
  const { images, variants, ...rest } = product;

  return {
    ...rest,
    variants: removeEdgesAndNodes(variants),
    images: reshapeImages(images, product.title),
  };
};

const reshapeProducts = (products: MobileShopProduct[]) => {
  const reshapedProducts = [];

  for (const product of products) {
    if (product) {
      const reshapedProduct = reshapeProduct(product);
      if (reshapedProduct) reshapedProducts.push(reshapedProduct);
    }
  }
  return reshapedProducts;
};

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const res = await mobileShopFetch<MobileShopProductsOperation>({
    query: getProductsQuery,
    variables: {
      query,
      reverse,
      sortKey,
    },
  });
  return reshapeProducts(removeEdgesAndNodes(res.body.data.products));
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  const res = await mobileShopFetch<MobileShopProductOperation>({
    query: getProductQuery,
    variables: {
      handle,
    },
  });

  return reshapeProduct(res.body.data.product);
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  const res = await mobileShopFetch<MobileShopCollectionProductsOperation>({
    query: getCollectionProductsQuery,
    variables: {
      handle: collection,
      reverse: reverse,
      sortKey: sortKey === "CREATED_AT" ? "CREATED" : sortKey,
    },
  });

  if (!res.body.data.collection) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }
  return reshapeProducts(
    removeEdgesAndNodes(res.body.data.collection.products)
  );
}
//#endregion
