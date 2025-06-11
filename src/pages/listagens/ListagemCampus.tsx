import { type FC } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import campusService from '../../services/campusService';
import { toast } from 'react-hot-toast';

interface Campus {
  id: number;
  nome: string;
  endereco: string;
  quantidadeBlocos: number;
}

const ListagemCampus: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: campi, isLoading, isError, error } = useQuery<Campus[]>({
    queryKey: ['campi'],
    queryFn: campusService.getCampi,
  });

  const deleteMutation = useMutation({
    mutationFn: campusService.deleteCampus,
    onSuccess: () => {
      toast.success('Campus excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['campi'] });
    },
    onError: (err: any) => {
      toast.error(`Erro ao excluir campus: ${err.message}`);
    },
  });

  const handleDelete = (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este campus?');
    if (confirma) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (campusId: number) => {
    navigate(`/cadastro/campus/edit/${campusId}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Campi</h1>
        <Link to="/cadastro/campus" className="btn btn-primary">
          Novo Campus
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Endereço</th>
            <th>Quantidade de Blocos</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={5} className="text-center text-danger">
                Erro ao carregar campi: {error.message}
              </td>
            </tr>
          ) : (
            campi?.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.endereco}</td>
                <td>{c.quantidadeBlocos}</td>
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

export default ListagemCampus;