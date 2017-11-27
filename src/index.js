import React from "react";
import { render } from "react-dom";
import { BrowserRouter,Route,Switch,Link } from 'react-router-dom';
import { createStore } from "redux";
import { Provider } from "react-redux";
import reducer from "./redux";
import "./index.css";
import Container from './routes/container';
const store = createStore(reducer);
render((
	<Provider store={store}>
		<BrowserRouter>
			<div style={{width:"100%",height:"100%"}}>
				<Route exact path="/" component={Container} >

				</Route>
			</div>
		</BrowserRouter>
	</Provider>
),document.getElementById("root"))