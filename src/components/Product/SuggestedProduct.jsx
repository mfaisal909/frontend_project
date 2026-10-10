
import React, { useMemo } from "react";
import { useSelector } from "react-redux";
import ProductCard from "../Route/Hero/ProductCard/ProductCard";
import { mergeCatalog } from "../../utils/catalog";

const RELATED_COUNT = 5;

const SuggestedProduct = ({ data }) => {
  const { allProducts, soldCounts } = useSelector((state) => state.products);

  // Related means the same category, and nothing else: a shoe must never be
  // offered a laptop. The whole catalogue is searched, demo included, so a
  // product opened from a demo card still finds its neighbours. Up to five are
  // shown; a category with fewer simply shows fewer rather than borrowing from
  // an unrelated one.
  const productData = useMemo(() => {
    const products = mergeCatalog(allProducts, soldCounts, {
      includeDemo: true,
    });

    const currentProductId = String(data?._id || data?.id);

    return products
      .filter(
        (product) =>
          product.category === data?.category &&
          String(product._id || product.id) !== currentProductId
      )
      .slice(0, RELATED_COUNT);
  }, [allProducts, soldCounts, data]);


  return (
    <>
      {data && (
        <section className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
          {/* Header */}
          <div className="mb-8 border-b border-gray-200 pb-5">
            <p className="mb-2 text-sm font-medium uppercase tracking-wider text-gray-500">
              You may also like
            </p>

            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Related Products
            </h2>
          </div>

          {/* Products */}
          {productData.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {productData.map((product) => (
                <div key={product._id || product.id}>
                  <ProductCard data={product} />
                </div>
              ))}
            </div>
          ) : (
            <div className="flex min-h-[180px] items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50">
              <p className="text-sm font-medium text-gray-500">
                No related products available.
              </p>
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default SuggestedProduct;
