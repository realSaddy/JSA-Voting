import React from "react";

import CreateUser from "../../components/CreateUser";
import ErrorPopup from "../../components/ErrorPopup";
import withDialog from "../../components/withDialog";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";

import type AuthService from "../../services/AuthService";

type Props = {
  auth: AuthService;
  createError: Function;
  createDialog: Function;
};

function Manager(props: Props) {
  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <Paper>
        Manager
        <br />
        <CreateUser auth={props.auth} type={"admin"} />
        <br />
        <hr style={{ width: "25em", color: "#8080805c" }} />
        <br />
      </Paper>
    </Grid>
  );
}

export default withDialog(ErrorPopup(Manager));
