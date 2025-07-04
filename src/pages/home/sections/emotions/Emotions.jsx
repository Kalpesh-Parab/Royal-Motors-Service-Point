import "./emotions.scss"
import royalLogo from "../../../../assets/royalLogo.png"
import logoWhite from "../../../../assets/logoWhite.png"

const Emotions = () => {
  return (
      <section className="Emotions">
          <div className="image">
              <img src={royalLogo} alt="" />
          </div>
          <div className="desc">
              <div className="title">
                  We service <br />your emotions.
              </div>
              <div className="since">
                  royalmotorservicepoint*since1999
              </div>
          </div>
          <div className="logo">
              <img src={logoWhite} alt="" />
          </div>
    </section>
  )
}

export default Emotions