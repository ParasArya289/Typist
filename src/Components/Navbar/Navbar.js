import Switch from "../Switch/Switch";
import "./Navbar.css";
import { AiOutlineSetting } from "react-icons/ai";
import DropdownMenuSettings from "../DropDownMenu/DropDownMenu";

export const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <h4>Typist</h4>
        <div>
          <Switch />
          <DropdownMenuSettings />
        </div>
      </div>
    </nav>
  );
};
