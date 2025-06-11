import { type FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import bebidaService from '../../services/bebidaService';
import { toast } from 'react-hot-toast';

interface Bebida {
  id: number;
  nome: string;
  tipo: string;
  preco: string;
  quantidade: string;
}

const ListagemBebida: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: bebidas, isLoading, isError, error } = useQuery<Bebida[]>({
    queryKey: ['bebidas'],
    queryFn: bebidaService.getBebidas,
  });

  const deleteMutation = useMutation({
    mutationFn: bebidaService.deleteBebida,
    onSuccess: () => {
      toast.success('Bebida excluída com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['bebidas'] });
    },
    onError: (err: any) => {
      toast.error(`Erro ao excluir bebida: ${err.message}`);
    },
  });

  const handleDelete = (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir esta bebida?');
    if (confirma) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (bebidaId: number) => {
    navigate(`/cadastro/bebida/edit/${bebidaId}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Bebidas</h1>
        <Link to="/cadastro/bebida" className="btn btn-primary">
          Nova Bebida
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
                Erro ao carregar bebidas: {error.message}
              </td>
            </tr>
          ) : (
            bebidas?.map(c => (
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

export default ListagemBebida;