import React, { useEffect, useState, useContext } from 'react';
import {Chip, Container, ListItemIcon, Menu, MenuItem, Typography} from "@mui/material";
import {Add as AddIcon, Check as YesIcon, People} from "@mui/icons-material";
import { DeleteModal, DropdownMenu, Link, Loading, DataTable } from "../shared";
import { useNavigate } from "react-router-dom";
import { useSnackbar } from 'notistack';
import {deleteOrganization, fetchOrganizations} from "../../api/organizationApi";
import {UserContext} from "../../context";
import {reportErrorToBackend} from "../../api/errorReportApi";
import {fetchStakeholders} from "../../api/stakeholderAPI";
import {navigate, navigateHelper} from "../../helpers/navigatorHelper";
export default function Stakeholders() {
  const {enqueueSnackbar} = useSnackbar();
  const navigator = useNavigate();
  const navigate = navigateHelper(navigator)
  const userContext = useContext(UserContext);
  const [state, setState] = useState({
    loading: true,
    data: [],
    selectedId: null,
    deleteDialogTitle: '',
    showDeleteDialog: false,
  });
  const [dropDown, setDropDown] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [trigger, setTrigger] = useState(true);

  useEffect(() => {
    fetchStakeholders().then(res => {
      if(res.success)
        setState(state => ({...state, loading: false, data: res.stakeholders}));
    }).catch(e => {
      reportErrorToBackend(e)
      setState(state => ({...state, loading: false}))
      navigate('/dashboard');
      enqueueSnackbar(e.json?.message || "Error occur", {variant: 'error'});
    });
  }, [trigger]);

  const showDeleteDialog = (id) => {
    setState(state => ({
      ...state, selectedId: id, showDeleteDialog: true,
      deleteDialogTitle: 'Delete organization ' + id + ' ?'
    }));
  };


  const handleDelete = async (id, form) => {

    deleteOrganization(id).then(({success, message})=>{
      if (success) {
        setState(state => ({
          ...state, showDeleteDialog: false,
        }));
        setTrigger(!trigger);
        enqueueSnackbar(message || "Success", {variant: 'success'})
      }
    }).catch((e)=>{
      setState(state => ({
        ...state, showDeleteDialog: false,
      }));
      setTrigger(!trigger);
      enqueueSnackbar(e.json?.message || "Error occur", {variant: 'error'});
    });

  };

  const columns = [
    {
      label: 'Legal Name',
      body: ({_uri, legalName, editable}) => {
        return editable?
          <Link colorWithHover to={`/stakeholder/${encodeURIComponent(_uri)}/view/`}>
            {legalName}
          </Link>:
          legalName
      },
      sortBy: ({legalName}) => legalName
    },
    {
      label: 'Administrator',
      body: ({administrator}) => {
        return administrator;
      }
    },

    {
      label: ' ',
      body: ({_uri, editable}) =>
        <DropdownMenu urlPrefix={'stakeholder'} objectUri={encodeURIComponent(_uri)} hideViewOption hideDeleteOption
                      hideEditOption={!editable}
                      handleDelete={() => showDeleteDialog(_uri)}/>
    }
  ];

  if (state.loading)
    return <Loading message={`Loading organizations...`}/>;

  return (
    <Container>
      <DataTable
        title={"Stakeholders"}
        data={state.data}
        columns={columns}
        idField="id"
        customToolbar={
        <div>
          <Chip
            disabled={!userContext.isSuperuser}
            onClick={(e) => {
              setDropDown(true);
              setAnchorEl(e.currentTarget);
            }}
            color="primary"
            icon={<AddIcon/>}
            label="Add new Stakeholder"
            variant="outlined"/>
          <Menu
            open={dropDown}
            anchorEl={anchorEl}
            onClose={() => {
              setAnchorEl(null);
              setDropDown(false);
            }}
          >
            <MenuItem onClick={() => {
              navigate("/stakeholder/new" );
            }} variant="inherit" sx={{width:'180px', padding: '4px 12px', height: '25px'}} >
              Organization
            </MenuItem>
          </Menu>
        </div>

        }

      />
      <DeleteModal
        objectId={state.selectedId}
        title={state.deleteDialogTitle}
        show={state.showDeleteDialog}
        onHide={() => setState(state => ({...state, showDeleteDialog: false}))}
        delete={handleDelete}
      />
    </Container>
  );
}
