import React, { useState, useReducer, ReducerAction } from 'react';
import Grid from '@material-ui/core/Grid';
import { Button, TextField, Card, CardContent, Paper } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';

const Panel = (props) => {
  const { pre, majorList, floorList, typeList, subtypeList, compList, buildingList } = props;
  const { major, floor, type, subtype, comp, building } = props;
  const { onPreChange, onMajorChange, onFloorChange, onTypeChange, onSubtypeChange, onCompChange, onBuildingChange } = props;

  const getValue = (key) => {
    return props[key] || null;
  }

  const setValue = (cb) => {
    return (e, value) => {
      cb(value);
    }
  }

  const handleOpen = (key) => {
    return () => {
      props.loadData(key);
    }
  }

  return (
    <div style={{ position: "fixed", zIndex: 10, top: '50%', transform: 'translateY(-50%)' }}>

      <Grid
        style={{ width: 300, marginLeft: 40 }}
        container
        direction='row'
      >
        <Paper elevation={7} style={{ width: '100%' }}>

          <Grid
            style={{ padding: 20 }}
            container
            direction='column'>
            <TextField value={pre} onChange={e => onPreChange(e.target.value)} label="编码前缀" margin="normal" />
            <Autocomplete
              options={buildingList}
              onOpen={handleOpen('building')}
              getOptionLabel={option => option._name}
              value={getValue('building')}
              onChange={setValue(onBuildingChange)}
              renderInput={params => (
                <TextField {...params} label="楼栋" margin="normal" />
              )}
            />
            <Autocomplete
              options={floorList}
              onOpen={handleOpen('floor')}
              getOptionLabel={option => option}
              value={getValue('floor')}
              onChange={setValue(onFloorChange)}
              renderInput={params => (
                <TextField error={!floor || floor.length === 0} helperText={!floor || floor.length === 0 ? '请选择楼层' : undefined} required {...params} label="楼层" margin="normal" />
              )}
            />
            <Autocomplete
              options={majorList}
              onOpen={handleOpen('major')}
              getOptionLabel={option => option}
              value={getValue('major')}
              onChange={setValue(onMajorChange)}
              renderInput={params => (
                <TextField {...params} label="专业" margin="normal" />
              )}
            />
            <Autocomplete
              options={typeList}
              onOpen={handleOpen('type')}
              getOptionLabel={option => option}
              value={getValue('type')}
              onChange={setValue(onTypeChange)}
              renderInput={params => (
                <TextField {...params} label="大类" margin="normal" />
              )}
            />
            <Autocomplete
              options={subtypeList}
              onOpen={handleOpen('subtype')}
              getOptionLabel={option => option}
              value={getValue('subtype')}
              onChange={setValue(onSubtypeChange)}
              renderInput={params => (
                <TextField {...params} label="小类" margin="normal" />
              )}
            />
            <Autocomplete
              options={compList}
              onOpen={handleOpen('comp')}
              getOptionLabel={option => option}
              value={getValue('comp')}
              onChange={setValue(onCompChange)}
              renderInput={params => (
                <TextField {...params} label="构件" margin="normal" />
              )}
            />
            <Button onClick={props.onSearch}>查找</Button>
            <Button onClick={props.onCode}>编码</Button>
          </Grid>

        </Paper>
      </Grid>

    </div>
  );
}

export default Panel;
