import { type FC } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import Header from '../components/Header';
import HomePage from './HomePage';
import Cadastros from './Cadastros';
import Listagens from './Listagens';
import Cardapio from './Cardapio';
import Pedido from './Pedido';
import Entrega from './Entrega';
import CadastroCliente from './cadastros/CadastroCliente';
import CadastroFuncionario from './cadastros/CadastroFuncionario';
import CadastroEntregador from './cadastros/CadastroEntregador';
import CadastroBloco from './cadastros/CadastroBloco';
import CadastroCampus from './cadastros/CadastroCampus';
import CadastroRefeicao from './cadastros/CadastroRefeicao';
import CadastroBebida from './cadastros/CadastroBebida';
import ListagemCliente from './listagens/ListagemCliente';
import ListagemFuncionario from './listagens/ListagemFuncionario';
import ListagemEntregador from './listagens/ListagemEntregador';
import ListagemBloco from './listagens/ListagemBloco';
import ListagemCampus from './listagens/ListagemCampus';
import ListagemRefeicao from './listagens/ListagemRefeicao';
import ListagemBebida from './listagens/ListagemBebida';
import ListagemCardapio from './listagens/ListagemCardapio';
import ListagemPedido from './listagens/ListagemPedido';
import ListagemEntrega from './listagens/ListagemEntrega';

const App: FC = () => {
  return (
    <HashRouter>
      <Header />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/cadastros" element={<Cadastros />} />
        <Route path="/listagens" element={<Listagens />} />
        <Route path="/cardapio" element={<Cardapio />} />
        <Route path="/pedido" element={<Pedido />} />
        <Route path="/entrega" element={<Entrega />} />

        <Route path="/cadastro/cliente" element={<CadastroCliente />} />
        <Route path="/cadastro/funcionario" element={<CadastroFuncionario />} />
        <Route path="/cadastro/entregador" element={<CadastroEntregador />} />
        <Route path="/cadastro/bloco" element={<CadastroBloco />} />
        <Route path="/cadastro/campus" element={<CadastroCampus />} />
        <Route path="/cadastro/refeicao" element={<CadastroRefeicao />} />
        <Route path="/cadastro/bebida" element={<CadastroBebida />} />

        <Route path="/cadastro/cliente/edit/:id" element={<CadastroCliente />} />
        <Route path="/cadastro/funcionario/edit/:id" element={<CadastroFuncionario />} />
        <Route path="/cadastro/entregador/edit/:id" element={<CadastroEntregador />} />
        <Route path="/cadastro/bloco/edit/:id" element={<CadastroBloco />} />
        <Route path="/cadastro/campus/edit/:id" element={<CadastroCampus />} />
        <Route path="/cadastro/refeicao/edit/:id" element={<CadastroRefeicao />} />
        <Route path="/cadastro/bebida/edit/:id" element={<CadastroBebida />} />

        <Route path="/listagem/cliente" element={<ListagemCliente />} />
        <Route path="/listagem/funcionario" element={<ListagemFuncionario />} />
        <Route path="/listagem/entregador" element={<ListagemEntregador />} />
        <Route path="/listagem/bloco" element={<ListagemBloco />} />
        <Route path="/listagem/campus" element={<ListagemCampus />} />
        <Route path="/listagem/refeicao" element={<ListagemRefeicao />} />
        <Route path="/listagem/bebida" element={<ListagemBebida />} />
        <Route path="/listagem/cardapio" element={<ListagemCardapio />} />
        <Route path="/listagem/pedido" element={<ListagemPedido />} />
        <Route path="/listagem/entrega" element={<ListagemEntrega />} />
      </Routes>
    </HashRouter>
  );
};

export default App;