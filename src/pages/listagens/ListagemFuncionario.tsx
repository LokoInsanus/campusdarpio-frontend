import { type FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import funcionarioService from '../../services/funcionarioService';
import { toast } from 'react-hot-toast';

interface Funcionario {
  id: number;
  nome: string;
  cpf: string;
  cargo: string;
  telefone: string;
  endereco: string;
}

const ListagemFuncionario: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: funcionarios, isLoading, isError, error } = useQuery<Funcionario[]>({
    queryKey: ['funcionarios'],
    queryFn: funcionarioService.getFuncionarios,
  });

  const deleteMutation = useMutation({
    mutationFn: funcionarioService.deleteFuncionario,
    onSuccess: () => {
      toast.success('Funcionário excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
    },
    onError: (err: any) => {
      toast.error(`Erro ao excluir funcionário: ${err.message}`);
    },
  });

  const handleDelete = (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este funcionário?');
    if (confirma) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (funcionarioId: number) => {
    navigate(`/cadastro/funcionario/edit/${funcionarioId}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Funcionários</h1>
        <Link to="/cadastro/funcionario" className="btn btn-primary">
          Novo Funcionário
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Cargo</th>
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
                Erro ao carregar funcionários: {error.message}
              </td>
            </tr>
          ) : (
            funcionarios?.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.cpf}</td>
                <td>{c.cargo}</td>
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

export default ListagemFuncionario;