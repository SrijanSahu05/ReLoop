import React from 'react'
import Hero from '../components/Hero';
import CategorySection from '../components/CategorySection';
import NewlyAddedSection from '../components/NewlyAddedSection';

const Home = () => {
  return (
    <div className='min-h-screen bg-[#ffffff]'>
      <Hero/>
      <CategorySection/>
      <NewlyAddedSection/>
    </div>
  )
}

export default Home;