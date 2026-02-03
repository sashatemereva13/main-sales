import { Link } from "react-router-dom";
import "./designStudio.css";
import Scene6 from "../3Dscenes/Scene6";

const DesignStudio = () => {
  return (
    <section className="designStudio">
      <div className="designStudio-inner">
        <p className="designStudio-intro">
          Entrez dans le Design Studio. Ici, nous façonnons l’univers visuel qui
          vous correspond — avec intention, cohérence et sens du détail.
        </p>
        <div className="visualBox">
          <Scene6 />
        </div>

        <nav className="designStudio-steps">
          <Link to="/designstudio/colors" className="studioStep">
            <span className="stepIndex">01</span>
            <span className="stepLabel">Palette de couleurs</span>
            <span className="stepHint">Ambiance & harmonie</span>
          </Link>

          <Link to="/designstudio/fonts" className="studioStep">
            <span className="stepIndex">02</span>
            <span className="stepLabel">Typographies</span>
            <span className="stepHint">Voix & lisibilité</span>
          </Link>

          <Link to="/designstudio/energy" className="studioStep">
            <span className="stepIndex">03</span>
            <span className="stepLabel">Énergie du site</span>
            <span className="stepHint">Rythme & présence</span>
          </Link>
        </nav>
      </div>
    </section>
  );
};

export default DesignStudio;
