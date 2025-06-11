import { type FC, useState, useEffect, type ChangeEvent, type FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import clienteService from '../../services/clienteService';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

interface ClientForm {
  nome: string;
  cpf: string;
  telefone: string;
  endereco: string;
}

const CadastroCliente: FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);

  const [client, setClient] = useState<ClientForm>({
    nome: '',
    cpf: '',
    telefone: '',
    endereco: ''
  });
  const [errors, setErrors] = useState<Partial<ClientForm>>({});
  const queryClient = useQueryClient();

  const { data: clientToEdit, isLoading: isLoadingClient } = useQuery({
    queryKey: ['clientes', id],
    queryFn: () => clienteService.getClienteById(parseInt(id!)),
    enabled: isEditing,
  });

  useEffect(() => {
    if (clientToEdit) {
      setClient({
        nome: clientToEdit.nome,
        cpf: clientToEdit.cpf,
        telefone: clientToEdit.telefone,
        endereco: clientToEdit.endereco
      });
    }
  }, [clientToEdit]);

  const mutation = useMutation({
    mutationFn: (formData: ClientForm) => {
      if (isEditing) {
        return clienteService.updateCliente(parseInt(id!), formData);
      } else {
        const payload = { ...formData, status: 'disponível' };
        return clienteService.createCliente(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clientes'] });
      toast.success(isEditing ? 'Cliente atualizado com sucesso!' : 'Cliente criado com sucesso!');
      navigate('/listagem/cliente');
    },
    onError: (error: any) => {
      toast.error(`Ocorreu um erro: ${error.response?.data?.message || error.message}`);
    }
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setClient(prev => ({ ...prev, [name]: value }));
    if (errors[name as keyof ClientForm]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<ClientForm> = {};
    if (!client.nome.trim()) newErrors.nome = 'O nome é obrigatório';
    if (!client.cpf.trim()) newErrors.cpf = 'O CPF é obrigatório';
    if (!client.telefone.trim()) newErrors.telefone = 'O telefone é obrigatório';
    if (!client.endereco.trim()) newErrors.endereco = 'O endereço é obrigatório';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!validateForm()) return;
    mutation.mutate(client);
  };

  if (isLoadingClient) {
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
              <h2 className="mb-0">{isEditing ? `Alterar Cliente: ${clientToEdit?.nome || ''}` : 'Novo Cliente'}</h2>
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
                    value={client.nome}
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
                    name="cpf"
                    value={client.cpf}
                    onChange={handleChange}
                  />
                  {errors.cpf && <div className="invalid-feedback">{errors.cpf}</div>}
                </div>
                <div className="mb-3">
                  <label htmlFor="telefone" className="form-label">Telefone</label>
                  <input
                    type="text"
                    className={`form-control ${errors.telefone ? 'is-invalid' : ''}`}
                    id="telefone"
                    name="telefone"
                    value={client.telefone}
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
                    value={client.endereco}
                    onChange={handleChange}
                  />
                  {errors.endereco && <div className="invalid-feedback">{errors.endereco}</div>}
                </div>
                <div className="d-flex">
                  <button type="submit" className="btn btn-success me-2" disabled={mutation.isPending}>
                    {mutation.isPending ? 'Salvando...' : (isEditing ? 'Salvar Alterações' : 'Salvar Cliente')}
                  </button>
                  <button type="button" className="btn btn-secondary" onClick={() => navigate('/listagem/cliente')}>
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

export default CadastroCliente;