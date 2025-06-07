import { type FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import refeicaoService from '../../services/refeicaoService';

const ListagemRefeicao: FC = () => {
  const [refeicoes, setRefeicoes] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchRefeicoes = async () => {
    try {
      const list = await refeicaoService.getRefeicoes();
      setRefeicoes(list);
    } catch (err) {
      console.error('Erro ao buscar refeicoes:', err);
    }
  };

  useEffect(() => {
    fetchRefeicoes();
  }, []);

  const handleDelete = async (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este refeicao?');
    if (!confirma) return;

    try {
      await refeicaoService.deleteRefeicao(id);
      await fetchRefeicoes();
    } catch (err) {
      console.error('Erro ao excluir refeicao:', err);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/cadastrar/refeicao/${id}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Refeições</h1>
        <Link to="/cadastro/refeicao" className="btn btn-primary">
          Novo Refeição
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Tipo</th>
            <th>Preço</th>
            <th>Quantidade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {refeicoes.length > 0 ? (
            refeicoes.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.descricao}</td>
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
              <td colSpan={7} className="text-center">
                Carregando refeicoes…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListagemRefeicao;
