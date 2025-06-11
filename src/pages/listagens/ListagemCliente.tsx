import { type FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import clienteService from '../../services/clienteService';
import { toast } from 'react-hot-toast';

interface Client {
  id: number;
  nome: string;
  cpf: string;
  status: string;
  telefone: string;
  endereco: string;
}

const ListagemCliente: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: clientes, isLoading, isError, error } = useQuery<Client[]>({
    queryKey: ['clientes'],
    queryFn: clienteService.getClientes
  });

  const deleteMutation = useMutation({
    mutationFn: clienteService.deleteCliente,
    onSuccess: () => {
      toast.success('Cliente excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
    },
    onError: (err: any) => {
      toast.error(`Erro ao excluir cliente: ${err.message}`);
    }
  });

  const handleDelete = (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este cliente?');
    if (confirma) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (clientId: number) => {
    navigate(`/cadastro/cliente/edit/${clientId}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Clientes</h1>
        <Link to="/cadastro/cliente" className="btn btn-primary">
          Novo Cliente
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
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
                Erro ao carregar clientes: {error.message}
              </td>
            </tr>
          ) : (
            clientes?.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.cpf}</td>
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

export default ListagemCliente;