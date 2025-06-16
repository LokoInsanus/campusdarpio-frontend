import { type FC, useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import entregadorService from '../../services/entregadorService';
import entregaService from '../../services/entregaService';
import { Link } from 'react-router-dom';

interface GenericItem { id: number; nome: string; }
interface ReportData { nomeEntregador: string; totalEntregas: number; }

const RelatorioTotaisEntregador: FC = () => {
  const [filters, setFilters] = useState({ entregadorId: '', dataInicio: '', dataFim: '' });
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [isReportLoading, setReportLoading] = useState(false);

  const { data: entregadores, isLoading: isLoadingEntregadores } = useQuery<GenericItem[]>({
    queryKey: ['entregadores'],
    queryFn: entregadorService.getEntregadores,
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const fetchReport = async () => {
    if (!filters.dataInicio || !filters.dataFim) {
      toast.error("As datas de início e fim são obrigatórias.");
      return;
    }
    setReportLoading(true);
    try {
      const params = {
        entregador_Id: Number(filters.entregadorId) || undefined,
        dataInicio: filters.dataInicio,
        dataFim: filters.dataFim,
      };
      const data = await entregaService.getTotaisEntregadorData(params);
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
        <h1 className="mb-0">Relatório de Totais por Entregador</h1>
        <Link to="/relatorios" className="btn btn-secondary">Voltar</Link>
      </div>

      <div className="card mb-4">
        <div className="card-header">Filtros</div>
        <div className="card-body">
          {isLoadingEntregadores ? (
            <p>Carregando filtros...</p>
          ) : (
            <form onSubmit={handleSubmit} className="row g-3 align-items-end">
              <div className="col-md-3">
                <label htmlFor="entregadorId" className="form-label">Entregador</label>
                <select id="entregadorId" name="entregadorId" className="form-select" value={filters.entregadorId} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  {entregadores?.map(e => <option key={e.id} value={e.id}>{e.nome}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="dataInicio" className="form-label">Data Início</label>
                <input type="date" id="dataInicio" name="dataInicio" className="form-control" value={filters.dataInicio} onChange={handleFilterChange} required />
              </div>
              <div className="col-md-3">
                <label htmlFor="dataFim" className="form-label">Data Fim</label>
                <input type="date" id="dataFim" name="dataFim" className="form-control" value={filters.dataFim} onChange={handleFilterChange} required />
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
            <th>Total de Entregas</th>
          </tr>
        </thead>
        <tbody>
          {isReportLoading ? (
            <tr><td colSpan={2} className="text-center">Carregando...</td></tr>
          ) : reportData.length > 0 ? (
            reportData.map((item, index) => (
              <tr key={index}>
                <td>{item.nomeEntregador}</td>
                <td>{item.totalEntregas}</td>
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

export default RelatorioTotaisEntregador;