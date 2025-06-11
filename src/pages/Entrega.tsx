import { type FC, useState, type ChangeEvent, useMemo, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import pedidoService from '../services/pedidoService';
import clienteService from '../services/clienteService';
import refeicaoService from '../services/refeicaoService';
import bebidaService from '../services/bebidaService';
import campusService from '../services/campusService';
import blocoService from '../services/blocoService';
import entregadorService from '../services/entregadorService';
import entregaService from '../services/entregaService';

interface GenericItem { id: number; nome: string; }
interface Pedido {
  id: number;
  clienteId: number;
  refeicaoId: number;
  bebidaId: number;
  dataHora: string;
  campusId: number;
  blocoId: number;
}
interface EntregaFormState {
  pedidoId: string;
  entregadorId: string;
  fim_entrega: string;
}

const Entrega: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [entrega, setEntrega] = useState<EntregaFormState>({
    pedidoId: '',
    entregadorId: '',
    fim_entrega: '',
  });
  const [errors, setErrors] = useState<Partial<EntregaFormState>>({});

  const { data: pedidos, isLoading: isLoadingPedidos } = useQuery<Pedido[]>({ queryKey: ['pedidos'], queryFn: pedidoService.getPedidos });
  const { data: clientes } = useQuery<GenericItem[]>({ queryKey: ['clientes'], queryFn: clienteService.getClientes });
  const { data: refeicoes } = useQuery<GenericItem[]>({ queryKey: ['refeicoes'], queryFn: refeicaoService.getRefeicoes });
  const { data: bebidas } = useQuery<GenericItem[]>({ queryKey: ['bebidas'], queryFn: bebidaService.getBebidas });
  const { data: campi } = useQuery<GenericItem[]>({ queryKey: ['campi'], queryFn: campusService.getCampi });
  const { data: blocos } = useQuery<GenericItem[]>({ queryKey: ['blocos'], queryFn: blocoService.getBlocos });
  const { data: entregadores, isLoading: isLoadingEntregadores } = useQuery<GenericItem[]>({ queryKey: ['entregadores'], queryFn: entregadorService.getEntregadores });

  const createNameMap = (items: GenericItem[] | undefined) => useMemo(() => {
    if (!items) return new Map<number, string>();
    return new Map(items.map(item => [item.id, item.nome]));
  }, [items]);

  const clienteMap = createNameMap(clientes);
  const refeicaoMap = createNameMap(refeicoes);
  const bebidaMap = createNameMap(bebidas);
  const campusMap = createNameMap(campi);
  const blocoMap = createNameMap(blocos);

  const selectedPedido = useMemo(() => {
    if (!entrega.pedidoId || !pedidos) return null;
    return pedidos.find(p => p.id === Number(entrega.pedidoId));
  }, [entrega.pedidoId, pedidos]);

  const mutation = useMutation({
    mutationFn: (newEntrega: EntregaFormState) => {
      const payload = {
        pedidoId: Number(newEntrega.pedidoId),
        entregadorId: Number(newEntrega.entregadorId),
        inicio_entrega: new Date().toISOString(),
        fim_entrega: new Date(newEntrega.fim_entrega).toISOString(),
      };
      return entregaService.createEntrega(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entregas'] });
      toast.success('Entrega registrada com sucesso!');
      navigate('/listagem/entrega');
    },
    onError: (error: any) => {
      toast.error(`Erro ao registrar entrega: ${error.message}`);
    }
  });

  const handleChange = (e: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setEntrega(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof EntregaFormState]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<EntregaFormState> = {};
    if (!entrega.pedidoId) newErrors.pedidoId = 'Selecione um pedido.';
    if (!entrega.entregadorId) newErrors.entregadorId = 'Selecione um entregador.';
    if (!entrega.fim_entrega) newErrors.fim_entrega = 'A data de finalização é obrigatória.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate(entrega);
  };

  const isLoading = isLoadingPedidos || isLoadingEntregadores;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <div className="card">
            <div className="card-header text-bg-light">
              <h2 className="mb-0">Registrar Nova Entrega</h2>
            </div>
            <div className="card-body">
              {isLoading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Carregando dados...</span>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="pedidoId" className="form-label">Pedido</label>
                    <select id="pedidoId" name="pedidoId" className={`form-select ${errors.pedidoId ? 'is-invalid' : ''}`} value={entrega.pedidoId} onChange={handleChange}>
                      <option value="">Selecione um pedido para entrega</option>
                      {pedidos?.map(p => <option key={p.id} value={p.id}>Pedido #{p.id} - {clienteMap.get(p.clienteId) || 'Cliente'}</option>)}
                    </select>
                    {errors.pedidoId && <div className="invalid-feedback">{errors.pedidoId}</div>}
                  </div>

                  {selectedPedido && (
                    <div className="card bg-light mb-4">
                      <div className="card-header">
                        Detalhes do Pedido #{selectedPedido.id}
                      </div>
                      <ul className="list-group list-group-flush">
                        <li className="list-group-item"><strong>Cliente:</strong> {clienteMap.get(selectedPedido.clienteId)}</li>
                        <li className="list-group-item"><strong>Refeição:</strong> {refeicaoMap.get(selectedPedido.refeicaoId)}</li>
                        <li className="list-group-item"><strong>Bebida:</strong> {bebidaMap.get(selectedPedido.bebidaId)}</li>
                        <li className="list-group-item"><strong>Local:</strong> {campusMap.get(selectedPedido.campusId)} - {blocoMap.get(selectedPedido.blocoId)}</li>
                        <li className="list-group-item"><strong>Data do Pedido:</strong> {new Date(selectedPedido.dataHora).toLocaleString('pt-BR')}</li>
                      </ul>
                    </div>
                  )}

                  <div className="mb-3">
                    <label htmlFor="entregadorId" className="form-label">Entregador</label>
                    <select id="entregadorId" name="entregadorId" className={`form-select ${errors.entregadorId ? 'is-invalid' : ''}`} value={entrega.entregadorId} onChange={handleChange} disabled={!entrega.pedidoId}>
                      <option value="">Selecione um entregador</option>
                      {entregadores?.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                    </select>
                    {errors.entregadorId && <div className="invalid-feedback">{errors.entregadorId}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="fim_entrega" className="form-label">Fim da Entrega</label>
                    <input
                      type="datetime-local"
                      id="fim_entrega"
                      name="fim_entrega"
                      className={`form-control ${errors.fim_entrega ? 'is-invalid' : ''}`}
                      value={entrega.fim_entrega}
                      onChange={handleChange}
                      disabled={!entrega.entregadorId}
                    />
                    {errors.fim_entrega && <div className="invalid-feedback">{errors.fim_entrega}</div>}
                  </div>

                  <div className="d-flex mt-4">
                    <button type="submit" className="btn btn-success me-2" disabled={mutation.isPending}>
                      {mutation.isPending ? 'Registrando...' : 'Registrar Entrega'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/listagem/entrega')}>
                      Cancelar
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Entrega;
