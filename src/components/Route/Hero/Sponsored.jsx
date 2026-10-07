import React from 'react'

const Sponsored = () => {
  const brands = [
    {
      id: 1,
      name: 'Shoe',
      image:
        'https://static.vecteezy.com/system/resources/previews/029/607/055/non_2x/men-s-shoe-logo-template-design-for-running-or-sport-logo-for-shoe-shop-fashion-and-business-free-vector.jpg', // example shoe brand (Nike)
    },
    {
      id: 2,
      name: 'Dell',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/4/48/Dell_Logo.svg',
    },
    {
      id: 3,
      name: 'Apple',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg',
    },
    {
      id: 4,
      name: 'HP',
      image:
        'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTjSWeC6fxvJC-c0cEjGKPZYjQ2IvbGJW5_gQ&s', // HP logo
    },
    {
      id: 5,
      name: 'Microsoft',
      image:
        'https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg',
    },
  ]

  return (
    <section className="w-full bg-[#e5e5e5] py-6 md:py-8">
      <div className="w-[94%] md:w-[92%] lg:w-[90%] mx-auto">
        <div className="bg-[#f7f7f7] rounded-xl px-5 sm:px-8 md:px-10 lg:px-12 py-6 md:py-8">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 md:gap-6 items-center">
            {brands.map((brand) => (
              <div
                key={brand.id}
                className="h-[70px] md:h-[90px] flex items-center justify-center"
              >
                <img
                  src={brand.image}
                  alt={brand.name}
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Sponsored
