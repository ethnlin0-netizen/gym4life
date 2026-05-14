function Login() {
    /*Placeholder for now, real login logic goes here later*/
    function doLogin(event: React.MouseEvent): void {
        event.preventDefault();

        alert('doIt()');
    }

    return(
        <div id="loginDiv">
            <span id="inner-title">PLEASE LOG IN</span><br />
            <input type="text" id="loginName" placeholder="Login" /><br />
            <input type="password" id="loginPassword" placeholder="Password" /><br />
            <input type="submit" id="loginButton" className="buttons" value="Do It" onClick={doLogin} />
            <span id="loginResult"></span>
        </div>
    );
};

export default Login;