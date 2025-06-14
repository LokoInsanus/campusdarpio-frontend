import { useState, type ChangeEvent, type FormEvent, type FC, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import entregadorService from '../../services/entregadorService';
import { toast } from 'react-hot-toast';
import { maskCNH, maskPhone, maskCPF } from '../../utils/masks';

interface EntregadorForm {
  nome: string;
  cnh: string;
  cpf: string;
  veiculo: string;
  telefone: string;
  endereco: string;
}

const CadastroEntregador: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [entregador, setEntregador] = useState<EntregadorForm>({
    nome: '',
    cnh: '',
    cpf: '',
    veiculo: '',
    telefone: '',
    endereco: ''
  });
  const [errors, setErrors] = useState<Partial<EntregadorForm>>({});
  const queryClient = useQueryClient();

  const { data: entregadorToEdit, isLoading: isLoadingEntregador } = useQuery({
    queryKey: ['entregadores', id],
    queryFn: () => entregadorService.getEntregadorById(parseInt(id!)),
    enabled: isEditing,
  });

  useEffect(() => {
    if (entregadorToEdit) {
      setEntregador({
        nome: entregadorToEdit.nome,
        cnh: maskCNH(entregadorToEdit.cnh),
        // @ts-ignore
        cpf: maskCPF(entregadorToEdit.cpf || ''),
        // @ts-ignore
        veiculo: entregadorToEdit.veiculo || '',
        telefone: maskPhone(entregadorToEdit.telefone),
        endereco: entregadorToEdit.endereco,
      });
    }
  }, [entregadorToEdit]);

  const mutation = useMutation({
    mutationFn: (formData: EntregadorForm) => {
      const payload = {
        ...formData,
        cnh: formData.cnh.replace(/\D/g, ''),
        cpf: formData.cpf.replace(/\D/g, ''),
        telefone: formData.telefone.replace(/\D/g, ''),
        status: 'ativo'
      };
      if (isEditing) {
        return entregadorService.updateEntregador(parseInt(id!), payload);
      } else {
        return entregadorService.createEntregador(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['entregadores'] });
      toast.success(isEditing ? 'Entregador atualizado com sucesso!' : 'Entregador cadastrado com sucesso!');
      navigate('/listagem/entregador');
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === 'cnh') {
      maskedValue = maskCNH(value);
    } else if (name === 'telefone') {
      maskedValue = maskPhone(value);
    } else if (name === 'cpf') {
      maskedValue = maskCPF(value);
    }

    setEntregador((prev) => ({ ...prev, [name]: maskedValue }));
    if (errors[name as keyof EntregadorForm]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<EntregadorForm> = {};
    if (!entregador.nome.trim()) newErrors.nome = 'O nome é obrigatório';
    if (!entregador.cnh.trim()) newErrors.cnh = 'A CNH é obrigatória';
    if (!entregador.cpf.trim()) newErrors.cpf = 'O CPF é obrigatório';
    if (!entregador.veiculo.trim()) newErrors.veiculo = 'O veículo é obrigatório';
    if (!entregador.telefone.trim()) newErrors.telefone = 'O telefone é obrigatório';
    if (!entregador.endereco.trim()) newErrors.endereco = 'O endereço é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate(entregador);
  };

  if (isLoadingEntregador) {
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
              <h2 className="mb-0">{isEditing ? `Alterar Entregador: ${entregadorToEdit?.nome || ''}` : 'Novo Entregador'}</h2>
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
                    value={entregador.nome}
                    onChange={handleChange} autoFocus
                  />
                  {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="cpf" className="form-label">CPF</label>
                  <input
                    type="text"
                    className={`form-control ${errors.cpf ? 'is-invalid' : ''}`}
                    id="cpf"
                    name='cpf'
                    maxLength={14}
                    value={entregador.cpf}
                    onChange={handleChange}
                  />
                  {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="cnh" className="form-label">CNH</label>
                  <input
                    type="text"
                    className={`form-control ${errors.cnh ? 'is-invalid' : ''}`}
                    id="cnh"
                    name='cnh'
                    maxLength={11}
                    value={entregador.cnh}
                    onChange={handleChange}
                  />
                  {errors.cnh && <div className="invalid-feedback">{errors.cnh}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="veiculo" className="form-label">Veículo</label>
                  <input
                    type="text"
                    className={`form-control ${errors.veiculo ? 'is-invalid' : ''}`}
                    id="veiculo"
                    name='veiculo'
                    value={entregador.veiculo}
                    onChange={handleChange}
                    placeholder="Ex: Moto Honda CG 160"
                  />
                  {errors.veiculo && <div className="invalid-feedback">{errors.veiculo}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="telefone" className="form-label">Telefone</label>
                  <input
                    type="text"
                    className={`form-control ${errors.telefone ? 'is-invalid' : ''}`}
                    id="telefone"
                    name='telefone'
                    maxLength={15}
                    value={entregador.telefone}
                    onChange={handleChange}
                  />
                  {errors.telefone && <div className="invalid-feedback">{errors.telefone}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="endereco" className="form-label">Endereço</label>
                  <input
                    type="text"
                    className={`form-control ${errors.endereco ? 'is-invalid' : ''}`}
                    id="endereco"
                    name='endereco'
                    value={entregador.endereco}
                    onChange={handleChange}
                  />
                  {errors.endereco && <div className="invalid-feedback">{errors.endereco}</div>}
                </div>
                <div className="d-flex">
                  <button type="submit" className="btn btn-success me-2" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Entregador')}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/listagem/entregador')}>
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

export default CadastroEntregador;
