import useAuth from './hooks/userAuth'
import { Input } from 'antd';
import { motion,AnimatePresence } from "framer-motion"
import { UserOutlined,LoadingOutlined,MailOutlined} from '@ant-design/icons';
import {useState,useEffect} from 'react'
import axios from 'axios'
function Login() {
    const {authUser}=useAuth();
    const [sign,setSign]=useState(true)
    const [loading,setLoading]=useState(false)
    const [email,setEmail]=useState(null)
    const [name,setName]=useState(null)
    const [pw,setPw]=useState(null)
    const [key,setKey]=useState(null)
    const [warning,setWarning]=useState('Welcome back! Please enter your email address correctly')
    const [quote,setQuote]=useState(null)
    useEffect(() => {
        axios.get('https://api.quotable.io/random')
        .then(function (response) {
            setQuote({content:response.data.content,author : response.data.author})
        })
        .catch(function (error) {
            console.log(error);
        })
        
    }, [])
    useEffect(() => {
        (email&&!sign)?setWarning("You will get a confirmation email in "+ email):<></>;
    }, [email])
    useEffect(() => {
        (!sign)?setWarning("Enter your personal details and start journey with us"):setWarning("Welcome back! Please enter your email address correctly");
        setName(null);setEmail(null);setPw(null);setKey(null);
    }, [sign])
    useEffect(() => {
        (sign&&key&&key['token'])?setWarning("Login Successful"):
            <>
            {(sign&&key&&key['1']==="verify")?setWarning("Verify your email address"):
                (sign&&key)?setWarning("Login Failed"):<></>}</>;
        
        (!sign&&key&&key['1']===-1)?setWarning("Email Address already registered"):
            <>
            {(!sign&&key&&key['1']===1)?setWarning("Verification email sent"):<></>}
            </>
    }, [key])
    const handleLogin=()=>{
        if(email&&pw){
            axios({
                method: 'post',
                url: 'https://greenclubiitgn.pythonanywhere.com/login',
                data: email+"#1#$"+pw
              }).then((response)=>{
                  (response.status===200)?setKey(response.data):setWarning("Some error.");
              })
        }
        else
            setWarning("Please fill all fields");
        }
    const handleRegister=()=>{
        if(name&&email&&pw){
            axios({
                method: 'post',
                url: 'https://greenclubiitgn.pythonanywhere.com/register',
                data: name+"#1#$"+email+"#1#$"+pw
              }).then((response)=>{
                  (response.status===200)?setKey(response.data):setWarning("Some error.");
              })
        }
        else
            setWarning("Please fill all fields");
        }


    return (
        
        <div className="w-screen h-screen flex flex-col items-center justify-center bg-bg bg-cover bg-no-repeat">
            <div className="flex md:flex-row flex-col w-3/4 h-3/4 shadow-indigo-900 shadow-xl rounded-3xl overflow-hidden">
                <div className="md:w-3/5 w-full flex flex-col  items-center justify-center   md:h-full h-2/5  bg-gradient-to-r from-indigo-500 to-purple-800">
                    <div className="w-full h-full bg-logo bg-no-repeat bg-center">
                    </div>
                    <div className="text-center mb-4 w-4/5 flex flex-row text-white font-popxs text-xs">"{quote?quote.content:null}"..</div>
                </div>
                <div className="bg-white md:w-2/5 w-full md:h-full h-3/5 flex flex-col items-center justify-center">
                <AnimatePresence exitBeforeEnter>
                {sign?<motion.div 
                    key={`signIndiv`}
                    initial={{opacity:0,y:-10}}
                    animate={{opacity:1,y:0,transition:{duration:0.4}}}
                    exit={{opacity:0,y:10,transition:{duration:0.4}}}
                    className="md:h-2/5 h-4/5 flex flex-col justify-between items-center">
                    <h1 className="font-pop text-center text-indigo-700 text-lg">Login your account</h1>
                    {warning?<h1 className="font-pop text-center text-gray-400 text-xs w-4/5">{warning}.</h1>:<></>}
                    <div className="flex flex-col items-center justify-around h-2/5">
                        <Input size="large" onChange={(evt)=>setEmail(evt.target.value)} className="font-pop shadow-inner" placeholder="Username" prefix={<UserOutlined />} />
                        <Input.Password onChange={(evt)=>setPw(btoa(evt.target.value))} className="font-pop shadow-inner" size="large" placeholder="Password" />
                        
                    </div>
                    <div className="transition bg-gradient-to-r text-xs from-indigo-500 to-purple-500 hover:from-indigo-400 text-white py-2 px-8 rounded-3xl cursor-pointer font-pop" onClick={handleLogin}>{loading?<LoadingOutlined />:""}Login</div>
                    <h1 className="font-pop text-center text-xs text-indigo-700 cursor-pointer" onClick={()=>setSign(!sign)}>Create account</h1>
                </motion.div>:
                <motion.div 
                key={`signUpdiv`}
                initial={{opacity:0,y:-10}}
                animate={{opacity:1,y:0,transition:{duration:0.4}}}
                exit={{opacity:0,y:10,transition:{duration:0.4}}}
                className="md:h-3/5 h-4/5 flex flex-col justify-between items-center">
                <h1 className="font-pop text-center text-indigo-700 text-lg">Create new account</h1>
                {warning?<h1 className="font-pop text-center text-gray-400 text-xs w-4/5">{warning}.</h1>:<></>}
                <div className="flex flex-col items-center justify-around h-2/5">
                    <Input size="large" onChange={(evt)=>setName(evt.target.value)} className="font-pop shadow-inner" placeholder="Name" prefix={<UserOutlined />} />
                    <Input size="large" onChange={(evt)=>setEmail(evt.target.value)} className="font-pop shadow-inner" placeholder="Email" prefix={<MailOutlined />} />
                    <Input.Password onChange={(evt)=>setPw(btoa(evt.target.value))} className="font-pop shadow-inner" size="large" placeholder="Password" />
                </div>
                <div className="transition bg-gradient-to-r text-xs from-indigo-500 to-purple-500 hover:from-indigo-400 text-white py-2 px-8 rounded-3xl cursor-pointer font-pop" onClick={handleRegister}>Create</div>
                <h1 className="font-pop text-center text-xs text-indigo-700 cursor-pointer" onClick={()=>setSign(!sign)}>Sign in to your account</h1>
                </motion.div>
                }
                </AnimatePresence>
                <h1 className="font-pop text-center text-xs text-indigo-700 mt-12 cursor-pointer">Forgot Password?</h1>
                </div>
            </div>
            <div className=" absolute bottom-2 flex justify-center">
                <div className="text-white font-pop mr-2">copyright </div>
                <img className="h-4 mt-1 mr-1" src={require("./images/small_logo.png")} alt=""/>
                <div className="text-white font-popxl">Green Club </div>
            </div>
        </div>
        

    )
}

export default Login
