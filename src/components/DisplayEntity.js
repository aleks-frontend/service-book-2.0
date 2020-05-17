import React from 'react';
import styled from 'styled-components';
import MaterialTable from 'material-table';
import tableIcons from '../tableIcons';
import { AppContext } from './AppProvider';

import fetchApi from '../fetchApi';
import { getAppToken } from '../auth';
import singleLineString from '../singleLineString';

const StyledTableWrapper = styled.div`
  width: 100%;

  .MuiTableCell-root { font-size: 1.1rem; }
  .MuiTypography-caption { font-size: 1rem; }
`;

const DisplayEntity = (props) => {
  const context = React.useContext(AppContext);
  const token = getAppToken();
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

  const getEntities = async (query) => {
    const url = singleLineString`/${props.name}?
        per_page=${query.pageSize}
        &page=${query.page}
        &search=${query.search}
        &orderByColumn=${query.orderBy ? query.orderBy.field : ''}
        &orderDirection=${query.orderDirection}`

    const result = (await fetchApi({
      url,
      method: 'GET',
      token
    })).data;

    return {
      data: result.data,
      page: result.page,
      totalCount: result.totalCount,
    }
  }

  const updateEntity = (id, newEntity) => {
    const url = `/${props.name}/${id}`;
    delete newEntity._id;
    delete newEntity.__v;

    return fetchApi({
      url,
      method: 'PUT',
      token,
      body: newEntity
    });
  }

  const deleteEntity = (id) => {
    const url = `/${props.name}/${id}`;
    return fetchApi({
      url,
      method: 'DELETE',
      token
    });
  }

  return (
    <StyledTableWrapper>
      <MaterialTable
        className="test"
        icons={tableIcons}
        tableRef={tableRef}
        title=""
        columns={columns}
        data={(query) => {
          return getEntities(query);
        }
        }
        editable={
          {
            onRowDelete: async (oldData) => {
              const response = await deleteEntity(oldData._id);
              if (response.status === 200) {
                context.showSnackbar(`${props.entityLabel.toLowerCase()} was deleted (${oldData.name})`);
              } else {
                context.showSnackbar(response.data);
              }
            },
            onRowUpdate: async (newData, oldData) => {
              const response = await updateEntity(oldData._id, newData);
              if (response.status === 200) {
                context.showSnackbar(`${props.entityLabel.toLowerCase()} was updated (${oldData.name})`);
              } else {
                context.showSnackbar(response.data);
              }
            }
          }
        }
      />
    </StyledTableWrapper>
  );
}

export default DisplayEntity;
