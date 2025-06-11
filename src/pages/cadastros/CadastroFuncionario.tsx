import { useState, type ChangeEvent, type FormEvent, type FC, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate, useParams } from 'react-router-dom';
import funcionarioService from '../../services/funcionarioService';
import { toast } from 'react-hot-toast';
import { maskCPF, maskPhone } from '../../utils/masks';

interface Funcionario {
  id?: number;
  nome: string;
  cpf: string;
  cargo: string;
  telefone: string;
  endereco: string;
}

const CadastroFuncionario: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [funcionario, setFuncionario] = useState<Omit<Funcionario, 'id'>>({
    nome: '',
    cpf: '',
    cargo: '',
    telefone: '',
    endereco: ''
  });
  const [errors, setErrors] = useState<Partial<Record<keyof Funcionario, string>>>({});
  const queryClient = useQueryClient();

  const { data: funcionarioToEdit, isLoading: isLoadingFuncionario } = useQuery({
    queryKey: ['funcionarios', id],
    queryFn: () => funcionarioService.getFuncionarioById(parseInt(id!)),
    enabled: isEditing,
  });

  useEffect(() => {
    if (funcionarioToEdit) {
      setFuncionario({
        nome: funcionarioToEdit.nome,
        cpf: maskCPF(funcionarioToEdit.cpf),
        cargo: funcionarioToEdit.cargo,
        telefone: maskPhone(funcionarioToEdit.telefone),
        endereco: funcionarioToEdit.endereco
      });
    }
  }, [funcionarioToEdit]);

  const mutation = useMutation({
    mutationFn: (updatedFuncionario: Omit<Funcionario, 'id'>) => {
      const payload = {
        ...updatedFuncionario,
        cpf: updatedFuncionario.cpf.replace(/\D/g, ''),
        telefone: updatedFuncionario.telefone.replace(/\D/g, ''),
      };
      if (isEditing) {
        return funcionarioService.updateFuncionario(parseInt(id!), payload);
      } else {
        return funcionarioService.createFuncionario(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['funcionarios'] });
      toast.success(isEditing ? 'Funcionário atualizado com sucesso!' : 'Funcionário cadastrado com sucesso!');
      navigate('/listagem/funcionario');
    },
    onError: (error: any) => {
      toast.error(`Erro: ${error.message}`);
    }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let maskedValue = value;
    if (name === 'cpf') {
      maskedValue = maskCPF(value);
    } else if (name === 'telefone') {
      maskedValue = maskPhone(value);
    }

    setFuncionario((prev) => ({ ...prev, [name]: maskedValue }));
    if (errors[name as keyof Funcionario]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<Record<keyof Funcionario, string>> = {};
    if (!funcionario.nome.trim()) newErrors.nome = 'O nome é obrigatório';
    if (!funcionario.cpf.trim()) newErrors.cpf = 'O CPF é obrigatório';
    if (!funcionario.cargo.trim()) newErrors.cargo = 'O cargo é obrigatório';
    if (!funcionario.telefone.trim()) newErrors.telefone = 'O telefone é obrigatório';
    if (!funcionario.endereco.trim()) newErrors.endereco = 'O endereço é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate(funcionario);
  };

  if (isLoadingFuncionario) {
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
              <h2 className="mb-0">{isEditing ? 'Alterar Funcionário' : 'Novo Funcionário'}</h2>
            </div>
            <div className="card-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="nome" className="form-label">Nome</label>
                  <input
                    type="text"
                    className={`form-control ${errors.nome ? 'is-invalid' : ''}`}
                    id="nome"
                    name="nome"
                    value={funcionario.nome}
                    onChange={handleChange}
                    autoFocus
                  />
                  {errors.nome && <div className="invalid-feedback">{errors.nome}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="cpf" className="form-label">CPF</label>
                  <input
                    type="text"
                    className={`form-control ${errors.cpf ? 'is-invalid' : ''}`}
                    id="cpf"
                    name="cpf"
                    maxLength={14}
                    value={funcionario.cpf}
                    onChange={handleChange}
                  />
                  {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="cargo" className="form-label">Cargo</label>
                  <input
                    type="text"
                    className={`form-control ${errors.cargo ? 'is-invalid' : ''}`}
                    id="cargo"
                    name="cargo"
                    value={funcionario.cargo}
                    onChange={handleChange}
                  />
                  {errors.cargo && <div className="invalid-feedback">{errors.cargo}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="telefone" className="form-label">Telefone</label>
                  <input
                    type="text"
                    className={`form-control ${errors.telefone ? 'is-invalid' : ''}`}
                    id="telefone"
                    name="telefone"
                    maxLength={15}
                    value={funcionario.telefone}
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
                    name="endereco"
                    value={funcionario.endereco}
                    onChange={handleChange}
                  />
                  {errors.endereco && <div className="invalid-feedback">{errors.endereco}</div>}
                </div>
                <div className="d-flex">
                  <button type="submit" className="btn btn-success me-2" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Funcionário')}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/listagem/funcionario')}>
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

export default CadastroFuncionario;