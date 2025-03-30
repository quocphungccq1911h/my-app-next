import { ProductProvider } from "@/app/components/product/product-context";
import { getProduct } from "@/app/libraries/mobileshop";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export default async function ProductPage(
  props: Readonly<{
    params: Promise<{ handle: string }>;
  }>
) {
  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage.url,
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
    priceCurrency: product.priceRange.minVariantPrice.currencyCode,
    highPrice: product.priceRange.maxVariantPrice.amount,
    lowPrice: product.priceRange.minVariantPrice.amount,
  };

  return (
    <ProductProvider>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />
      <div className="mx-auto max-w-(--breakpoint-2xl) px-4">
        <div className="flex flex-col rounded-lg border border-neutral-200 bg-white p-8 md:p-12 lg:flex-row lg:gap-8 dark:border-neutral-800 dark:bg-black">
          <div className="h-full w-full basis-full lg:basis-4/6">
            <Suspense
              fallback={
                <div className="relative aspect-square h-full max-h-[550px] w-full overflow-hidden" />
              }
            >
              Gallery
            </Suspense>
          </div>
        </div>
      </div>
    </ProductProvider>
  );
}
