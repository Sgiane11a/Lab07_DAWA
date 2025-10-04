(function() {
    const token = sessionStorage.getItem('jwtToken');

    if (!token) {
        console.log('No token found, redirecting to signIn.');
        window.location.href = '/signIn';
        return;
    }

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        const isExpired = payload.exp * 1000 < Date.now();

        if (isExpired) {
            console.log('Token is expired, redirecting to signIn.');
            sessionStorage.removeItem('jwtToken');
            window.location.href = '/signIn';
        }
    } catch (e) {
        console.error('Invalid token, redirecting to signIn.', e);
        sessionStorage.removeItem('jwtToken');
        window.location.href = '/signIn';
    }
})();