import { useState, type ChangeEvent, type FormEvent, type FC, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import blocoService from '../../services/blocoService';
import campusService from '../../services/campusService';
import { toast } from 'react-hot-toast';

interface Campus {
  id: number;
  nome: string;
}

interface Bloco {
  id?: number;
  nome: string;
  tipo: string;
  capacidade: number | '';
  descricao: string;
  campusId: number | '';
}

const CadastroBloco: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [bloco, setBloco] = useState<Omit<Bloco, 'id'>>({
    nome: '',
    tipo: '',
    capacidade: '',
    descricao: '',
    campusId: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Bloco, string>>>({});
  const queryClient = useQueryClient();

  const { data: campi, isLoading: isLoadingCampi } = useQuery<Campus[]>({
    queryKey: ['campi'],
    queryFn: campusService.getCampi,
  });

  const { data: blocoToEdit, isLoading: isLoadingBloco } = useQuery({
    queryKey: ['blocos', id],
    queryFn: () => blocoService.getBlocoById(parseInt(id!)),
    enabled: isEditing,
  });

  useEffect(() => {
    if (blocoToEdit) {
      setBloco({
        nome: blocoToEdit.nome,
        tipo: blocoToEdit.tipo,
        capacidade: blocoToEdit.capacidade,
        descricao: blocoToEdit.descricao,
        campusId: blocoToEdit.campusId
      });
    }
  }, [blocoToEdit]);

  const mutation = useMutation({
    mutationFn: (updatedBloco: Omit<Bloco, 'id'>) => {
      const payload = {
        nome: updatedBloco.nome,
        tipo: Number(updatedBloco.tipo),
        capacidade: Number(updatedBloco.capacidade),
        descricao: updatedBloco.descricao,
        campus: Number(updatedBloco.campusId)
      };

      if (isEditing) {
        return blocoService.updateBloco(parseInt(id!), payload);
      } else {
        return blocoService.createBloco(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blocos'] });
      toast.success(isEditing ? 'Bloco atualizado com sucesso!' : 'Bloco cadastrado com sucesso!');
      navigate('/listagem/bloco');
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBloco((prev) => ({
      ...prev,
      [name]: name === 'campusId' ? (value === '' ? '' : Number(value)) : value
    }));
    if (errors[name as keyof Bloco]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Bloco, string>> = {};
    if (!bloco.nome.trim()) newErrors.nome = 'O nome é obrigatório';
    if (!bloco.tipo.trim()) newErrors.tipo = 'O tipo é obrigatório';
    if (!bloco.capacidade.toString().trim()) newErrors.capacidade = 'A capacidade é obrigatória';
    if (!bloco.descricao.trim()) newErrors.descricao = 'A descrição é obrigatória';
    if (!bloco.campusId) newErrors.campusId = 'A seleção do campus é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate(bloco);
  };

  if (isLoadingBloco || isLoadingCampi) {
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
              <h2 className="mb-0">{isEditing ? 'Alterar Bloco' : 'Novo Bloco'}</h2>
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
                    value={bloco.nome}
                    onChange={handleChange} autoFocus
                  />
                  {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="tipo" className="form-label">Tipo</label>
                  <input
                    type="number"
                    className={`form-control ${errors.tipo ? 'is-invalid' : ''}`}
                    id="tipo"
                    name='tipo'
                    value={bloco.tipo}
                    onChange={handleChange}
                  />
                  {errors.tipo && <div className="invalid-feedback">{errors.tipo}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="capacidade" className="form-label">Capacidade</label>
                  <input
                    type="number"
                    className={`form-control ${errors.capacidade ? 'is-invalid' : ''}`}
                    id="capacidade"
                    name='capacidade'
                    value={bloco.capacidade}
                    onChange={handleChange}
                  />
                  {errors.capacidade && <div className="invalid-feedback">{errors.capacidade}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="descricao" className="form-label">Descrição</label>
                  <textarea
                    className={`form-control ${errors.descricao ? 'is-invalid' : ''}`}
                    id="descricao"
                    name='descricao'
                    value={bloco.descricao}
                    onChange={handleChange}
                  />
                  {errors.descricao && <div className="invalid-feedback">{errors.descricao}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="campusId" className="form-label">Campus</label>
                  <select
                    id="campusId"
                    name="campusId"
                    className={`form-select ${errors.campusId ? 'is-invalid' : ''}`}
                    value={bloco.campusId}
                    onChange={handleChange}
                  >
                    <option value="">Selecione um campus</option>
                    {campi?.map(campus => (
                      <option key={campus.id} value={campus.id}>
                        {campus.nome}
                      </option>
                    ))}
                  </select>
                  {errors.campusId && <div className="invalid-feedback">{errors.campusId}</div>}
                </div>
                <div className="d-flex">
                  <button type="submit" className="btn btn-success me-2" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Bloco')}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/listagem/bloco')}>
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

export default CadastroBloco;
