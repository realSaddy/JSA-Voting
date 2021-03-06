import React, { useState, useEffect } from "react";

import Room from "./Room";

import Grid from "@material-ui/core/Grid";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import ErrorPopup from "../../components/ErrorPopup";

function Mod(props) {
  const [roomName, setRoomName] = useState("");
  const [room, setRoom] = useState(null);
  const [roomNameValid, setRoomNameValid] = useState(false);
  const [buttonValid, setButtonValid] = useState(false);

  useEffect(() => {
    setRoomNameValid(
      roomName.length === 0 || (roomName.length >= 1 && roomName.length <= 32)
    );
  }, [roomName]);

  useEffect(() => {
    setButtonValid(roomName.length !== 0 && roomNameValid);
  }, [roomName, roomNameValid]);

  useEffect(() => {
    props.auth.fetch("/api/get_room", { method: "POST" }, (res, status) => {
      if (status < 300) setRoom(res);
    });
  }, [props.auth]);

  function createRoom() {
    props.auth.fetch(
      "/api/create_room",
      { method: "POST", body: JSON.stringify({ name: roomName }) },
      (res, status) => {
        if (status >= 400) {
          props.createError(status, res.error);
        } else {
          setRoomName("");
          setRoom(res);
        }
      }
    );
  }

  return (
    <Grid container direction="column" justify="center" alignItems="stretch">
      <Paper>
        {room != null ? (
          <Room disable={() => setRoom(null)} auth={props.auth} room={room} />
        ) : (
          <div>
            Mod
            <br />
            <TextField
              name="room_name"
              id="room_name"
              label="Room name"
              type="text"
              onChange={(e) => setRoomName(e.target.value)}
              value={roomName}
              error={!roomNameValid}
              helperText="Between 1-32 characters"
            />
            <Button
              disabled={!buttonValid}
              onClick={createRoom}
              color="primary"
            >
              Create a new room
            </Button>
          </div>
        )}
      </Paper>
    </Grid>
  );
}

export default ErrorPopup(Mod);
