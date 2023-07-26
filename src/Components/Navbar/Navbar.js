import Switch from "../Switch/Switch";
import "./Navbar.css";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h4>Typist</h4>
          <Switch />
      </div>
    </nav>
  );
};
