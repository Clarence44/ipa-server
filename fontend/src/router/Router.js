import React from 'react';
import { Route, Switch, Redirect,BrowserRouter } from 'react-router-dom';
import Home from '../pages/Home';
import App from '../pages/App';
import Key from '../pages/Key';
// import Details from '../pages/Details';
// import Login from '../pages/Login';
import { useSelector } from 'react-redux';

const Routers = [
  { path: '/app', name: 'App', component: App, auth: false },
  { path: '/', name: 'Home', component: Home, auth: false },
  { path: '/key', name: 'Key', component: Key, auth: false },
  // { path: '/details', name: 'Details', component: Details, auth: false },
  // { path: '/login', name: 'Login', component: Login },
];

const BasicRoute = () => {
  const state = useSelector((state) => state);
  const token = !!state.ticket;
  return (
    <BrowserRouter>
      <Switch>
        {Routers.map((item, index) => {
          return (
            <Route
              key={index}
              path={item.path}
              exact
              render={(props) =>
                !item.auth ? (
                  <item.component {...props} />
                ) : token ? (
                  <item.component {...props} />
                ) : (
                  <Redirect
                    to={{
                      pathname: '/login',
                    }}
                  />
                )
              }
            />
          );
        })}
        <Redirect
          to={{
            pathname: '/login',
          }}
        />
      </Switch>
    </BrowserRouter>
  );
};

export default BasicRoute;
