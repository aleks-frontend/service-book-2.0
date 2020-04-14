import React from 'react';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/core/styles';

import { AppContext } from './AppProvider';

import PrivateRoute from './PrivateRoute';
import Home from './Home';
import Side from './UI/Side';
import Nav from './UI/Nav';
import Header from './UI/Header';
import Content from './UI/Content';
import NewService from './NewService';
import History from './History';
import Profile from './Profile';
import Entities from './Entities';
import ServiceForm from './ServiceForm';
import NotFound from './NotFound';
import styled from 'styled-components';

const MainWrapper = styled.div`
    min-height: 100vh;
    display: flex;
    flex-direction: column;
`;

const MainBody = styled.div`
    flex: 1;
    display: flex;
`;

const useStyles = makeStyles(theme => ({
    close: {
        padding: theme.spacing(0.5),
    }
}));

const Main = () => {
    const context = React.useContext(AppContext);
    const classes = useStyles();

    const renderSnackbar = () => {
        return (
            <Snackbar
                anchorOrigin={{
                    vertical: 'bottom',
                    horizontal: 'center',
                }}
                open={context.snackbarVisible}
                autoHideDuration={3000}
                onClose={context.hideSnackbar}
                ContentProps={{
                    'aria-describedby': 'message-id',
                }}
                message={<span id="message-id">{context.snackbarMessage}</span>}
                action={[
                    <IconButton
                        key="close"
                        aria-label="close"
                        color="inherit"
                        className={classes.close}
                        onClick={context.hideSnackbar}
                    >
                        <CloseIcon />
                    </IconButton>,
                ]}
            />
        );
    }    
    
    return (
        <BrowserRouter>
            <MainWrapper>
                <Header title="Header title" />
                <MainBody>
                    <Side>
                        <Nav />
                    </Side>
                    <Content>
                        <Switch>
                            <PrivateRoute exact path='/' component={Home} />
                            <PrivateRoute exact path='/new-service' component={ServiceForm} />
                            <PrivateRoute exact path='/history' component={History} />
                            <PrivateRoute exact path='/customers' component={Entities} key="customers" entityName="customers" entityLabel="Customer" />
                            <PrivateRoute exact path='/actions' component={Entities} key="actions" entityName="actions" entityLabel="Action" />
                            <PrivateRoute exact path='/devices' component={Entities} key="devices" entityName="devices" entityLabel="Device" />
                            <PrivateRoute exact path='/profile' component={Profile} />
                            <Route component={NotFound} />
                        </Switch>
                    </Content>
                </MainBody>
                {renderSnackbar()}
            </MainWrapper>
        </BrowserRouter>
    );
};

export default Main;