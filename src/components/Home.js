import React from 'react';
import { Redirect } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';

import LoadingSpinner from './UI/LoadingSpinner';

import { colors, statusEnum, svgIcons } from '../helpers';
import { AppContext } from './AppProvider';

import { getAppToken } from '../auth';
import fetchApi from '../fetchApi';
import Thumbnail from './UI/Thumbnail';
import StatusBox from './UI/StatusBox';
import { StyledGrid, StyledGridItem } from './styled-components/styledGrid';

const Home = (props) => {
    const context = React.useContext(AppContext);
    const token = getAppToken();

    const [state, setState] = React.useState({
        dataReady: false,
        apiData: {
            earningsPerMonth: null,
            monthsLabels: null,
            servicesCount: {
                inProgress: 0,
                completed: 0
            }
        }
    });

    React.useEffect(() => {
        const earningsPromise = fetchApi({
            url: '/reports/earningsPerMonth',
            method: 'GET',
            token
        });
        const servicesInProgressPromise = fetchApi({
            url: '/reports/serviceCount',
            method: 'POST',
            token,
            body: { status: statusEnum.INPROGRESS }
        });
        const servicesCompletedPromise = fetchApi({
            url: '/reports/serviceCount',
            method: 'POST',
            token,
            body: { status: statusEnum.COMPLETED }
        });

        Promise.all([earningsPromise, servicesInProgressPromise, servicesCompletedPromise])
            .then((results) => {
                let earnings;
                if (results[0].status === 200) {
                    earnings = results[0].data;
                } else {
                    earnings = {
                        data: [],
                        labels: []
                    }
                }
                const servicesInProgress = results[1].data;
                const servicesCompleted = results[2].data;

                setState({
                    ...state,
                    apiData: {
                        earningsPerMonth: earnings.data,
                        monthsLabels: earnings.labels,
                        servicesCount: {
                            inProgress: servicesInProgress,
                            completed: servicesCompleted
                        }
                    },
                    dataReady: true
                })
            });
    }, []);


    // Getting the data for the Chart
    const getChartData = () => {
        return {
            labels: state.apiData.monthsLabels,
            datasets: [
                {
                    label: 'Earnings per month',
                    backgroundColor: colors.rdblue,
                    borderColor: colors.rddarkgray,
                    borderWidth: 1,
                    hoverBackgroundColor: colors.rdgray2,
                    hoverBorderColor: colors.rddarkgray,
                    data: state.apiData.earningsPerMonth
                }
            ]
        }
    }

    // Redirecting to History after Thumbnail click
    const goToFilteredServices = (status) => {
        const historyFilters = context.setFilters({ status: [status] }, true);

        setState({
            ...state,
            redirectToHistory: true,
            historyFilters
        });
    }

    // Render methods
    const renderStatusBoxes = () => {
        const statusBoxesInfo = [
            {
                statusEnum: statusEnum.INPROGRESS,
                header: 'Services in progress',
                servicesCount: state.apiData.servicesCount.inProgress,
                svgIcon: svgIcons.inProgress,
                iconColor: colors.orange,
                label: 'In Progress'
            },
            {
                statusEnum: statusEnum.COMPLETED,
                header: 'Completed services',
                servicesCount: state.apiData.servicesCount.completed,
                svgIcon: svgIcons.completed,
                iconColor: colors.green,
                label: 'Completed'
            }
        ];

        return statusBoxesInfo.map((thumbnail, index) => {
            const { statusEnum, header, servicesCount, svgIcon, iconColor, label } = thumbnail;
            return (
                <StyledGridItem
                    clickable={true}
                    onClick={() => goToFilteredServices(statusEnum)}
                    key={index}
                >
                    <Thumbnail header={header}>
                        <StatusBox 
                            statusEnum={statusEnum} 
                            svgIcon={svgIcon} 
                            iconColor={iconColor}
                            label={label} 
                            servicesCount={servicesCount}
                        />
                    </Thumbnail>                    
                </StyledGridItem>
            )
        });
    }
    
    
    const renderGrid = () => {
        return (
            <StyledGrid>
                {renderStatusBoxes()}
                <StyledGridItem 
                    gridColumnTablet="1 / -1" 
                    gridRowTablet="span 2"
                    gridColumnDesktop="2 / -1" 
                    gridRowDesktop="1 / -1"
                >
                    <Thumbnail 
                        header="Earnings (Last 6 months)" 
                        padding="2rem 1rem"
                        minHeight="35rem"
                    >
                        <Bar
                            data={getChartData()}
                            legend={null}
                            options={{
                                maintainAspectRatio: false
                            }}
                        />
                    </Thumbnail>
                </StyledGridItem>
            </StyledGrid>
        );
    }

    return (
        <React.Fragment>
            {state.redirectToHistory ?
                <Redirect to={{
                    pathname: '/history',
                    historyFilters: state.historyFilters
                }} /> :
                state.dataReady ? renderGrid() : <LoadingSpinner />}
        </React.Fragment>
    )
}

export default Home;
