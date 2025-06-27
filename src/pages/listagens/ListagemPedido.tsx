import { type FC, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import pedidoService from '../../services/pedidoService';
import clienteService from '../../services/clienteService';
import cardapioService from '../../services/cardapioService';
import refeicaoService from '../../services/refeicaoService';
import bebidaService from '../../services/bebidaService';
import campusService from '../../services/campusService';
import blocoService from '../../services/blocoService';
import { toast } from 'react-hot-toast';

interface Pedido {
  id: number;
  clienteId: number;
  cardapioId: number;
  refeicaoId: number;
  bebidaId: number;
  dataHora: string;
  campusId: number;
  blocoId: number;
  status: string;
}
interface GenericItem {
  id: number;
  nome?: string;
  descricao?: string;
}

const ListagemPedido: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: pedidos, isLoading, isError, error } = useQuery<Pedido[]>({
    queryKey: ['pedidos'],
    queryFn: pedidoService.getPedidos,
  });

  const { data: clientes } = useQuery<GenericItem[]>({ queryKey: ['clientes'], queryFn: clienteService.getClientes });
  const { data: cardapios } = useQuery<GenericItem[]>({ queryKey: ['cardapios'], queryFn: cardapioService.getCardapios });
  const { data: refeicoes } = useQuery<GenericItem[]>({ queryKey: ['refeicoes'], queryFn: refeicaoService.getRefeicoes });
  const { data: bebidas } = useQuery<GenericItem[]>({ queryKey: ['bebidas'], queryFn: bebidaService.getBebidas });
  const { data: campi } = useQuery<GenericItem[]>({ queryKey: ['campi'], queryFn: campusService.getCampi });
  const { data: blocos } = useQuery<GenericItem[]>({ queryKey: ['blocos'], queryFn: blocoService.getBlocos });

  // Criação de mapas para consulta eficiente
  const createNameMap = (items: GenericItem[] | undefined, nameKey: 'nome' | 'descricao' = 'nome') => useMemo(() => {
    if (!items) return new Map();
    return new Map(items.map(item => [item.id, item[nameKey] || '']));
  }, [items, nameKey]);

  const clienteMap = createNameMap(clientes);
  const cardapioMap = createNameMap(cardapios, 'descricao');
  const refeicaoMap = createNameMap(refeicoes);
  const bebidaMap = createNameMap(bebidas);
  const campusMap = createNameMap(campi);
  const blocoMap = createNameMap(blocos);

  const deleteMutation = useMutation({
    mutationFn: pedidoService.deletePedido,
    onSuccess: () => {
      toast.success('Pedido excluído com sucesso!');
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
    },
    onError: (err: any) => {
      toast.error(`Erro ao excluir pedido: ${err.message}`);
    },
  });

  const handleDelete = (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este pedido?');
    if (confirma) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (pedidoId: number) => {
    navigate(`/pedido/edit/${pedidoId}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Pedidos</h1>
        <Link to="/pedido" className="btn btn-primary">
          Novo Pedido
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Cardápio</th>
            <th>Refeição</th>
            <th>Bebida</th>
            <th>Data/Hora</th>
            <th>Campus</th>
            <th>Bloco</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={10} className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Carregando...</span>
                </div>
              </td>
            </tr>
          ) : isError ? (
            <tr>
              <td colSpan={10} className="text-center text-danger">
                Erro ao carregar pedidos: {error.message}
              </td>
            </tr>
          ) : (
            pedidos?.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{clienteMap.get(c.clienteId) || '...'}</td>
                <td>{cardapioMap.get(c.cardapioId) || '...'}</td>
                <td>{refeicaoMap.get(c.refeicaoId) || '...'}</td>
                <td>{bebidaMap.get(c.bebidaId) || '...'}</td>
                <td>{c.dataHora ? new Date(c.dataHora).toLocaleString('pt-BR') : ''}</td>
                <td>{campusMap.get(c.campusId) || '...'}</td>
                <td>{blocoMap.get(c.blocoId) || '...'}</td>
                <td>{c.status}</td>
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

export default ListagemPedido;