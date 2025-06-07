import { type FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import entregaService from '../../services/entregaService';
import entregadorService from '../../services/entregadorService';

const ListagemEntrega: FC = () => {
  const [entregas, setEntregas] = useState<any[]>([]);
  const [entregadorNames, setEntregadorNames] = useState<{ [key: number]: string }>({});
  const navigate = useNavigate();

  const fetchEntregas = async () => {
    try {
      const list = await entregaService.getEntregas();
      setEntregas(list);
    } catch (err) {
      console.error('Erro ao buscar entregas:', err);
    }
  };

  useEffect(() => {
    fetchEntregas();
  }, []);

  const handleDelete = async (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este entrega?');
    if (!confirma) return;

    try {
      await entregaService.deleteEntrega(id);
      await fetchEntregas();
    } catch (err) {
      console.error('Erro ao excluir entrega:', err);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/cadastrar/entrega/${id}`);
  };

  const getEntregadorName = (id: number) => {
    if (entregadorNames[id]) return entregadorNames[id];
    entregadorService.getEntregadorById(id).then(entregador => {
      setEntregadorNames(prev => ({ ...prev, [id]: entregador ? entregador.nome : 'Desconhecido' }));
    });
    return entregadorNames[id] || 'Carregando...';
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Entregas</h1>
        <Link to="/cadastro/entrega" className="btn btn-primary">
          Novo Entrega
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID do Pedido</th>
            <th>Entregador</th>
            <th>Inicio</th>
            <th>Fim</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {entregas.length > 0 ? (
            entregas.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.pedidoId}</td>
                <td>{getEntregadorName(c.entregadorId)}</td>
                <td>{c.inicio_entrega ? new Date(c.inicio_entrega).toLocaleString('pt-BR') : ''}</td>
                <td>{c.fim_entrega ? new Date(c.fim_entrega).toLocaleString('pt-BR') : ''}</td>
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
              <td colSpan={6} className="text-center">
                Carregando entregas…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListagemEntrega;
