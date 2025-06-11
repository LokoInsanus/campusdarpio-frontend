import { type FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import refeicaoService from '../../services/refeicaoService';
import { toast } from 'react-hot-toast';

interface Refeicao {
  id: number;
  nome: string;
  descricao: string;
  tipo: string;
  preco: string;
  quantidade: string;
}

const ListagemRefeicao: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: refeicoes, isLoading, isError, error } = useQuery<Refeicao[]>({
    queryKey: ['refeicoes'],
    queryFn: refeicaoService.getRefeicoes,
  });

  const deleteMutation = useMutation({
    mutationFn: refeicaoService.deleteRefeicao,
    onSuccess: () => {
      toast.success('Refeição excluída com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['refeicoes'] });
    },
    onError: (err: any) => {
      toast.error(`Erro ao excluir refeição: ${err.message}`);
    },
  });

  const handleDelete = (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir esta refeição?');
    if (confirma) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (refeicaoId: number) => {
    navigate(`/cadastro/refeicao/edit/${refeicaoId}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Refeições</h1>
        <Link to="/cadastro/refeicao" className="btn btn-primary">
          Nova Refeição
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
          {isLoading ? (
            <tr>
              <td colSpan={7} className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={7} className="text-center text-danger">
                Erro ao carregar refeições: {error.message}
              </td>
            </tr>
          ) : (
            refeicoes?.map(c => (
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

export default ListagemRefeicao;