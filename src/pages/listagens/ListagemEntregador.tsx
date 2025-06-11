import { type FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import entregadorService from '../../services/entregadorService';
import { toast } from 'react-hot-toast';

interface Entregador {
  id: number;
  nome: string;
  cnh: string;
  status: string;
  telefone: string;
  endereco: string;
}

const ListagemEntregador: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: entregadores, isLoading, isError, error } = useQuery<Entregador[]>({
    queryKey: ['entregadores'],
    queryFn: entregadorService.getEntregadores,
  });

  const deleteMutation = useMutation({
    mutationFn: entregadorService.deleteEntregador,
    onSuccess: () => {
      toast.success('Entregador excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['entregadores'] });
    },
    onError: (err: any) => {
      toast.error(`Erro ao excluir entregador: ${err.message}`);
    },
  });

  const handleDelete = (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este entregador?');
    if (confirma) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (entregadorId: number) => {
    navigate(`/cadastro/entregador/edit/${entregadorId}`);
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
                Erro ao carregar entregadores: {error.message}
              </td>
            </tr>
          ) : (
            entregadores?.map(c => (
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

export default ListagemEntregador;