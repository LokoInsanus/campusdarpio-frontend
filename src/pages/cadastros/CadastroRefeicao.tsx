import { useState, type ChangeEvent, type FormEvent, type FC, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import refeicaoService from '../../services/refeicaoService';
import { toast } from 'react-hot-toast';
import { maskCurrency } from '../../utils/masks';

interface Refeicao {
  id?: number;
  nome: string;
  descricao: string;
  tipo: string;
  preco: string;
  quantidade: string;
}

const CadastroRefeicao: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [refeicao, setRefeicao] = useState<Omit<Refeicao, 'id'>>({
    nome: '',
    descricao: '',
    tipo: '',
    preco: '',
    quantidade: ''
  });
  const [errors, setErrors] = useState<Partial<Refeicao>>({});
  const queryClient = useQueryClient();

  const { data: refeicaoToEdit, isLoading: isLoadingRefeicao } = useQuery({
    queryKey: ['refeicoes', id],
    queryFn: () => refeicaoService.getRefeicaoById(parseInt(id!)),
    enabled: isEditing,
  });

  useEffect(() => {
    if (refeicaoToEdit) {
      setRefeicao({
        nome: refeicaoToEdit.nome,
        descricao: refeicaoToEdit.descricao,
        tipo: refeicaoToEdit.tipo,
        preco: maskCurrency(String(Number(refeicaoToEdit.preco) * 100)),
        quantidade: refeicaoToEdit.quantidade
      });
    }
  }, [refeicaoToEdit]);

  const mutation = useMutation({
    mutationFn: (formData: Omit<Refeicao, 'id'>) => {
      const payload = {
        ...formData,
        preco: formData.preco.replace(/\D/g, ''),
      };
      if (isEditing) {
        return refeicaoService.updateRefeicao(parseInt(id!), payload);
      } else {
        return refeicaoService.createRefeicao(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['refeicoes'] });
      toast.success(isEditing ? 'Refeição atualizada com sucesso!' : 'Refeição cadastrada com sucesso!');
      navigate('/listagem/refeicao');
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === 'preco') {
      maskedValue = maskCurrency(value);
    }
    setRefeicao((prev) => ({ ...prev, [name]: maskedValue }));

    if (errors[name as keyof Refeicao]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Refeicao> = {};
    if (!refeicao.nome.trim()) newErrors.nome = 'O nome é obrigatório';
    if (!refeicao.descricao.trim()) newErrors.descricao = 'A descrição é obrigatória';
    if (!refeicao.tipo.trim()) newErrors.tipo = 'O tipo é obrigatório';
    if (!refeicao.preco.trim() || Number(refeicao.preco.replace(/\D/g, '')) === 0) newErrors.preco = 'O preço é obrigatório';
    if (!refeicao.quantidade.trim()) newErrors.quantidade = 'A quantidade é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate(refeicao);
  };

  if (isLoadingRefeicao) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-header text-bg-light">
              <h2 className="mb-0">{isEditing ? 'Alterar Refeição' : 'Nova Refeição'}</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label">Nome</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                    id="nome"
                    name='nome'
                    value={refeicao.nome}
                    onChange={handleChange} autoFocus
                  />
                  {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="descricao" className="form-label">Descrição</label>
                  <input
                    type="text"
                    className={`form-control ${errors.descricao ? 'is-invalid' : ''}`}
                    id="descricao"
                    name='descricao'
                    value={refeicao.descricao}
                    onChange={handleChange}
                  />
                  {errors.descricao && <div className="invalid-feedback">{errors.descricao}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="tipo" className="form-label">Tipo</label>
                  <input
                    type="text"
                    className={`form-control ${errors.tipo ? 'is-invalid' : ''}`}
                    id="tipo"
                    name='tipo'
                    value={refeicao.tipo}
                    onChange={handleChange}
                  />
                  {errors.tipo && <div className="invalid-feedback">{errors.tipo}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="preco" className="form-label">Preço</label>
                  <input
                    type="text"
                    className={`form-control ${errors.preco ? 'is-invalid' : ''}`}
                    id="preco"
                    name='preco'
                    value={refeicao.preco}
                    onChange={handleChange}
                    placeholder="R$ 0,00"
                  />
                  {errors.preco && <div className="invalid-feedback">{errors.preco}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="quantidade" className="form-label">Quantidade</label>
                  <input
                    type="number"
                    className={`form-control ${errors.quantidade ? 'is-invalid' : ''}`}
                    id="quantidade"
                    name='quantidade'
                    value={refeicao.quantidade}
                    onChange={handleChange}
                  />
                  {errors.quantidade && <div className="invalid-feedback">{errors.quantidade}</div>}
                </div>
                <div className="d-flex">
                  <button type="submit" className="btn btn-success me-2" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Refeição')}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/listagem/refeicao')}>
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroRefeicao;