import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { AppContext } from './AppProvider';

const Home = (props) => {
    const context = React.useContext(AppContext);

    const validateUser = async () => {
        const { match: { params } } = props;

        const response = await fetch('https://radiant-crag-38285.herokuapp.com/users/me', {
            method: 'GET',
            headers: {
                'x-auth-token': params.token,
            }
        });

        if (response.status === 200) {
            const user = await response.json();

            if ( user.isApproved ) {
                localStorage.setItem('userName', user.name);
                localStorage.setItem('thumbnail', user.thumbnail);
                
                context.setUserInfo({token: params.token, userStatus: 'logged-in', user});
            } else {
                context.setUserInfo({userStatus: 'not-approved'});
            }

        } else {
            const errorText = await response.text();
            context.setUserInfo({userStatus: 'invalid'});
        }
    }    

    if (props.match && props.match.params && props.match.params.userId) {
        if ( context.userStatus === 'logged-out' ) validateUser();

        if (context.userStatus === 'logged-in') {
            return <Redirect to="/" />
        } else if ( context.userStatus === 'invalid' ) {
            return <Redirect to={{
                pathname: '/login',
                message: "Better luck next time!"
            }} />            
        } else if ( context.userStatus === 'not-approved' ) {
            return <Redirect to={{
                pathname: '/login',
                message: "You are not an approved user yet."
            }} />            
        } else {
            return <div>Loading...</div>
        }
    } else {
        if ( context.userStatus === 'logged-out' ) return <Redirect to='/login' />;
        
        const thumbnail = context.user.thumbnail ? context.user.thumbnail : 'https://www.computerhope.com/jargon/g/geek.jpg';

        return (
            <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                <div style={{width: 200, height: 200, background: `url(${thumbnail})`, backgroundSize: 'cover', borderRadius: '50%'}} />

                Hello <strong>{context.user.name}</strong>! We are really really glad to see your name here
                <button onClick={() => { context.setUserInfo({userStatus: 'logged-out', user: null}) }}>Logout</button>
            </div>
        )
    }
}


export default Home;
