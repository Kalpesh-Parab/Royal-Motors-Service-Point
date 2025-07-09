import React from 'react';
import HomeHero from './sections/homeHero/HomeHero';
import Scroll from './sections/scroll/Scroll';
import Learn from './sections/learn/Learn';
import Emotions from './sections/emotions/Emotions';
import WeProvide from './sections/weProvide/WeProvide';
import Delivery from './sections/delivery/Delivery';
import Shine from './sections/shine/Shine';
import WhyChooseUs from './sections/whyChooseUs/WhyChooseUs';
import Testimonials from './sections/testimonials/Testimonials';
import Contact from './sections/contact/Contact';

const Home = () => {
  return (
    <>
      <HomeHero />
      <Scroll />
      <Learn />
      <Emotions />
      <WeProvide />
      <Delivery />
      <Shine />
      <WhyChooseUs />
      <Testimonials />
      <Contact/>
    </>
  );
};

export default Home;
