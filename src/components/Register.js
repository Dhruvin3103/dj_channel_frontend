import React, {useRef, useState, useEffect} from 'react'
import { faCheck, faTimes, faInfoCircle, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import '../index.css';
import axios from '../api/axios';
import { useNavigate } from 'react-router-dom';
const userRegex = /^[a-zA-Z0-9_]{2,20}$/;
const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const Register = () => {
    const userRef = useRef();
    const errRef = useRef();
    const navigate = useNavigate();
    const [user, setUser] = useState('');
    const [validName, setValidName] = useState(false);
    const [userFocus, setUserFocus] = useState(false);

    const [email, setEmail] = useState('');
    const [validEmail, setValidEmail] = useState(false);
    const [emailFocus, setEmailFocus] = useState(false);

    const [pwd, setPwd] = useState('');
    const [validPwd, setValidPwd] = useState(false);
    const [pwdFocus, setPwdFocus] = useState(false);

    const [matchPwd, setMatchPwd] = useState('');
    const [validMatch, setValidMatch] = useState(false);
    const [matchFocus, setMatchFocus] = useState(false);

    const [errMsg, setErrMsg] = useState('');
    const [success, setSuccess] = useState(false);

    const [showPassword, setShowPassword] = useState(false);
    const [showMatchPassword, setShowMatchPassword] = useState(false);

    useEffect(() => {
        userRef.current.focus();
    }, [])

    useEffect(() => {
        setValidEmail(emailRegex.test(email));
    }, [email]);

    useEffect(() => {
        setValidName(userRegex.test(user));
    }, [user])

    useEffect(() => {
        setValidPwd(passRegex.test(pwd));
        setValidMatch(pwd === matchPwd);
    }, [pwd, matchPwd])

    useEffect(() => {
        setErrMsg('');
    }, [user, pwd, matchPwd])


    const handleSubmit = async (e) => {
        e.preventDefault();
        const v1 = userRegex.test(user);
        const v2 = passRegex.test(pwd);
        const v3 = emailRegex.test(email); 
        if (!v1 || !v2 || !v3) { 
            setErrMsg("Invalid Entry");
            return;
        }
        
        const formData = new FormData();
        formData.append('password', pwd);
        formData.append('username', user);
        formData.append('email', email);

        const headers = {
            'Content-Type': 'multipart/form-data', // This is important for form data
            // Add any additional headers you need, such as authorization headers
        };

        try {
            const response = await axios.post('/auth/users/', formData, { headers });
            console.log(response.data);
            navigate('/login')
        } catch (error) {
            if (error.response) {
                const { status, data } = error.response;
                
                if (status === 400) {
                    if (data.username) {
                        console.log(data.username)
                        setErrMsg(data.username[0]);
                    }
                    if (data.email) {
                        setErrMsg(data.email[0]);
                    }
                }
            } else {
                console.error(error);
            }
        }
    };

    const onBtnSubmit = () =>{
        console.log('go signin')
        navigate('/login')
    }
    return (
        <>
        {success ? (
            <section>
                <h1>Success!</h1>
                <p>
                    <a href="#">Sign In</a>
                </p>
            </section>
        ) : (
            <section>
                <p ref={errRef} className={errMsg ? "errMsg" : "offscreen"} aria-live='assertive'>{errMsg}</p>

                <h1>Sign up </h1>

                <form onSubmit={handleSubmit}>
                    <label htmlFor='username'>
                        Username :
                        <FontAwesomeIcon icon={faCheck} className={validName ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validName || !user ? "hide" : "invalid"} />
                    </label>
                    <input
                        required
                        type='text'
                        id='username'
                        ref={userRef}
                        autoComplete='off'
                        onChange={e=>setUser(e.target.value)}
                        aria-invalid={validName ? "false":"true"}
                        aria-describedby='uidnote'
                        onFocus={()=>setUserFocus(true)}
                        onBlur={()=>setUserFocus(false)}
                    />
                    <p id='uidnote' className={userFocus && user && !validName ? 'instruction' : 'offscreen'}>
                        <FontAwesomeIcon icon={faInfoCircle}/>
                        2 to 24 characters.<br/>
                        Must begin with a letter.<br/>
                        Letters, numbers, underscores, hyphens allowed.
                    </p>

                    <label htmlFor="email">
                        Email:
                        <FontAwesomeIcon icon={faCheck} className={validEmail ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validEmail || !email ? "hide" : "invalid"} />
                    </label>
                    <input
                        type="email"
                        id="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                        aria-invalid={validEmail ? "false" : "true"}
                        aria-describedby="emailnote"
                        onFocus={() => setEmailFocus(true)}
                        onBlur={() => setEmailFocus(false)}
                    />
                    <p id="emailnote" className={emailFocus && !validEmail ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Please enter a valid email address.
                    </p>

                    <label htmlFor="password">
                        Password:
                        <FontAwesomeIcon icon={faCheck} className={validPwd ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validPwd || !pwd ? "hide" : "invalid"} />
                    </label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        onChange={(e) => setPwd(e.target.value)}
                        value={pwd}
                        required
                        aria-invalid={validPwd ? "false" : "true"}
                        aria-describedby="pwdnote"
                        onFocus={() => setPwdFocus(true)}
                        onBlur={() => setPwdFocus(false)}
                    />
                    <span
                        className="password-toggle"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                        <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} size="lg" />
                    </span>
                    <p id="pwdnote" className={pwdFocus && !validPwd ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        8 to 24 characters.<br />
                        Must include uppercase and lowercase letters, a number and a special character.<br />
                        Allowed special characters: <span aria-label="exclamation mark">!</span> <span aria-label="at symbol">@</span> <span aria-label="hashtag">#</span> <span aria-label="dollar sign">$</span> <span aria-label="percent">%</span>
                    </p>

                    <label htmlFor="confirm_pwd">
                        Confirm Password:
                        <FontAwesomeIcon icon={faCheck} className={validMatch && matchPwd ? "valid" : "hide"} />
                        <FontAwesomeIcon icon={faTimes} className={validMatch || !matchPwd ? "hide" : "invalid"} />
                    </label>
                    <input
                        type="password"
                        id="confirm_pwd"
                        onChange={(e) => setMatchPwd(e.target.value)}
                        value={matchPwd}
                        required
                        aria-invalid={validMatch ? "false" : "true"}
                        aria-describedby="confirmnote"
                        onFocus={() => setMatchFocus(true)}
                        onBlur={() => setMatchFocus(false)}
                    />
                    <p id="confirmnote" className={matchFocus && !validMatch ? "instructions" : "offscreen"}>
                        <FontAwesomeIcon icon={faInfoCircle} />
                        Must match the first password input field.
                    </p>

                    <button disabled={!validName || !validPwd || !validMatch || !validEmail ? true : false}>Sign Up</button>
                </form>
                <p>
                    Already registered?
                    <span className='line signup-link' onClick={onBtnSubmit} >
                        Sign In
                    </span>
                </p>
            </section>
        )}
        </>

  )
}


export default Register