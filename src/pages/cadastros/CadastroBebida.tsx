import { useState, type ChangeEvent, type FormEvent, type FC, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import bebidaService from '../../services/bebidaService';
import { toast } from 'react-hot-toast';
import { maskCurrency } from '../../utils/masks';

interface BebidaForm {
  nome: string;
  tipo: string;
  preco: string;
}

const CadastroBebida: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [bebida, setBebida] = useState<BebidaForm>({
    nome: '',
    tipo: '',
    preco: '',
  });

  const [errors, setErrors] = useState<Partial<BebidaForm>>({});
  const queryClient = useQueryClient();

  const { data: bebidaToEdit, isLoading: isLoadingBebida } = useQuery({
    queryKey: ['bebidas', id],
    queryFn: () => bebidaService.getBebidaById(parseInt(id!)),
    enabled: isEditing,
  });

  useEffect(() => {
    if (bebidaToEdit) {
      setBebida({
        nome: bebidaToEdit.nome,
        tipo: bebidaToEdit.tipo,
        preco: maskCurrency(String(Number(bebidaToEdit.preco) * 100)),
      });
    }
  }, [bebidaToEdit]);

  const mutation = useMutation({
    mutationFn: (formData: BebidaForm) => {
      const payload = {
        nome: formData.nome,
        tipo: formData.tipo,
        preco: Number(formData.preco.replace(/\D/g, '')) / 100,
        quantidade: 0,
      };

      if (isEditing) {
        return bebidaService.updateBebida(parseInt(id!), payload);
      } else {
        return bebidaService.createBebida(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bebidas'] });
      toast.success(isEditing ? 'Bebida atualizada com sucesso!' : 'Bebida cadastrada com sucesso!');
      navigate('/listagem/bebida');
    },
    onError: (error: any) => {
      const apiError = error.response?.data?.message || error.message;
      toast.error(`Erro ao salvar: ${apiError}`);
    }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBebida((prev) => ({
      ...prev,
      [name]: name === 'preco' ? maskCurrency(value) : value,
    }));
    if (errors[name as keyof BebidaForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<BebidaForm> = {};
    if (!bebida.nome.trim()) newErrors.nome = 'O nome é obrigatório';
    if (!bebida.tipo.trim()) newErrors.tipo = 'O tipo é obrigatório';
    if (!bebida.preco.trim() || Number(bebida.preco.replace(/\D/g, '')) === 0) newErrors.preco = 'O preço é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validateForm()) {
      mutation.mutate(bebida);
    }
  };

  if (isLoadingBebida) {
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
              <h2 className="mb-0">{isEditing ? `Alterar Bebida: ${bebidaToEdit?.nome || ''}` : 'Nova Bebida'}</h2>
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
                    value={bebida.nome}
                    onChange={handleChange} autoFocus
                  />
                  {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="tipo" className="form-label">Tipo</label>
                  <input
                    type="text"
                    className={`form-control ${errors.tipo ? 'is-invalid' : ''}`}
                    id="tipo"
                    name='tipo'
                    value={bebida.tipo}
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
                    value={bebida.preco}
                    onChange={handleChange}
                    placeholder="R$ 0,00"
                  />
                  {errors.preco && <div className="invalid-feedback">{errors.preco}</div>}
                </div>

                <div className="d-flex">
                  <button type="submit" className="btn btn-success me-2" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Bebida')}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/listagem/bebida')}>
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

export default CadastroBebida;
