
const login = async (username, password) => {
    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            body: JSON.stringify({
                username,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status === 200;
    } catch(e) {
        console.error(e.message);
        return false;
    }
}

const register = async (email, username, password) => {
    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            body: JSON.stringify({
                email,
                username,
                password
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return response.status === 200;
    } catch(e) {
        console.error(e.message);
        return false;
    }
}

const isLoggedIn = async() => {
    return fetch('/auth/isLoggedIn').then(async response => {
        return await response.json();
    });
}

export default { login, register, isLoggedIn };