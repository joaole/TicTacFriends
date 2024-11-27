import React from 'react';
import { Navigate } from 'react-router-dom';
import PrivateNavbar from './PrivateHeader'; // Importa a nova navbar privada

const PrivateRoute = ({ token, children }) => {
  return token ? (
    <>
      {children}       {/* Renderiza o conteúdo da rota privada */}
    </>
  ) : (
    <Navigate to="/auth/login" /> // Redireciona para login se não autenticado
  );
};

export default PrivateRoute;
