import './about.scss';
import aboutHero from '../../assets/aboutHero.jpg';

const About = () => {
  return (
    <section className='About'>
      <div className='heading'>
        Learn more <br />
        about the <span>Company</span>
      </div>
      <div className='desc'>
        Royal Motors Service Point, established in March 1999, is more than just
        a motorcycle garage — it's a destination for Royal Enfield lovers who
        demand excellence, authenticity, and personal care for their machines.
        With over 26 years of hands-on experience, we have become a trusted name
        in the biking community, known for our deep expertise, consistent
        quality, and a true passion for everything Royal Enfield.
      </div>
      <img src={aboutHero} alt='' />
      <div className='desc'>
        Our story began with one man’s unwavering love for the iconic thump of a
        Royal Enfield. What started as a small garage driven by dedication and
        hard work has grown into a fully equipped service center that has earned
        the trust of thousands of riders. For a time, we proudly served as an
        authorized Royal Enfield workshop, a recognition that solidified our
        reputation for professional-grade service and deep technical knowledge.
      </div>
      <div className='desc'>
        At Royal Motors, we specialize in everything from routine servicing and
        engine overhauls to high-end custom modifications and full restorations.
        Whether you're a daily rider or a collector, we treat your bike with the
        same level of respect and precision — because we know it's not just a
        vehicle, it’s a part of your identity.
      </div>
      <div className='desc'>
        We’ve built more than just bikes here. We’ve built relationships,
        memories, and a strong reputation for affordable, honest, and
        high-quality service. Our customers return not just for repairs, but for
        the personalized attention, trustworthy advice, and passion we bring to
        every job.
      </div>
      <div className='desc'>
        Today, with decades of legacy and a loyal customer base behind us, Royal
        Motors Service Point continues to stand strong — a place where machines
        are maintained, rebuilt, and reborn with heart.
      </div>
    </section>
  );
};

export default About;
