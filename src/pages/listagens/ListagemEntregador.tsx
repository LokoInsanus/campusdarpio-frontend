import { type FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import entregadorService from '../../services/entregadorService';

const ListagemEntregador: FC = () => {
  const [entregadores, setEntregadores] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchEntregadores = async () => {
    try {
      const list = await entregadorService.getEntregadores();
      setEntregadores(list);
    } catch (err) {
      console.error('Erro ao buscar entregadores:', err);
    }
  };

  useEffect(() => {
    fetchEntregadores();
  }, []);

  const handleDelete = async (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este entregador?');
    if (!confirma) return;

    try {
      await entregadorService.deleteEntregador(id);
      await fetchEntregadores();
    } catch (err) {
      console.error('Erro ao excluir entregador:', err);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/cadastrar/entregador/${id}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Entregadores</h1>
        <Link to="/cadastro/entregador" className="btn btn-primary">
          Novo Entregador
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CNH</th>
            <th>Status</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {entregadores.length > 0 ? (
            entregadores.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.cnh}</td>
                <td>{c.status}</td>
                <td>{c.telefone}</td>
                <td>{c.endereco}</td>
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
              <td colSpan={7} className="text-center">
                Carregando entregadores…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListagemEntregador;
