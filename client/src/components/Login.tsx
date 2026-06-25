import {useState} from 'react';


function Login() {
    /*Placeholder for now, real login logic goes here later*/
    const [message, setMessage] = useState('');
    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    function doLogin(event: React.MouseEvent): void {
        event.preventDefault();

        alert('doIt() ' + login + ' ' + password);
    }

    function handleSetLogin( e:any ): void
    {
        setLogin(e.target.value);
    }

    function handleSetPassword( e:any ): void
    {
        setPassword(e.target.value);
    }

    return(
        <div id="loginDiv">
            <span id="inner-title">PLEASE LOG IN</span><br />
            <input type="text" id="loginName" placeholder="Login" onChange={handleSetLogin} /><br />
            <input type="password" id="loginPassword" placeholder="Password" onChange={handleSetPassword} /><br />
            <input type="submit" id="loginButton" className="buttons" value="Do It" onClick={doLogin} />
            <span id="loginResult">{message}</span>
        </div>
    );
};

export default Login;