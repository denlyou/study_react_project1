import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
// 아폴로
import { ApolloProvider } from "react-apollo";
import client from "./apollo";
// 스타일
import "./globalStyles";

const dom = (<ApolloProvider client={client}>
<App />
</ApolloProvider>);

ReactDOM.render( dom , document.getElementById("root") );