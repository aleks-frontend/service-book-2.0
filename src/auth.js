import jwtDecode from 'jwt-decode';
import fetchApi from './fetchApi';

let inMemoryToken = null;
let inMemoryUser = null;

let routerHistory;

const appLogin = ({ history, token, user }) => {
    inMemoryToken = token;
    routerHistory = history;

    //set default thumbnail
    if (user && !user.thumbnail) {
        user.thumbnail = 'https://www.computerhope.com/jargon/g/geek.jpg';
    }
    inMemoryUser = user;

    refreshToken(token);

    //redirect to home
    history.push('/');
}

const appLogout = async (history) => {
    inMemoryToken = null
    inMemoryUser = null;

    //logout endpoint will invalidate refresh token
    await fetchApi({
        url: '/auth/logout',
        method: 'GET'
    });

    //trigger event to logout app in other tabs
    window.localStorage.setItem('logout', Date.now());

    //redirect to login
    history.push('/login');
}

//event listener to logout app in other tabs
window.addEventListener('storage', (event) => {   
    if (event.key === 'logout') {
        inMemoryToken = null
        inMemoryUser = null;
        routerHistory.push('/login')
    }
});


const refreshToken = (token) => {
    //get new token before it expires, using refreshToken
    const decoded = jwtDecode(token);
    const tokenValidityMilliSeconds = new Date(decoded.exp * 1000 - new Date());

    //get new token 60 seconds before it expires
    setTimeout(async () => {
        const response = await fetchApi({
            url: '/auth',
            method: 'POST'
        });

        if (response && response.status === 200 && response.data.token) {
            inMemoryToken = response.data.token;
            refreshToken(response.data.token);
        }
    }, tokenValidityMilliSeconds - 60 * 1000);
}

const updateUser = (user) => {
    inMemoryUser = user;
}

const getAppToken = () => inMemoryToken;

const getAppUser = () => inMemoryUser;


export { appLogin, appLogout, getAppToken, updateUser, getAppUser }