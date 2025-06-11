import { type FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import blocoService from '../../services/blocoService';
import { toast } from 'react-hot-toast';

interface Bloco {
  id: number;
  nome: string;
  tipo: string;
  capacidade: string;
  descricao: string;
}

const ListagemBloco: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: blocos, isLoading, isError, error } = useQuery<Bloco[]>({
    queryKey: ['blocos'],
    queryFn: blocoService.getBlocos,
  });

  const deleteMutation = useMutation({
    mutationFn: blocoService.deleteBloco,
    onSuccess: () => {
      toast.success('Bloco excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['blocos'] });
    },
    onError: (err: any) => {
      toast.error(`Erro ao excluir bloco: ${err.message}`);
    },
  });

  const handleDelete = (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este Bloco?');
    if (confirma) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (blocoId: number) => {
    navigate(`/cadastro/bloco/edit/${blocoId}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Blocos</h1>
        <Link to="/cadastro/bloco" className="btn btn-primary">
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
                Erro ao carregar blocos: {error.message}
              </td>
            </tr>
          ) : (
            blocos?.map(c => (
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

export default ListagemBloco;