import { type FC, useState, type FormEvent } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

import refeicaoService from '../services/refeicaoService';
import bebidaService from '../services/bebidaService';
import cardapioService from '../services/cardapioService';

interface Item { id: number; nome: string; }
interface CardapioState {
  data: string;
  descricao: string;
  refeicoes: Item[];
  bebidas: Item[];
}

const Cardapio: FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [cardapio, setCardapio] = useState<CardapioState>({
    data: '',
    descricao: '',
    refeicoes: [],
    bebidas: [],
  });

  const [selectedRefeicaoId, setSelectedRefeicaoId] = useState<string>('');
  const [selectedBebidaId, setSelectedBebidaId] = useState<string>('');

  const { data: todasAsRefeicoes, isLoading: isLoadingRefeicoes } = useQuery<Item[]>({
    queryKey: ['refeicoes'],
    queryFn: refeicaoService.getRefeicoes,
  });
  const { data: todasAsBebidas, isLoading: isLoadingBebidas } = useQuery<Item[]>({
    queryKey: ['bebidas'],
    queryFn: bebidaService.getBebidas,
  });

  const handleAddItem = (type: 'refeicao' | 'bebida') => {
    const idToAdd = type === 'refeicao' ? selectedRefeicaoId : selectedBebidaId;
    if (!idToAdd) return;

    const sourceList = type === 'refeicao' ? todasAsRefeicoes : todasAsBebidas;
    const itemToAdd = sourceList?.find(item => item.id === Number(idToAdd));

    if (itemToAdd) {
      setCardapio(prev => {
        const currentList = prev[type === 'refeicao' ? 'refeicoes' : 'bebidas'];
        if (currentList.some(item => item.id === itemToAdd.id)) {
          toast.error(`${type === 'refeicao' ? 'Refeição' : 'Bebida'} já adicionada.`);
          return prev;
        }
        return {
          ...prev,
          [type === 'refeicao' ? 'refeicoes' : 'bebidas']: [...currentList, itemToAdd]
        };
      });
    }
  };

  const handleRemoveItem = (type: 'refeicao' | 'bebida', idToRemove: number) => {
    setCardapio(prev => ({
      ...prev,
      [type === 'refeicao' ? 'refeicoes' : 'bebidas']: prev[type === 'refeicao' ? 'refeicoes' : 'bebidas'].filter(item => item.id !== idToRemove)
    }));
  };

  const mutation = useMutation({
    mutationFn: (newCardapio: CardapioState) => {
      const payload = {
        data: newCardapio.data,
        descricao: newCardapio.descricao,
        refeicaoIds: newCardapio.refeicoes.map(r => r.id),
        bebidaIds: newCardapio.bebidas.map(b => b.id),
      };
      return cardapioService.createCardapio(payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cardapios'] });
      toast.success('Cardápio criado com sucesso!');
      navigate('/listagem/cardapio');
    },
    onError: (error: any) => {
      toast.error(`Erro ao criar cardápio: ${error.message}`);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cardapio.data) {
      toast.error('Por favor, selecione uma data para o cardápio.');
      return;
    }
    if (cardapio.refeicoes.length === 0 && cardapio.bebidas.length === 0) {
      toast.error('Adicione pelo menos uma refeição ou bebida ao cardápio.');
      return;
    }
    mutation.mutate(cardapio);
  };

  const isLoading = isLoadingRefeicoes || isLoadingBebidas;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-9">
          <div className="card">
            <div className="card-header text-bg-light">
              <h2 className="mb-0">Montar Cardápio</h2>
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
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="data" className="form-label">Data do Cardápio</label>
                      <input
                        type="date"
                        id="data"
                        name="data"
                        className="form-control"
                        value={cardapio.data}
                        onChange={e => setCardapio(prev => ({ ...prev, data: e.target.value }))}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="descricao" className="form-label">Descrição</label>
                      <input
                        type="text"
                        id="descricao"
                        name="descricao"
                        placeholder="Ex: Cardápio de Segunda-Feira"
                        className="form-control"
                        value={cardapio.descricao}
                        onChange={e => setCardapio(prev => ({ ...prev, descricao: e.target.value }))}
                      />
                    </div>
                  </div>

                  <fieldset disabled={!cardapio.data} className="mb-3">
                    <label htmlFor="refeicaoSelect" className="form-label">Refeições</label>
                    <div className="input-group">
                      <select id="refeicaoSelect" className="form-select" value={selectedRefeicaoId} onChange={e => setSelectedRefeicaoId(e.target.value)}>
                        <option value="">Selecione para adicionar...</option>
                        {todasAsRefeicoes?.map(r => <option key={r.id} value={r.id}>{r.nome}</option>)}
                      </select>
                      <button className="btn btn-outline-primary" type="button" onClick={() => handleAddItem('refeicao')}>Adicionar</button>
                    </div>
                  </fieldset>

                  <fieldset disabled={!cardapio.data} className="mb-4">
                    <label htmlFor="bebidaSelect" className="form-label">Bebidas</label>
                    <div className="input-group">
                      <select id="bebidaSelect" className="form-select" value={selectedBebidaId} onChange={e => setSelectedBebidaId(e.target.value)}>
                        <option value="">Selecione para adicionar...</option>
                        {todasAsBebidas?.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                      </select>
                      <button className="btn btn-outline-primary" type="button" onClick={() => handleAddItem('bebida')}>Adicionar</button>
                    </div>
                  </fieldset>

                  <div className="row">
                    <div className="col-md-6">
                      <h5>Refeições no Cardápio</h5>
                      {cardapio.refeicoes.length > 0 ? (
                        <ul className="list-group">
                          {cardapio.refeicoes.map(r => (
                            <li key={r.id} className="list-group-item d-flex justify-content-between align-items-center">
                              {r.nome}
                              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveItem('refeicao', r.id)}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : <p className="text-muted">Nenhuma refeição adicionada.</p>}
                    </div>
                    <div className="col-md-6">
                      <h5>Bebidas no Cardápio</h5>
                      {cardapio.bebidas.length > 0 ? (
                        <ul className="list-group">
                          {cardapio.bebidas.map(b => (
                            <li key={b.id} className="list-group-item d-flex justify-content-between align-items-center">
                              {b.nome}
                              <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => handleRemoveItem('bebida', b.id)}>
                                <i className="bi bi-trash"></i>
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : <p className="text-muted">Nenhuma bebida adicionada.</p>}
                    </div>
                  </div>

                  <div className="d-flex mt-4">
                    <button type="submit" className="btn btn-success me-2" disabled={mutation.isPending}>
                      {mutation.isPending ? 'Salvando...' : 'Salvar Cardápio'}
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
};

export default Cardapio;
