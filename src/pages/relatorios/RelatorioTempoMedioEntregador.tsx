import { type FC, useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import entregadorService from '../../services/entregadorService';
import entregaService from '../../services/entregaService';
import { Link } from 'react-router-dom';

interface GenericItem { id: number; nome: string; }
interface ReportData { nomeEntregador: string; tempoMedioEntrega: string; }

const RelatorioTempoMedioEntregador: FC = () => {
  const [entregadorId, setEntregadorId] = useState('');
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [isReportLoading, setReportLoading] = useState(false);

  const { data: entregadores, isLoading: isLoadingEntregadores } = useQuery<GenericItem[]>({
    queryKey: ['entregadores'],
    queryFn: entregadorService.getEntregadores,
  });

  const fetchReport = async () => {
    setReportLoading(true);
    try {
      const params = {
        entregador_id: Number(entregadorId) || undefined
      };
      const data = await entregaService.getTempoMedioEntregaPorEntregador(params);
      setReportData(data);
      if (data.length === 0) {
        toast.success("Nenhum resultado encontrado para os filtros selecionados.");
      }
    } catch (error: any) {
      toast.error(`Erro ao gerar relatório: ${error.message}`);
    } finally {
      setReportLoading(false);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    fetchReport();
  };

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Relatório de Tempo Médio por Entregador</h1>
        <Link to="/relatorios" className="btn btn-secondary">Voltar</Link>
      </div>

      <div className="card mb-4">
        <div className="card-header">Filtro</div>
        <div className="card-body">
          {isLoadingEntregadores ? (
            <p>Carregando filtro...</p>
          ) : (
            <form onSubmit={handleSubmit} className="row g-3 align-items-end">
              <div className="col-md-9">
                <label htmlFor="entregadorId" className="form-label">Entregador</label>
                <select id="entregadorId" name="entregadorId" className="form-select" value={entregadorId} onChange={e => setEntregadorId(e.target.value)}>
                  <option value="">Todos</option>
                  {entregadores?.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <button type="submit" className="btn btn-primary w-100" disabled={isReportLoading}>
                  {isReportLoading ? 'Gerando...' : 'Gerar Relatório'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Entregador</th>
            <th>Tempo Médio de Entrega (minutos)</th>
          </tr>
        </thead>
        <tbody>
          {isReportLoading ? (
            <tr><td colSpan={2} className="text-center">Carregando...</td></tr>
          ) : reportData.length > 0 ? (
            reportData.map((item, index) => (
              <tr key={index}>
                <td>{item.nomeEntregador}</td>
                <td>{item.tempoMedioEntrega}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan={2} className="text-center">Nenhum dado para exibir. Por favor, gere o relatório.</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RelatorioTempoMedioEntregador;