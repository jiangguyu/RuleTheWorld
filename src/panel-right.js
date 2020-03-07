import React, { useState, useReducer, ReducerAction } from 'react';
import Grid from '@material-ui/core/Grid';
import { Button, TextField, Card, CardContent, Paper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const PanelRight = (props) => {
  const { projectList, currentProject, onCurrentProjectChange } = props;
  return (
    <div style={{ position: "fixed", right: 0, zIndex: 10, top: '50%', transform: 'translateY(-50%)' }}>

      <Grid
        style={{ width: 300, marginRight: 40 }}
        container
        direction='row'
      >
        <Paper elevation={7} style={{ width: '100%' }}>

          <Grid
            style={{ padding: 20 }}
            container
            direction='column'>
            <Autocomplete
              options={projectList}
              getOptionLabel={option => option.name}
              value={currentProject}
              onChange={(e, v) => onCurrentProjectChange(v)}
              renderInput={params => (
                <TextField {...params} label="选择工程" margin="normal" />
              )}
            />

          </Grid>

        </Paper>
      </Grid>

    </div>
  );
}

export default PanelRight;
