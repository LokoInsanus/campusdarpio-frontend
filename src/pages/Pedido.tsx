import { type FC, useState, type ChangeEvent, useMemo, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import clienteService from '../services/clienteService';
import cardapioService from '../services/cardapioService';
import campusService from '../services/campusService';
import blocoService from '../services/blocoService';
import pedidoService from '../services/pedidoService';

interface GenericItem { id: number; nome: string; }
interface CardapioItem {
  id: number;
  descricao: string;
  refeicoes: GenericItem[];
  bebidas: GenericItem[];
}
interface BlocoItem { id: number; nome: string; campusId: number; }

interface PedidoState {
  clienteId: string;
  cardapioId: string;
  refeicaoId: string;
  bebidaId: string;
  campusId: string;
  blocoId: string;
}

const Pedido: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [pedido, setPedido] = useState<PedidoState>({
    clienteId: '',
    cardapioId: '',
    refeicaoId: '',
    bebidaId: '',
    campusId: '',
    blocoId: ''
  });
  const [errors, setErrors] = useState<Partial<PedidoState>>({});

  const { data: clientes, isLoading: isLoadingClientes } = useQuery<GenericItem[]>({
    queryKey: ['clientes'],
    queryFn: clienteService.getClientes,
  });

  const { data: cardapios, isLoading: isLoadingCardapios } = useQuery<CardapioItem[]>({
    queryKey: ['cardapios'],
    queryFn: cardapioService.getCardapios,
  });

  const { data: campi, isLoading: isLoadingCampi } = useQuery<GenericItem[]>({
    queryKey: ['campi'],
    queryFn: campusService.getCampi,
  });

  const { data: blocos, isLoading: isLoadingBlocos } = useQuery<BlocoItem[]>({
    queryKey: ['blocos'],
    queryFn: blocoService.getBlocos,
  });

  const selectedCardapio = useMemo(() => {
    if (!pedido.cardapioId || !cardapios) return null;
    return cardapios.find(c => c.id === Number(pedido.cardapioId));
  }, [pedido.cardapioId, cardapios]);

  const blocosFiltrados = useMemo(() => {
    if (!pedido.campusId || !blocos) return [];
    return blocos.filter(b => b.campusId === Number(pedido.campusId));
  }, [pedido.campusId, blocos]);

  const mutation = useMutation({
    mutationFn: (newPedido: Omit<PedidoState, ''>) => {
      const payload = {
        ...newPedido,
        clienteId: Number(newPedido.clienteId),
        cardapioId: Number(newPedido.cardapioId),
        refeicaoId: Number(newPedido.refeicaoId),
        bebidaId: Number(newPedido.bebidaId),
        campusId: Number(newPedido.campusId),
        blocoId: Number(newPedido.blocoId),
        dataHora: new Date().toISOString(),
        status: "Recebido"
      };
      return pedidoService.createPedido(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pedidos'] });
      toast.success('Pedido criado com sucesso!');
      navigate('/listagem/pedido');
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar pedido: ${error.message}`);
    }
  });

  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;

    setPedido(prev => {
      const newState = { ...prev, [name]: value };
      if (name === 'clienteId') {
        newState.cardapioId = '';
        newState.refeicaoId = '';
        newState.bebidaId = '';
      }
      if (name === 'cardapioId') {
        newState.refeicaoId = '';
        newState.bebidaId = '';
      }
      if (name === 'campusId') {
        newState.blocoId = '';
      }
      return newState;
    });

    if (errors[name as keyof PedidoState]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<PedidoState> = {};
    if (!pedido.clienteId) newErrors.clienteId = 'Selecione um cliente.';
    if (!pedido.cardapioId) newErrors.cardapioId = 'Selecione um cardápio.';
    if (!pedido.refeicaoId) newErrors.refeicaoId = 'Selecione uma refeição.';
    if (!pedido.bebidaId) newErrors.bebidaId = 'Selecione uma bebida.';
    if (!pedido.campusId) newErrors.campusId = 'Selecione um campus.';
    if (!pedido.blocoId) newErrors.blocoId = 'Selecione um bloco.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Por favor, preencha todos os campos.');
      return;
    };
    mutation.mutate(pedido);
  };

  const isLoading = isLoadingClientes || isLoadingCardapios || isLoadingCampi || isLoadingBlocos;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header text-bg-light">
              <h2 className="mb-0">Novo Pedido</h2>
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
                    <label htmlFor="clienteId" className="form-label">Cliente</label>
                    <select id="clienteId" name="clienteId" className={`form-select ${errors.clienteId ? 'is-invalid' : ''}`} value={pedido.clienteId} onChange={handleChange}>
                      <option value="">Selecione um cliente</option>
                      {clientes?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                    </select>
                    {errors.clienteId && <div className="invalid-feedback">{errors.clienteId}</div>}
                  </div>

                  <div className="mb-3">
                    <label htmlFor="cardapioId" className="form-label">Cardápio do Dia</label>
                    <select id="cardapioId" name="cardapioId" className={`form-select ${errors.cardapioId ? 'is-invalid' : ''}`} value={pedido.cardapioId} onChange={handleChange} disabled={!pedido.clienteId}>
                      <option value="">Selecione um cardápio</option>
                      {cardapios?.map(c => <option key={c.id} value={c.id}>{c.descricao}</option>)}
                    </select>
                    {errors.cardapioId && <div className="invalid-feedback">{errors.cardapioId}</div>}
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="refeicaoId" className="form-label">Refeição</label>
                      <select id="refeicaoId" name="refeicaoId" className={`form-select ${errors.refeicaoId ? 'is-invalid' : ''}`} value={pedido.refeicaoId} onChange={handleChange} disabled={!pedido.cardapioId}>
                        <option value="">Selecione uma refeição</option>
                        {selectedCardapio?.refeicoes.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
                      </select>
                      {errors.refeicaoId && <div className="invalid-feedback">{errors.refeicaoId}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="bebidaId" className="form-label">Bebida</label>
                      <select id="bebidaId" name="bebidaId" className={`form-select ${errors.bebidaId ? 'is-invalid' : ''}`} value={pedido.bebidaId} onChange={handleChange} disabled={!pedido.cardapioId}>
                        <option value="">Selecione uma bebida</option>
                        {selectedCardapio?.bebidas.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                      </select>
                      {errors.bebidaId && <div className="invalid-feedback">{errors.bebidaId}</div>}
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="campusId" className="form-label">Campus</label>
                      <select id="campusId" name="campusId" className={`form-select ${errors.campusId ? 'is-invalid' : ''}`} value={pedido.campusId} onChange={handleChange}>
                        <option value="">Selecione um campus</option>
                        {campi?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                      </select>
                      {errors.campusId && <div className="invalid-feedback">{errors.campusId}</div>}
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="blocoId" className="form-label">Bloco</label>
                      <select id="blocoId" name="blocoId" className={`form-select ${errors.blocoId ? 'is-invalid' : ''}`} value={pedido.blocoId} onChange={handleChange} disabled={!pedido.campusId}>
                        <option value="">Selecione um bloco</option>
                        {blocosFiltrados.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                      </select>
                      {errors.blocoId && <div className="invalid-feedback">{errors.blocoId}</div>}
                    </div>
                  </div>

                  <div className="d-flex mt-3">
                    <button type="submit" className="btn btn-success me-2" disabled={mutation.isPending}>
                      {mutation.isPending ? 'Criando Pedido...' : 'Criar Pedido'}
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/')}>
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
}

export default Pedido;
