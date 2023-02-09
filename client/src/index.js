import React from 'react' // nạp thư viện react
import ReactDOM from 'react-dom' // nạp thư viện react-dom
import App from "./App";
import "./index.css";
import { BrowserRouter} from "react-router-dom";
import  {  Provider  }  from  'react-redux';
import {store} from "./redux/store";
import { positions, transitions, Provider as AlertProvider} from "react-alert";
import AlertTemplate from "react-alert-template-basic";

const options = {
    timeout : 5000,
    position : positions.TOP_RIGHT,
    transition : transitions.SCALE
};

ReactDOM.render(
<Provider store={store}>
    <BrowserRouter >
        <AlertProvider template={AlertTemplate} {...options} >
            <App />
        </AlertProvider>
    </BrowserRouter>
</Provider>
,
 document.getElementById('root'))

