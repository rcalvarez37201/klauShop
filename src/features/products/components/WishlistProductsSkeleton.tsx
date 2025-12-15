import { ProductCardSkeleton } from "./ProductCardSkeleton";

function WishlistProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-4">
      {[...Array(4)].map((_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
    </div>
  );
}

export default WishlistProductsSkeleton;
