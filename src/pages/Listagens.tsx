import { type FC } from "react";
import { NavLink } from "react-router-dom";
import Card from "../components/Card";

const listagens = [
  { to: "/listagens/cliente", title: "Cliente", description: "Listar clientes" },
  { to: "/listagens/funcionario", title: "Funcionário", description: "Listar funcionários" },
  { to: "/listagens/entregador", title: "Entregador", description: "Listar entregadores" },
  { to: "/listagens/bloco", title: "Bloco", description: "Listar blocos" },
  { to: "/listagens/campus", title: "Campus", description: "Listar campi" },
  { to: "/listagens/refeicao", title: "Refeição", description: "Listar refeições" },
  { to: "/listagens/bebida", title: "Bebida", description: "Listar bebidas" },
  { to: "/listagens/cardapio", title: "Cardápio", description: "Listar cardápios" },
  { to: "/listagens/pedido", title: "Pedido", description: "Listar pedidos" },
  { to: "/listagens/entrega", title: "Entrega", description: "Listar entregas" }
];

const Listagens: FC = () => {
  return (
    <div className="container mt-5">
      <div className="row g-3">
        {listagens.map((listagens, idx) => (
          <div key={listagens.to} className={`col-3${idx % 2 === 0 ? " offset-3" : ""}`}>
            <NavLink to={listagens.to} className="text-decoration-none" end>
              <Card title={listagens.title} description={listagens.description} />
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listagens;