import React from 'react';
import { Redirect } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import styled from 'styled-components';

import LoadingSpinner from './UI/LoadingSpinner';

import { colors, statusEnum, svgIcons } from '../helpers';
import getEarningsPerMonthAPI from '../API/getEarningsPerMonth';
import getServicesCountByStatusAPI from '../API/getServicesCountByStatus';
import validateUserAPI from '../API/validateUser';
import { AppContext } from './AppProvider';

const StyledGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 20rem auto;
  grid-gap: 2rem;
  width: 800px;
  max-width: 100%;

  .cell {  
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: #fff;
    border-radius: 0.4rem;

    .header {
      padding: 1rem;
      font-size: 2rem;
      color: #fff;
      background: ${colors.rdgray2}; }
      
    .body { 
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      
      &--padding { padding: 2rem 1rem; } 
    }

    &--grid  { 
      grid-column: span 2; 
      height: 40rem; }

    &--clickable:hover { cursor: pointer; }
  }
`;

const StyledThumbnail = styled.div`
  display: flex;
  flex: 1;

  .digit {
    flex-basis: 40%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 13rem;
    color: ${colors.rdgray}; }
`;

const StyledFrame = styled.div`
  flex-basis: 60%;
  display: flex;
  align-items: center;
  justify-content: center;

    .frame {
      display: flex;
      flex-direction: column;
      width: 60%;
      height: 60%;
      border: 0.1rem solid ${colors.rdgray2};
      border-radius: 0.3rem;

      .header {
        padding: 0.5rem 0.9rem;
        font-size: 1.1rem;
      }

      .body {
        .icon {
          width: 25%;
          margin: 0 0.5rem; 

          svg path { fill: ${props => props.status === statusEnum.COMPLETED ? colors.green : colors.orange}; }
        }

        .label {
          margin: 0 0.5rem; 
          color: ${colors.rdgray};
          font-size: 1.1rem; }
      }
    }
`;

const Home = (props) => {
    const context = React.useContext(AppContext);
    const { token } = context;
    const isGoogleRedirect = props.match && props.match.params && props.match.params.userId && props.match.params.token;
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
        if (!isGoogleRedirect) {
            const earningsPromise = getEarningsPerMonthAPI(token);
            const servicesInProgressPromise = getServicesCountByStatusAPI({ token, status: statusEnum.INPROGRESS });
            const servicesCompletedPromise = getServicesCountByStatusAPI({ token, status: statusEnum.COMPLETED });

            Promise.all([earningsPromise, servicesInProgressPromise, servicesCompletedPromise])
                .then((results) => {
                    setState({
                        ...state,
                        apiData: {
                            earningsPerMonth: results[0].data,
                            monthsLabels: results[0].labels,
                            servicesCount: {
                                inProgress: results[1],
                                completed: results[2]
                            }
                        },
                        dataReady: true
                    })
                });

        }
    }, []);

    // We are validating user's ID and token after Google login
    if (isGoogleRedirect) {
        if (context.userStatus === 'logged-out') {
            const { token } = props.match.params;
            const data = validateUserAPI(token);

            if (!data.error) {
                const { user } = data;
                if (user.isApproved) {
                    context.setUserInfo({ token: token, userStatus: 'logged-in', user });
                } else {
                    context.setUserInfo({ userStatus: 'not-approved' });
                }
            } else {
                context.setUserInfo({ userStatus: 'invalid' });
            }
        }

        if (context.userStatus === 'logged-in') {
            return <Redirect to="/" />
        } else if (context.userStatus === 'invalid') {
            return <Redirect to={{
                pathname: '/login',
                message: "Better luck next time!"
            }} />
        } else if (context.userStatus === 'not-approved') {
            return <Redirect to={{
                pathname: '/login',
                message: "You are not an approved user yet."
            }} />
        } else {
            return <div>Loading...</div>
        }
    }

    if (context.userStatus === 'logged-out') return <Redirect to='/login' />;

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
    const renderThumbnails = () => {
        const thumbnailsInfo = [
            {
                statusEnum: statusEnum.INPROGRESS,
                header: 'Services in progress',
                servicesCount: state.apiData.servicesCount.inProgress,
                svgIcon: svgIcons.inProgress,
                label: 'In Progress'
            },
            {
                statusEnum: statusEnum.COMPLETED,
                header: 'Completed services',
                servicesCount: state.apiData.servicesCount.completed,
                svgIcon: svgIcons.completed,
                label: 'Completed'
            }
        ];

        return thumbnailsInfo.map((thumbnail, index) => {
            const { statusEnum, header, servicesCount, svgIcon, label } = thumbnail;
            return (
                <div
                    className="cell cell--clickable"
                    onClick={() => goToFilteredServices(statusEnum)}
                    key={index}
                >
                    <div className="header">{header}</div>
                    <div className="body">
                        <StyledThumbnail>
                            <div className="digit">
                                {servicesCount}
                            </div>
                            <StyledFrame status={statusEnum}>
                                <div className="frame">
                                    <div className="header">Status</div>
                                    <div className="body">
                                        <div className="icon" dangerouslySetInnerHTML={{ __html: svgIcon }}></div>
                                        <div className="label">{label}</div>
                                    </div>
                                </div>
                            </StyledFrame>
                        </StyledThumbnail>
                    </div>
                </div>
            )
        });
    }

    const renderGrid = () => {
        return (
            <StyledGrid>
                {renderThumbnails()}
                <div className="cell cell--grid">
                    <div className="header">Earnings (Last 6 months)</div>
                    <div className="body body--padding">
                        <Bar
                            data={getChartData()}
                            legend={null}
                            options={{
                                maintainAspectRatio: false
                            }}
                        />
                    </div>
                </div>
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
