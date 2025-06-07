import { type FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import bebidaService from '../../services/bebidaService';

const ListagemBebida: FC = () => {
  const [bebidas, setBebidas] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchBebidas = async () => {
    try {
      const list = await bebidaService.getBebidas();
      setBebidas(list);
    } catch (err) {
      console.error('Erro ao buscar bebidas:', err);
    }
  };

  useEffect(() => {
    fetchBebidas();
  }, []);

  const handleDelete = async (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este bebida?');
    if (!confirma) return;

    try {
      await bebidaService.deleteBebida(id);
      await fetchBebidas();
    } catch (err) {
      console.error('Erro ao excluir bebida:', err);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/cadastrar/bebida/${id}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Bebidas</h1>
        <Link to="/cadastro/bebida" className="btn btn-primary">
          Novo Bebida
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {bebidas.length > 0 ? (
            bebidas.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.tipo}</td>
                <td>{c.preco}</td>
                <td>{c.quantidade}</td>
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
                Carregando bebidas…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListagemBebida;
