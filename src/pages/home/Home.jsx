import React from 'react'
import HomeHero from './sections/homeHero/HomeHero'
import Scroll from './sections/scroll/Scroll'
import Learn from './sections/learn/Learn'

const Home = () => {
  return (
    <>
      <HomeHero />
      <Scroll />
      <Learn/>
    </>
  )
}

export default Home