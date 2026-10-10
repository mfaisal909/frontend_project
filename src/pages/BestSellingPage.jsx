import React, { useEffect, useMemo } from 'react'
import Header from '../components/Login/Layout/Header'
import { useDispatch, useSelector } from 'react-redux'
import { getAllProducts } from '../redux/actions/product'
import ProductCard from '../components/Route/Hero/ProductCard/ProductCard'
import { mergeCatalog } from '../utils/catalog'
import { PAGE_SIZE } from '../static/pagination'

const BestSellingPage = () => {
  const dispatch = useDispatch()
  const { allProducts, soldCounts } = useSelector((state) => state.products)

  useEffect(() => {
    if (!allProducts?.length) {
      dispatch(getAllProducts())
    }
  }, [dispatch, allProducts?.length])

  // Highest sold first across both halves of the catalogue, capped at
  // PAGE_SIZE items.
  const data = useMemo(
    () =>
      mergeCatalog(allProducts, soldCounts, { includeDemo: true })
        .sort((a, b) => (b.sold_out || 0) - (a.sold_out || 0))
        .slice(0, PAGE_SIZE),
    [allProducts, soldCounts]
  )

  return (
    <div className="bg-gray-50 min-h-screen">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        
        {/* Page Title */}
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Best Selling items
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base">
            Explore our latest and best-selling products
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {
            data && data.map((i, index) => (
              <div 
                key={i._id || index} 
                className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 p-3"
              >
                <ProductCard data={i} />
              </div>
            ))
          }
        </div>

        {/* Empty State */}
        {
          data && data.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <h1 className="text-2xl font-semibold text-gray-700">
                No Products Found
              </h1>
              <p className="text-gray-500 mt-2">
                Check back later for new products.
              </p>
            </div>
          ) : null
        }
      </div>
    </div>
  )
}

export default BestSellingPage