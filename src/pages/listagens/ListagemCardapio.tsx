import { type FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import cardapioService from '../../services/cardapioService';

const ListagemCardapio: FC = () => {
  const [cardapios, setCardapios] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchCardapios = async () => {
    try {
      const list = await cardapioService.getCardapios();
      setCardapios(list);
    } catch (err) {
      console.error('Erro ao buscar cardapios:', err);
    }
  };

  useEffect(() => {
    fetchCardapios();
  }, []);

  const handleDelete = async (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este cardapio?');
    if (!confirma) return;

    try {
      await cardapioService.deleteCardapio(id);
      await fetchCardapios();
    } catch (err) {
      console.error('Erro ao excluir cardapio:', err);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/cadastrar/cardapio/${id}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Cardapios</h1>
        <Link to="/cadastro/cardapio" className="btn btn-primary">
          Novo Cardapio
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Data</th>
            <th>Descrição</th>
            <th>Bebidas</th>
            <th>Refeições</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {cardapios.length > 0 ? (
            cardapios.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.data}</td>
                <td>{c.descricao}</td>
                <td>{c.bebidas && c.bebidas.length > 0 ? c.bebidas.map((b: any) => b.nome).join(', ') : ''}</td>
                <td>{c.refeicoes && c.refeicoes.length > 0 ? c.refeicoes.map((b: any) => b.nome).join(', ') : ''}</td>
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
                Carregando cardapios…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListagemCardapio;
