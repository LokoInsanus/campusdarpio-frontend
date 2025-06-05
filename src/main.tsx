import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import App from './pages/App';

const container = document.getElementById('root') as HTMLElement;
const root = ReactDOM.createRoot(container);

const render = () =>
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );

render();

if (import.meta.hot) {
  import.meta.hot.accept('./pages/App', render);
}
