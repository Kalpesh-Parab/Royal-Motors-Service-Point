import React from 'react'
import HomeHero from './sections/homeHero/HomeHero'
import Scroll from './sections/scroll/Scroll'
import Learn from './sections/learn/Learn'
import Emotions from './sections/emotions/Emotions'
import WeProvide from './sections/weProvide/WeProvide'

const Home = () => {
  return (
    <>
      <HomeHero />
      <Scroll />
      <Learn />
      <Emotions />
      <WeProvide/>
    </>
  )
}

export default Home