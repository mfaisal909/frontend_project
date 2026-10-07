import {Link} from 'react-router-dom'
export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-[#f7f7f7]">
      <div className="relative h-[430px] sm:h-[500px] md:h-[560px] lg:h-[620px]">
        
        <img
          src="https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80"
          alt="Home Decoration Banner"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/85 to-white/20"></div>

        <div className="relative z-10 flex h-full items-center">
          <div className="mx-auto w-full max-w-[1380px] px-6 sm:px-8 md:px-12 lg:px-20">
            <div className="max-w-[680px]">
              <h1 className="font-[700] text-[#1c1c1c] leading-[1.08] tracking-[-0.03em] text-[32px] sm:text-[42px] md:text-[54px] lg:text-[66px] xl:text-[74px]">
                Best Collection For
                <br />
                Home Decaration
              </h1>

              <p className="mt-5 max-w-[610px] text-[#666] text-[13px] sm:text-[14px] md:text-[15px] leading-6 sm:leading-7">
                Lorem ipsum dolor sit amet consectetur, adipisicing elit. Beatae,
                assumenda? Quisquam itaque exercitationem labore vel, dolore quidem
                asperiores, laudantium temporibus soluta optio consequatur aliquam
                deserunt officia. Dolorum saepe nulla provident.
              </p>
              <Link to='/products'>
              <button className="mt-7 inline-flex items-center rounded-xl bg-black px-7 sm:px-8 py-3 sm:py-3.5 text-white text-[14px] sm:text-[15px] font-semibold shadow-lg transition-all duration-300 hover:bg-[#111] hover:shadow-2xl hover:-translate-y-[2px]">
                Shop Now
              </button>
              </Link>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
