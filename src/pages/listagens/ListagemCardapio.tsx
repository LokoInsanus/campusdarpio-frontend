import { type FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import cardapioService from '../../services/cardapioService';
import { toast } from 'react-hot-toast';

interface Cardapio {
  id: number;
  data: string;
  descricao: string;
  bebidas: Array<{ nome: string }>;
  refeicoes: Array<{ nome: string }>;
}

const ListagemCardapio: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: cardapios, isLoading, isError, error } = useQuery<Cardapio[]>({
    queryKey: ['cardapios'],
    queryFn: cardapioService.getCardapios,
  });

  const deleteMutation = useMutation({
    mutationFn: cardapioService.deleteCardapio,
    onSuccess: () => {
      toast.success('Cardápio excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['cardapios'] });
    },
    onError: (err: any) => {
      toast.error(`Erro ao excluir cardápio: ${err.message}`);
    },
  });

  const handleDelete = (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este cardápio?');
    if (confirma) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (cardapioId: number) => {
    navigate(`/cadastro/cardapio/edit/${cardapioId}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Cardápios</h1>
        <Link to="/cadastro/cardapio" className="btn btn-primary">
          Novo Cardápio
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
          {isLoading ? (
            <tr>
              <td colSpan={6} className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={6} className="text-center text-danger">
                Erro ao carregar cardápios: {error.message}
              </td>
            </tr>
          ) : (
            cardapios?.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{new Date(c.data).toLocaleDateString('pt-BR')}</td>
                <td>{c.descricao}</td>
                <td>{c.bebidas?.map(b => b.nome).join(', ') || '-'}</td>
                <td>{c.refeicoes?.map(r => r.nome).join(', ') || '-'}</td>
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
                    disabled={deleteMutation.isPending && deleteMutation.variables === c.id}
                  >
                    {deleteMutation.isPending && deleteMutation.variables === c.id ? 'Excluindo...' : 'Excluir'}
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListagemCardapio;