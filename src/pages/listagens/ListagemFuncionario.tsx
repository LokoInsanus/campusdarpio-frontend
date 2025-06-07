import { type FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import funcionarioService from '../../services/funcionarioService';

const ListagemFuncionario: FC = () => {
  const [funcionarios, setFuncionarios] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchFuncionarios = async () => {
    try {
      const list = await funcionarioService.getFuncionarios();
      setFuncionarios(list);
    } catch (err) {
      console.error('Erro ao buscar funcionarios:', err);
    }
  };

  useEffect(() => {
    fetchFuncionarios();
  }, []);

  const handleDelete = async (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este funcionario?');
    if (!confirma) return;

    try {
      await funcionarioService.deleteFuncionario(id);
      await fetchFuncionarios();
    } catch (err) {
      console.error('Erro ao excluir funcionario:', err);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/cadastrar/funcionario/${id}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Funcionários</h1>
        <Link to="/cadastro/funcionario" className="btn btn-primary">
          Novo Funcionário
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>CPF</th>
            <th>Cargo</th>
            <th>Telefone</th>
            <th>Endereço</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {funcionarios.length > 0 ? (
            funcionarios.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.cpf}</td>
                <td>{c.cargo}</td>
                <td>{c.telefone}</td>
                <td>{c.endereco}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEdit(c.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(c.id)}
                  >
                    Excluir
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center">
                Carregando funcionarios…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListagemFuncionario;
