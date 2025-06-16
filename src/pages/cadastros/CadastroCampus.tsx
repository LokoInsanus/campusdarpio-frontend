import { useState, type ChangeEvent, type FormEvent, type FC, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import campusService from '../../services/campusService';
import { toast } from 'react-hot-toast';

interface Campus {
  id?: number;
  nome: string;
  endereco: string;
  quantidadeBlocos: number | '';
}

const CadastroCampus: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [campus, setCampus] = useState<Campus>({
    nome: '',
    endereco: '',
    quantidadeBlocos: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Campus, string>>>({});
  const queryClient = useQueryClient();

  const { data: campusToEdit, isLoading: isLoadingCampus } = useQuery({
    queryKey: ['campi', id],
    queryFn: () => campusService.getCampusById(parseInt(id!)),
    enabled: isEditing,
  });

  useEffect(() => {
    if (campusToEdit) {
      setCampus({
        nome: campusToEdit.nome,
        endereco: campusToEdit.endereco,
        quantidadeBlocos: campusToEdit.quantidadeBlocos
      });
    }
  }, [campusToEdit]);

  const mutation = useMutation({
    mutationFn: (campusData: Campus) => {
      // O payload agora inclui o status: true em ambos os casos
      const payload = {
        nome: campusData.nome,
        endereco: campusData.endereco,
        quantidadeBlocos: Number(campusData.quantidadeBlocos),
        status: true
      };

      if (isEditing) {
        return campusService.updateCampus(parseInt(id!), payload);
      } else {
        return campusService.createCampus(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campi'] });
      toast.success(isEditing ? 'Campus atualizado com sucesso!' : 'Campus cadastrado com sucesso!');
      navigate('/listagem/campus');
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCampus((prev) => ({
      ...prev,
      [name]: name === 'quantidadeBlocos' ? (value === '' ? '' : Number(value)) : value
    }));
    if (errors[name as keyof Campus]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Campus, string>> = {};
    if (!campus.nome.trim()) newErrors.nome = 'O nome é obrigatório';
    if (!campus.endereco.trim()) newErrors.endereco = 'O endereço é obrigatório';
    if (campus.quantidadeBlocos === '' || isNaN(Number(campus.quantidadeBlocos)) || Number(campus.quantidadeBlocos) <= 0) {
      newErrors.quantidadeBlocos = 'A quantidade de blocos deve ser um número maior que zero';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate(campus);
  };

  if (isLoadingCampus) {
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
              <h2 className="mb-0">{isEditing ? 'Alterar Campus' : 'Novo Campus'}</h2>
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
                    value={campus.nome}
                    onChange={handleChange} autoFocus
                  />
                  {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="endereco" className="form-label">Endereço</label>
                  <input
                    type="text"
                    className={`form-control ${errors.endereco ? 'is-invalid' : ''}`}
                    id="endereco"
                    name='endereco'
                    value={campus.endereco}
                    onChange={handleChange}
                  />
                  {errors.endereco && <div className="invalid-feedback">{errors.endereco}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="quantidadeBlocos" className="form-label">Quantidade de Blocos</label>
                  <input
                    type="number"
                    min={1}
                    className={`form-control ${errors.quantidadeBlocos ? 'is-invalid' : ''}`}
                    id="quantidadeBlocos"
                    name='quantidadeBlocos'
                    value={campus.quantidadeBlocos}
                    onChange={handleChange}
                  />
                  {errors.quantidadeBlocos && <div className="invalid-feedback">{errors.quantidadeBlocos}</div>}
                </div>
                <div className="d-flex">
                  <button type="submit" className="btn btn-success me-2" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Campus')}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/listagem/campus')}>
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

export default CadastroCampus;