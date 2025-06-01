import { NavLink, Link } from "react-router-dom";
import { type FC } from "react";

const Header: FC = () => {
  return (
    <header className="bg-primary text-white p-3">
      <nav className="container d-flex justify-content-between align-items-center">
        <Link to="/" className="text-white text-decoration-none">
          <h1>Campusdarpio</h1>
        </Link>
        <ul className="nav">
          <li className="nav-item">
            <NavLink to="/" className="nav-link text-white" end>Home</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/cadastros" className="nav-link text-white" end>Cadastros</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/listagens" className="nav-link text-white" end>Listagens</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/cardapio" className="nav-link text-white" end>Cardapio</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/pedido" className="nav-link text-white" end>Pedido</NavLink>
          </li>
          <li className="nav-item">
            <NavLink to="/entrega" className="nav-link text-white" end>Entrega</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export default Header;