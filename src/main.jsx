import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import {TaskProvider} from './context/TaskContext.jsx'
import 'primereact/resources/themes/saga-blue/theme.css';
import 'primereact/resources/primereact.min.css';


createRoot(document.getElementById('root')).render(
 <TaskProvider>
    <App />
</TaskProvider>
 
)
