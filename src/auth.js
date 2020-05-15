import jwtDecode from 'jwt-decode';

let inMemoryToken = null;
let inMemoryUser = null;

const appLogin = ({ history, token, user }) => {
    inMemoryToken = token;

    //set default thumbnail
    if (user && !user.thumbnail) {
        user.thumbnail = 'https://www.computerhope.com/jargon/g/geek.jpg';
    }
    inMemoryUser = user;

    //redirect to home
    history.push('/');
}

const appLogout = (history) => {
    inMemoryToken = null
    inMemoryUser = null;

    //redirect to login
    history.push('/login');
}

const getAppToken = () => inMemoryToken;

const getAppUser = () => inMemoryUser;


export { appLogin, appLogout, getAppToken, getAppUser }