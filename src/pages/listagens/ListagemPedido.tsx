import { type FC, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import pedidoService from '../../services/pedidoService';
import clienteService from '../../services/clienteService';
import cardapioService from '../../services/cardapioService';
import refeicaoService from '../../services/refeicaoService';
import bebidaService from '../../services/bebidaService';
import campusService from '../../services/campusService';
import blocoService from '../../services/blocoService';

const ListagemPedido: FC = () => {
  const [pedidos, setPedidos] = useState<any[]>([]);
  const [clientes, setClientes] = useState<{ [key: number]: string }>({});
  const [cardapios, setCardapios] = useState<{ [key: number]: string }>({});
  const [refeicoes, setRefeicoes] = useState<{ [key: number]: string }>({});
  const [bebidas, setBebidas] = useState<{ [key: number]: string }>({});
  const [campus, setCampus] = useState<{ [key: number]: string }>({});
  const [blocos, setBlocos] = useState<{ [key: number]: string }>({});
  const navigate = useNavigate();

  const fetchPedidos = async () => {
    try {
      const list = await pedidoService.getPedidos();
      setPedidos(list);
    } catch (err) {
      console.error('Erro ao buscar pedidos:', err);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleDelete = async (id: number) => {
    const confirma = window.confirm('Deseja realmente excluir este pedido?');
    if (!confirma) return;

    try {
      await pedidoService.deletePedido(id);
      await fetchPedidos();
    } catch (err) {
      console.error('Erro ao excluir pedido:', err);
    }
  };

  const handleEdit = (id: number) => {
    navigate(`/cadastrar/pedido/${id}`);
  };

  const getClienteName = (id: number) => {
    if (clientes[id]) return clientes[id];
    clienteService.getClienteById(id).then(cliente => {
      setClientes(prev => ({ ...prev, [id]: cliente ? cliente.nome : 'Desconhecido' }));
    });

    return clientes[id] || 'Carregando...';
  };

  const getCardapioName = (id: number) => {
    if (cardapios[id]) return cardapios[id];
    cardapioService.getCardapioById(id).then(cardapio => {
      setCardapios(prev => ({ ...prev, [id]: cardapio ? cardapio.descricao : 'Desconhecido' }));
    });

    return cardapios[id] || 'Carregando...';
  };

  const getRefeicaoName = (id: number) => {
    if (refeicoes[id]) return refeicoes[id];
    refeicaoService.getRefeicaoById(id).then(refeicao => {
      setRefeicoes(prev => ({ ...prev, [id]: refeicao ? refeicao.nome : 'Desconhecido' }));
    });

    return refeicoes[id] || 'Carregando...';
  };

  const getBebidaName = (id: number) => {
    if (bebidas[id]) return bebidas[id];
    bebidaService.getBebidaById(id).then(bebida => {
      setBebidas(prev => ({ ...prev, [id]: bebida ? bebida.nome : 'Desconhecido' }));
    });

    return bebidas[id] || 'Carregando...';
  };

  const getCampusName = (id: number) => {
    if (campus[id]) return campus[id];
    campusService.getCampusById(id).then(campusData => {
      setCampus(prev => ({ ...prev, [id]: campusData ? campusData.nome : 'Desconhecido' }));
    });

    return campus[id] || 'Carregando...';
  };

  const getBlocoName = (id: number) => {
    if (blocos[id]) return blocos[id];
    blocoService.getBlocoById(id).then(bloco => {
      setBlocos(prev => ({ ...prev, [id]: bloco ? bloco.nome : 'Desconhecido' }));
    });

    return blocos[id] || 'Carregando...';
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="mb-0">Pedidos</h1>
        <Link to="/cadastro/pedido" className="btn btn-primary">
          Novo Pedido
        </Link>
      </div>
      <table className="table table-striped align-items-center text-center">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cliente</th>
            <th>Cardapio</th>
            <th>Refeição</th>
            <th>Bebida</th>
            <th>Data</th>
            <th>Campus</th>
            <th>Bloco</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length > 0 ? (
            pedidos.map(c => (
              <tr key={c.id}>
                <td>{c.id}</td>
                <td>{getClienteName(c.clienteId)}</td>
                <td>{getCardapioName(c.cardapioId)}</td>
                <td>{getRefeicaoName(c.refeicaoId)}</td>
                <td>{getBebidaName(c.bebidaId)}</td>
                <td>{c.dataHora ? new Date(c.dataHora).toLocaleString('pt-BR') : ''}</td>
                <td>{getCampusName(c.campusId)}</td>
                <td>{getBlocoName(c.blocoId)}</td>
                <td>{c.status}</td>
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
              <td colSpan={10} className="text-center">
                Carregando pedidos…
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ListagemPedido;
