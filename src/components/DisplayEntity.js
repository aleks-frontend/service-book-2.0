import React from 'react';
import styled from 'styled-components';
import MaterialTable from 'material-table';
import tableIcons from '../tableIcons';
import { AppContext } from './AppProvider';
import getEntitiesAPI from '../API/getEntities';
import deleteEntityAPI from '../API/deleteEntity';
import updateEntityAPI from '../API/updateEntity';

const StyledTableWrapper = styled.div`
  width: 100%;

  .MuiTableCell-root { font-size: 1.1rem; }
  .MuiTypography-caption { font-size: 1rem; }
`;

const DisplayEntity = (props) => {
  const context = React.useContext(AppContext);
  const tableRef = React.useRef();

  React.useEffect(() => {
    if ( props.reloadTable ) {
      tableRef.current.onQueryChange();
      props.resetReloadTable();
    }
  }, [props.reloadTable])

  /** Populating columns variable with fields received from props **/
  const columns = props.fields.map(field => {
    return {
      title: field.label,
      field: field.name,
      editable: field.editable || 'onUpdate'
    }
  });


  return (
    <StyledTableWrapper>
      <MaterialTable
        className="test"
        icons={tableIcons}
        tableRef={tableRef}
        title=""
        columns={columns}
        data={(query) => {
          return getEntitiesAPI({ query: query, token: context.token, entityName: props.name })
          }
        }
        editable={
          {
            onRowDelete: async (oldData) => {
              try {
                await deleteEntityAPI({ id: oldData._id, token: context.token, entityName: props.name })
                context.showSnackbar(`${props.entityLabel.toLowerCase()} was deleted (${oldData.name})`);
              } catch(err) {
                context.showSnackbar(err);
              }
              
            },
            onRowUpdate: async (newData, oldData) => {
              try {
                await updateEntityAPI({ afterUpdate: newData, beforeUpdate: oldData, token: context.token, entityName: props.name })
                context.showSnackbar(`${props.entityLabel.toLowerCase()} was updated (${oldData.name})`);
              } catch(err) {
                context.showSnackbar(err);
              }
              
            }
          }
        }
      />
    </StyledTableWrapper>
  );
}

export default DisplayEntity;
