import {
  getProductImageFallback,
  hasApprovedProductImage,
  type ShoppingProduct,
} from "@/lib/shopping";

export function ShoppingProductImage({
  product,
  size = "card",
}: {
  product: ShoppingProduct;
  size?: "card" | "detail";
}) {
  const fallback = getProductImageFallback(product);
  const approved = hasApprovedProductImage(product);

  return (
    <div className={`product-image-frame product-image-frame-${size}`}>
      {approved ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={product.image_alt_text ?? product.name} src={product.image_url ?? ""} />
      ) : (
        <div
          aria-label={`${fallback.reason} for ${product.name}`}
          className="product-image-fallback"
          role="img"
        >
          <span className="product-image-initials" aria-hidden="true">
            {fallback.initials}
          </span>
          <span className="product-image-label">{fallback.label}</span>
          <span className="product-image-note">{fallback.reason}</span>
        </div>
      )}
    </div>
  );
}
