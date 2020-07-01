import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Router from './router/Router';
import * as serviceWorker from './serviceWorker';
import { Provider } from 'react-redux';
import { store } from './redux';

/**
 * 禁止微信分享功能
 */
document.addEventListener('WeixinJSBridgeReady', function onBridgeReady() {
  window.WeixinJSBridge.call('hideOptionMenu');
});

function Index() {
  return (
    <>
      <Provider store={store}>
        <Router />
      </Provider>
    </>
  );
}

ReactDOM.render(<Index />, document.getElementById('root'));
// ReactDOM.render(<Router />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
