import { type FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BlocoService from '../../services/blocoService';

const ListagemBloco: FC = () => {
  const [Blocos, setBlocos] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchBlocos = async () => {
    try {
      const list = await BlocoService.getBlocos();
      setBlocos(list);
    } catch (err) {
      console.error('Erro ao buscar Blocos:', err);
    }
  };

  useEffect(() => {
    fetchBlocos();
  }, []);

  const handleDelete = async (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este Bloco?');
    if (!confirma) return;

    try {
      await BlocoService.deleteBloco(id);
      await fetchBlocos();
    } catch (err) {
      console.error('Erro ao excluir Bloco:', err);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/cadastrar/Bloco/${id}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Blocos</h1>
        <Link to="/cadastro/Bloco" className="btn btn-primary">
          Novo Bloco
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Tipo</th>
            <th>Capacidade</th>
            <th>Descrição</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {Blocos.length > 0 ? (
            Blocos.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.tipo}</td>
                <td>{c.capacidade}</td>
                <td>{c.descricao}</td>
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
                Carregando Blocos…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListagemBloco;
