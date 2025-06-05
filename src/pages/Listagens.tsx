import { type FC } from "react";
import { NavLink } from "react-router-dom";
import Card from "../components/Card";

const listagens = [
  { to: "/listagem/cliente", title: "Cliente", description: "Listar clientes" },
  { to: "/listagem/funcionario", title: "Funcionário", description: "Listar funcionários" },
  { to: "/listagem/entregador", title: "Entregador", description: "Listar entregadores" },
  { to: "/listagem/bloco", title: "Bloco", description: "Listar blocos" },
  { to: "/listagem/campus", title: "Campus", description: "Listar campi" },
  { to: "/listagem/refeicao", title: "Refeição", description: "Listar refeições" },
  { to: "/listagem/bebida", title: "Bebida", description: "Listar bebidas" },
  { to: "/listagem/cardapio", title: "Cardápio", description: "Listar cardápios" },
  { to: "/listagem/pedido", title: "Pedido", description: "Listar pedidos" },
  { to: "/listagem/entrega", title: "Entrega", description: "Listar entregas" }
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