import React from 'react'
import Header from '../components/Login/Layout/Header'
import Hero from '../components/Route/Hero/Hero'
import Categories from '../components/Route/Hero/Category/Categories'
import BestDeals from '../components/Route/Hero/BestDeals/BestDeals'
import FeatureProduct from '../components/Route/Hero/FeatureProduct/FeatureProduct'
import Event from '../components/Events/Event'
import Sponsored from '../components/Route/Hero/Sponsored'
import Footer from '../components/Login/Layout/Footer'
const HomePage = () => {
  return (
    <div>
      <Header />
      <Hero/>
      <Categories/>
      <BestDeals/>
      <Event/>
      <FeatureProduct/>
      <Sponsored/>
      <Footer/>
    </div>
  )
}

export default HomePage
