import { type FC, useState, type FormEvent, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import campusService from '../../services/campusService';
import blocoService from '../../services/blocoService';
import refeicaoService from '../../services/refeicaoService';
import { Link } from 'react-router-dom';

interface GenericItem { id: number; nome: string; }
interface BlocoItem { id: number; nome: string; campusId: number; }
interface ReportData { nome: string; quantidade: number; }

const RelatorioRefeicoes: FC = () => {
  const [filters, setFilters] = useState({ campusId: '', blocoId: '', data: '' });
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [isReportLoading, setReportLoading] = useState(false);

  const { data: campi, isLoading: isLoadingCampi } = useQuery<GenericItem[]>({ queryKey: ['campi'], queryFn: campusService.getCampi });
  const { data: blocos, isLoading: isLoadingBlocos } = useQuery<BlocoItem[]>({ queryKey: ['blocos'], queryFn: blocoService.getBlocos });

  const blocosFiltrados = useMemo(() => {
    if (!filters.campusId) return [];
    return blocos?.filter(b => b.campusId === Number(filters.campusId)) || [];
  }, [filters.campusId, blocos]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value, ...(name === 'campusId' && { blocoId: '' }) }));
  };

  const fetchReport = async () => {
    setReportLoading(true);
    try {
      const campusId = Number(filters.campusId) || 0;
      const blocoId = Number(filters.blocoId) || 0;
      const dataFiltro = filters.data || '0';

      const data = await refeicaoService.getRefeicoesMaisPedidas(campusId, blocoId, dataFiltro);
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

  const isLoading = isLoadingCampi || isLoadingBlocos;

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Relatório de Refeições Mais Pedidas</h1>
        <Link to="/relatorios" className="btn btn-secondary">Voltar</Link>
      </div>

      <div className="card mb-4">
        <div className="card-header">Filtros</div>
        <div className="card-body">
          {isLoading ? (
            <p>Carregando filtros...</p>
          ) : (
            <form onSubmit={handleSubmit} className="row g-3 align-items-end">
              <div className="col-md-3">
                <label htmlFor="campusId" className="form-label">Campus</label>
                <select id="campusId" name="campusId" className="form-select" value={filters.campusId} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  {campi?.map(c => <option key={c.id} value={c.id}>{c.nome}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="blocoId" className="form-label">Bloco</label>
                <select id="blocoId" name="blocoId" className="form-select" value={filters.blocoId} onChange={handleFilterChange} disabled={!filters.campusId}>
                  <option value="">Todos</option>
                  {blocosFiltrados.map(b => <option key={b.id} value={b.id}>{b.nome}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label htmlFor="data" className="form-label">Data</label>
                <input type="date" id="data" name="data" className="form-control" value={filters.data} onChange={handleFilterChange} />
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
            <th>Refeição</th>
            <th>Quantidade Vendida</th>
          </tr>
        </thead>
        <tbody>
          {isReportLoading ? (
            <tr><td colSpan={2} className="text-center">Carregando...</td></tr>
          ) : reportData.length > 0 ? (
            reportData.map((item, index) => (
              <tr key={index}>
                <td>{item.nome}</td>
                <td>{item.quantidade}</td>
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

export default RelatorioRefeicoes;