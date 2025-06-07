import { type FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import campusService from '../../services/campusService';

const ListagemCampus: FC = () => {
  const [campi, setCampi] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchCampi = async () => {
    try {
      const list = await campusService.getCampi();
      setCampi(list);
    } catch (err) {
      console.error('Erro ao buscar campi:', err);
    }
  };

  useEffect(() => {
    fetchCampi();
  }, []);

  const handleDelete = async (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este campus?');
    if (!confirma) return;

    try {
      await campusService.deleteCampus(id);
      await fetchCampi();
    } catch (err) {
      console.error('Erro ao excluir campus:', err);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/cadastrar/campus/${id}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Campi</h1>
        <Link to="/cadastro/campus" className="btn btn-primary">
          Novo Campus
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Endereço</th>
            <th>Quantidade de Blocos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {campi.length > 0 ? (
            campi.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.endereco}</td>
                <td>{c.quantidadeBlocos}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(c.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(c.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={5} className="text-center">
                Carregando campi…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListagemCampus;
