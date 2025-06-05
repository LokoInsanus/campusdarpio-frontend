import { type FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import clienteService from '../../services/ClienteService';

const ListagemCliente: FC = () => {
  const [clientes, setClientes] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchClientes = async () => {
    try {
      const list = await clienteService.getClientes();
      setClientes(list);
    } catch (err) {
      console.error('Erro ao buscar clientes:', err);
    }
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleDelete = async (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este cliente?');
    if (!confirma) return;

    try {
      await clienteService.deleteCliente(id);
      await fetchClientes();
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/cadastrar/cliente/${id}`);
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Clientes</h1>
        <Link to="/cadastro/cliente" className="btn btn-primary">
          Novo Cliente
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>Status</th>
            <th>Telefone</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {clientes.length > 0 ? (
            clientes.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{c.nome}</td>
                <td>{c.status}</td>
                <td>{c.telefone}</td>
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
              <td colSpan={5} className="text-center">
                Carregando clientes…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListagemCliente;
