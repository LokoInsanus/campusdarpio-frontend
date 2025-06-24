import { type FC } from "react";
import { NavLink } from "react-router-dom";
import Card from "../components/Card";

const HomePage: FC = () => {
  return (
    <div className="container mt-5">
      <div className="row g-3">
        <div className="col-3 offset-3">
          <NavLink to="/cadastros" className="text-decoration-none w-100" end>
            <Card title="Cadastros" description="Realizar cadastros" />
          </NavLink>
        </div>
        <div className="col-3">
          <NavLink to="/listagens" className="text-decoration-none w-100" end>
            <Card title="Listagens" description="Ver listagens" />
          </NavLink>
        </div>
        <div className="col-3 offset-3">
          <NavLink to="/relatorios" className="text-decoration-none w-100" end>
            <Card title="Relatorios" description="Editar Relatorios" />
          </NavLink>
        </div>
        <div className="col-3">
          <NavLink to="/cardapio" className="text-decoration-none w-100" end>
            <Card title="Cardápio" description="Editar cardápio" />
          </NavLink>
        </div>
        <div className="col-3 offset-3">
          <NavLink to="/pedido" className="text-decoration-none w-100" end>
            <Card title="Pedido" description="Realizar pedidos" />
          </NavLink>
        </div>
        <div className="col-3">
          <NavLink to="/entrega" className="text-decoration-none w-100" end>
            <Card title="Entrega" description="Gerenciar entregas" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
