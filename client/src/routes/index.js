import React from "react";
import { Switch, Route } from "react-router-dom";

import Dashboard from "../pages/Dashboard";
import Vote from "../pages/Vote";
import NotFound from "../pages/NotFound";
import history from "../services/history";

export default function Routes() {
  return (
    <Switch>
      <Route path="/" exact component={Vote} />
      <Route history={history} path="/dashboard" component={Dashboard} />
      <Route component={NotFound} />
    </Switch>
  );
}
