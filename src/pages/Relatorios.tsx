import { type FC } from "react";
import { NavLink } from "react-router-dom";
import Card from "../components/Card";

const relatorios = [
  { to: "/relatorio/Refeicoes", title: "Refeições", description: "Mais pedidas" },
  { to: "/relatorio/Bebidas", title: "Bebidas", description: "Mais pedidas" },
  { to: "/relatorio/TotaisCampus", title: "Totais de campus", description: "Por bloco, cliente e data" },
  { to: "/relatorio/TotaisEntregador", title: "Totais de entregadores", description: "Por data" },
  { to: "/relatorio/TempoMedioEntregador", title: "Tempo médio", description: "Por entregador" },
  { to: "/relatorio/TotaisTipo", title: "Totais de Tipos", description: "Por cardápio e data" }
];

const Relatorios: FC = () => {
  return (
    <div className="container mt-5">
      <div className="row g-3">
        {relatorios.map((relatorio, idx) => (
          <div key={relatorio.to} className={`col-3${idx % 2 === 0 ? " offset-3" : ""}`}>
            <NavLink to={relatorio.to} className="text-decoration-none" end>
              <Card title={relatorio.title} description={relatorio.description} />
            </NavLink>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Relatorios;