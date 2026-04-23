import { createRoot } from 'react-dom/client';
import '@fontsource-variable/plus-jakarta-sans/wght.css';
import App from './app.jsx';
import './styles.css';

const root = createRoot(document.getElementById('root'));
root.render(<App />);
