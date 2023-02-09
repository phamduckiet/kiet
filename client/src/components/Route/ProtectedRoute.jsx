import React, { Fragment } from "react";
import { useSelector } from "react-redux";
import { Navigate, Route } from "react-router-dom";

const ProtectedRoute = ({ isAdmin, Component, ...rest }) => {
  const { loading, isAuthenticated, user } = useSelector((state) => state.user);
  const conditions = (isAuthenticated === false || isAuthenticated === false) 
    ? <Navigate to="/login" />: <Component {...rest} />
  return (
    <Fragment>
      {loading === false && (
        <Route
          element = {conditions}
        />
      )}
    </Fragment>
  );
};

export default ProtectedRoute;