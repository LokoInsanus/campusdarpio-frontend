import { type FC, useState, type FormEvent } from 'react';
import { useQuery } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import cardapioService from '../../services/cardapioService';
import { Link } from 'react-router-dom';

interface CardapioItem { id: number; descricao: string; }
interface ReportData { tipoRefeicao: string; quantidade: number; }

const RelatorioTotaisTipo: FC = () => {
  const [filters, setFilters] = useState({ cardapioId: '', data: '' });
  const [reportData, setReportData] = useState<ReportData[]>([]);
  const [isReportLoading, setReportLoading] = useState(false);

  const { data: cardapios, isLoading: isLoadingCardapios } = useQuery<CardapioItem[]>({
    queryKey: ['cardapios'],
    queryFn: cardapioService.getCardapios,
  });

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const fetchReport = async () => {
    setReportLoading(true);
    try {
      const params = {
        cardapio_id: Number(filters.cardapioId) || undefined,
        data: filters.data || undefined,
      };
      const data = await cardapioService.getTiposdeRefeicoesCardapioData(params);
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
        <h1 className="mb-0">Relatório de Totais por Tipo de Refeição</h1>
        <Link to="/relatorios" className="btn btn-secondary">Voltar</Link>
      </div>

      <div className="card mb-4">
        <div className="card-header">Filtros</div>
        <div className="card-body">
          {isLoadingCardapios ? (
            <p>Carregando filtros...</p>
          ) : (
            <form onSubmit={handleSubmit} className="row g-3 align-items-end">
              <div className="col-md-4">
                <label htmlFor="cardapioId" className="form-label">Cardápio</label>
                <select id="cardapioId" name="cardapioId" className="form-select" value={filters.cardapioId} onChange={handleFilterChange}>
                  <option value="">Todos</option>
                  {cardapios?.map(c => <option key={c.id} value={c.id}>{c.descricao}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label htmlFor="data" className="form-label">Data</label>
                <input type="date" id="data" name="data" className="form-control" value={filters.data} onChange={handleFilterChange} />
              </div>
              <div className="col-md-4">
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
            <th>Tipo de Refeição</th>
            <th>Quantidade</th>
          </tr>
        </thead>
        <tbody>
          {isReportLoading ? (
            <tr><td colSpan={2} className="text-center">Carregando...</td></tr>
          ) : reportData.length > 0 ? (
            reportData.map((item, index) => (
              <tr key={index}>
                <td>{item.tipoRefeicao}</td>
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

export default RelatorioTotaisTipo;