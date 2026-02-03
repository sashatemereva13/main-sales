import insta from "/icons/insta-icon.svg";
import mail from "/icons/mail-icon.svg";
import linkedin from "/icons/linkedin-icon.svg";
import "./css/nav.css";
import { Link as ScrollLink } from "react-scroll";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="navigation">
      <p className="nav-tagline">Les experiences digitales personnalisée</p>
      <div className="navLinks">
        <a
          href="https://www.instagram.com/13xsasha/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <img src={insta} alt="" />
        </a>

        <a href="mailto:sashatemereva13@gmail.com" aria-label="Email">
          <img src={mail} alt="" />
        </a>

        <a
          href="https://www.linkedin.com/in/sashatemereva/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <img src={linkedin} alt="" />
        </a>
      </div>
    </nav>
  );
};

export default Nav;
