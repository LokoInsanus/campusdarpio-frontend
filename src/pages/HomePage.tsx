import { type FC } from "react";
import { NavLink } from "react-router-dom";
import Card from "../components/Card";

const cards = [
  { to: "/cadastros", title: "Cadastros", description: "Realizar cadastros" },
  { to: "/listagens", title: "Listagens", description: "Ver listagens" },
  { to: "/cardapio", title: "Cardápio", description: "Editar cardápio" },
  { to: "/pedido", title: "Pedido", description: "Realizar pedidos" },
  { to: "/entrega", title: "Entrega", description: "Gerenciar entregas" }
];

const HomePage: FC = () => {
  return (
    <div className="container mt-5">
      <div className="row g-3">
        {cards.map((paginas, idx) => (
          <div key={paginas.to} className={`col-3${idx % 2 === 0 ? " offset-3" : ""}`}>
            <NavLink to={paginas.to} className="text-decoration-none w-100" end>
              <Card title={paginas.title} description={paginas.description} />
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
