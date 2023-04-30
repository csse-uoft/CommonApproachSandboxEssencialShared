import {makeStyles} from "@mui/styles";
import {useNavigate, useParams} from "react-router-dom";
import React, {useEffect, useState, useContext} from "react";
import {Loading} from "../shared";
import {Button, Container, Paper, Typography} from "@mui/material";
import GeneralField from "../shared/fields/GeneralField";
import LoadingButton from "../shared/LoadingButton";
import {AlertDialog} from "../shared/Dialogs";
import {createTheme, fetchTheme, updateTheme} from "../../api/themeApi";
import {useSnackbar} from "notistack";
import {UserContext} from "../../context";
import {reportErrorToBackend} from "../../api/errorReportApi";

const useStyles = makeStyles(() => ({
  root: {
    width: '80%'
  },
  button: {
    marginTop: 12,
    marginBottom: 0,
    length: 100
  },
}));


export default function AddEditTheme() {

  const classes = useStyles();
  const navigate = useNavigate();
  const userContext = useContext(UserContext);
  const {id, operationMode} = useParams();
  const mode = id ? operationMode : 'new';
  const {enqueueSnackbar} = useSnackbar();

  const [state, setState] = useState({
    submitDialog: false,
    loadingButton: false,
  });
  const [errors, setErrors] = useState(
    {}
  );

  const [form, setForm] = useState({
    name: '',
    identifier: '',
    description: ''
  });
  const [loading, setLoading] = useState(true);
  // const [options, setOptions] = useState({
  //   reporters: {},
  //   editors: [],
  //   researchers: [],
  //   administrators: [],
  // });

  useEffect(() => {
    if (mode === 'edit' && id || mode === 'view') {
      fetchTheme(id).then(res => {
        if (res.success) {
          setForm({
            name: res.theme.name,
            description: res.theme.description,
            identifier: res.theme.identifier
          });
          setLoading(false);
        }
      }).catch(e => {
        reportErrorToBackend(e);
        enqueueSnackbar(e.json?.message || "Error occur", {variant: 'error'});
        navigate('/themes');
      });
    } else if (mode === 'edit' && !id) {
      navigate('/organizations');
      enqueueSnackbar("No ID provided", {variant: 'error'});
    } else if (mode === 'new') {
      setLoading(false);
    }
  }, [mode]);

  const handleSubmit = () => {
    if (validate()) {
      setState(state => ({...state, submitDialog: true}));
    }
  };

  const handleConfirm = () => {
    setState(state => ({...state, loadingButton: true}));
    if (mode === 'new') {
      createTheme(form).then((ret) => {
          if (ret.success) {
            setState({loadingButton: false, submitDialog: false,});
            navigate('/themes');
            enqueueSnackbar(ret.message || 'Success', {variant: "success"});
          }
        }
      ).catch(e => {
        if (e.json) {
          setErrors(e.json);
        }
        reportErrorToBackend(e);
        enqueueSnackbar(e.json?.message || 'Error occurs when creating theme', {variant: "error"});
        setState({loadingButton: false, submitDialog: false,});
      });
    } else if (mode === 'edit') {
      updateTheme(id, form).then((res) => {
        if (res.success) {
          setState({loadingButton: false, submitDialog: false,});
          navigate('/themes');
          enqueueSnackbar(res.message || 'Success', {variant: "success"});
        }
      }).catch(e => {
        if (e.json) {
          setErrors(e.json);
        }
        reportErrorToBackend(e);
        enqueueSnackbar(e.json?.message || 'Error occurs when updating the theme', {variant: "error"});
        setState({loadingButton: false, submitDialog: false,});
      });
    }

  };

  const validate = () => {
    const error = {};
    if (!form.name) {
      error.name = 'The field cannot be empty';
    }
    if (!form.description) {
      error.description = 'The field cannot be empty';
    }
    setErrors(error);
    return Object.keys(error).length === 0;
  };

  if (loading)
    return <Loading/>;

  return (
    <Container maxWidth="md">
      <Paper sx={{p: 2}} variant={'outlined'}>
        <Typography variant={'h4'}> Theme </Typography>

        <GeneralField
          disabled={operationMode === 'view'}
          key={'name'}
          label={'Name'}
          value={form.name}
          required
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.name = e.target.value}
          error={!!errors.name}
          helperText={errors.name}
          onBlur={() => {
            if (form.name === '') {
              setErrors(errors => ({...errors, name: 'This field cannot be empty'}));
            } else {
              setErrors(errors => ({...errors, name: ''}));
            }

          }}
        />

        <GeneralField
          disabled={operationMode === 'view'}
          key={'identifier'}
          label={'Identifier'}
          value={form.identifier}
          required
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.identifier = e.target.value}
          error={!!errors.identifier}
          helperText={errors.identifier}
          onBlur={() => {
            if (form.identifier === '') {
              setErrors(errors => ({...errors, identifier: 'This field cannot be empty'}));
            } else {
              setErrors(errors => ({...errors, identifier: ''}));
            }

          }}
        />

        <GeneralField
          disabled={operationMode === 'view'}
          key={'description'}
          label={'Description'}
          value={form.description}
          sx={{mt: '16px', minWidth: 350}}
          onChange={e => form.description = e.target.value}
          error={!!errors.description}
          helperText={errors.description}
          required
          multiline
          minRows={4}
          onBlur={() => {
            if (form.description === '') {
              setErrors(errors => ({...errors, description: 'This field cannot be empty'}));
            } else {
              setErrors(errors => ({...errors, description: ''}));
            }

          }}
        />

        {operationMode === 'view' ? <div/> :
          <Button variant="contained" color="primary" className={classes.button} onClick={handleSubmit}>
            Submit
          </Button>}

        <AlertDialog dialogContentText={"You won't be able to edit the information after clicking CONFIRM."}
                     dialogTitle={mode === 'new' ? 'Are you sure you want to create this new Theme?' :
                       'Are you sure you want to update this Theme?'}
                     buttons={[<Button onClick={() => setState(state => ({...state, submitDialog: false}))}
                                       key={'cancel'}>{'cancel'}</Button>,
                       <LoadingButton noDefaultStyle variant="text" color="primary" loading={state.loadingButton}
                                      key={'confirm'}
                                      onClick={handleConfirm} children="confirm" autoFocus/>]}
                     open={state.submitDialog}/>
      </Paper>
    </Container>);

}