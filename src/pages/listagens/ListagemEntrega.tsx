import { type FC, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import entregaService from '../../services/entregaService';
import entregadorService from '../../services/entregadorService';
import { toast } from 'react-hot-toast';

interface Entrega {
  id: number;
  pedidoId: number;
  entregadorId: number;
  inicio_entrega: string;
  fim_entrega: string;
}

interface Entregador {
  id: number;
  nome: string;
}

const ListagemEntrega: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Query principal para buscar as entregas
  const { data: entregas, isLoading, isError, error } = useQuery<Entrega[]>({
    queryKey: ['entregas'],
    queryFn: entregaService.getEntregas,
  });

  // Query para buscar todos os entregadores de uma vez (mais eficiente)
  const { data: entregadores } = useQuery<Entregador[]>({
    queryKey: ['entregadores'],
    queryFn: entregadorService.getEntregadores,
  });

  // Cria um mapa de ID -> Nome para fácil consulta, evitando múltiplas requisições
  const entregadorMap = useMemo(() => {
    if (!entregadores) return new Map();
    return new Map(entregadores.map(e => [e.id, e.nome]));
  }, [entregadores]);

  const deleteMutation = useMutation({
    mutationFn: entregaService.deleteEntrega,
    onSuccess: () => {
      toast.success('Entrega excluída com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['entregas'] });
    },
    onError: (err: any) => {
      toast.error(`Erro ao excluir entrega: ${err.message}`);
    },
  });

  const handleDelete = (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir esta entrega?');
    if (confirma) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (entregaId: number) => {
    navigate(`/cadastro/entrega/edit/${entregaId}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Entregas</h1>
        <Link to="/cadastro/entrega" className="btn btn-primary">
          Nova Entrega
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>ID do Pedido</th>
            <th>Entregador</th>
            <th>Início</th>
            <th>Fim</th>
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
                Erro ao carregar entregas: {error.message}
              </td>
            </tr>
          ) : (
            entregas?.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.pedidoId}</td>
                <td>{entregadorMap.get(c.entregadorId) || 'Desconhecido'}</td>
                <td>{c.inicio_entrega ? new Date(c.inicio_entrega).toLocaleString('pt-BR') : '-'}</td>
                <td>{c.fim_entrega ? new Date(c.fim_entrega).toLocaleString('pt-BR') : '-'}</td>
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

export default ListagemEntrega;