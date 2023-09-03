

let userLoggedIn = null;

export function setUserLoggedIn(user) {
    userLoggedIn = user;
}

export function getUserLoggedIn() {
    return userLoggedIn;
}