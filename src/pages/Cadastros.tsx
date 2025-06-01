import { type FC } from "react";
import { NavLink } from "react-router-dom";
import Card from "../components/Card";

const cadastros = [
  { to: "/cadastros/cliente", title: "Cliente", description: "Cadastrar clientes" },
  { to: "/cadastros/funcionario", title: "Funcionário", description: "Cadastrar funcionários" },
  { to: "/cadastros/entregador", title: "Entregador", description: "Cadastrar entregadores" },
  { to: "/cadastros/bloco", title: "Bloco", description: "Cadastrar blocos" },
  { to: "/cadastros/campus", title: "Campus", description: "Cadastrar campi" },
  { to: "/cadastros/refeicao", title: "Refeição", description: "Cadastrar refeições" },
  { to: "/cadastros/bebida", title: "Bebida", description: "Cadastrar bebidas" },
];

const Cadastros: FC = () => {
  return (
    <div className="container mt-5">
      <div className="row g-3">
        {cadastros.map((cadastro, idx) => (
          <div key={cadastro.to} className={`col-3${idx % 2 === 0 ? " offset-3" : ""}`}>
            <NavLink to={cadastro.to} className="text-decoration-none" end>
              <Card title={cadastro.title} description={cadastro.description} />
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cadastros;