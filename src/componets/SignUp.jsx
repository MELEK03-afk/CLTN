import React,{useState} from 'react'
import { motion } from "framer-motion";
import {Link,useNavigate} from "react-router-dom"
import axios from 'axios'
import toast, { Toaster, } from 'react-hot-toast';
import { MdErrorOutline } from "react-icons/md";

const pageVariants = {
  initial: { opacity: 0, y: 50 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  exit: { opacity: 0, y: -50, transition: { duration: 0.6 } },
};

function SignUp() {
  const [showForm , setShowForm] = useState(false)
  const [fullNameErr,setfullNameErr]=useState('')
  const [passwordErr,setpasswordErr]=useState('')
  const [emaildErr,setemaildErr]=useState('')
  const [phoneNumberErr,setPhoneNumberErr]=useState('')
  const [fullName,setFullName]=useState('')
  const [phoneNumber,setPhoneNumber]=useState('')
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  
  const navigate=useNavigate()
  const displayForm= ()=>{
    if (showForm === false) {
          
          return(
          <div className='signup'>
            <Toaster   containerStyle={{ marginTop: "5%" }}/>
            <h2>Create Your Account</h2>
            {/* <h3>Just a few quick things to get started</h3> */}
            {/* <h4>FullName</h4> */}
            <input type="text" placeholder='full Name' onChange={(e)=>setFullName(e.target.value)} className='inputsignup' />
            <p className='error'>{fullNameErr}</p>
            {/* <h4>PhoneNumber</h4> */}
            <input type="text" placeholder='phone Number' onChange={(e)=>setPhoneNumber(e.target.value)} className='inputsignup' />
            <p className='error'>{phoneNumberErr} </p>
            {/* <h4>E-mail</h4> */}
            <input type="text" placeholder='E-mail' onChange={(e)=>setEmail(e.target.value)} className='inputsignup' />
            <p className='error'>{emaildErr} </p>
            {/* <h4>Password</h4> */}
            <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)} className='inputsignup' />
            <p className='error'>{passwordErr} </p>
            <button className='btsign' onClick={signUp}>Sign Up</button>
            <h5 style={{color:" rgb(184, 183, 183)"}}>{showForm ? 'You don"t have Account?' : 'Already have Account?'} <Link style={{color:'black'}} onClick={() => setShowForm(!showForm)}>{showForm ? 'Sign Up' : 'Sign In'}</Link></h5>
          </div> )
    }
    else{
      return(
          <div className='signup'>
            <Toaster   containerStyle={{ marginTop: "5%" }}/>
            <h2>Create Your Account</h2>
            {/* <h3>Welcome Back you've been missed</h3> */}
            <input type="text" placeholder='E-mail' onChange={(e)=>setEmail(e.target.value)} style={{marginTop:"17%"}} className='inputsignin' />
            <p className='error'>{emaildErr} </p>
            <input type="password" placeholder='Password' onChange={(e)=>setPassword(e.target.value)} className='inputsignin' />
            <p className='error'>{passwordErr} </p>
            <button className='btsignin' onClick={singIn}>Sign In</button>
            <h5 style={{color:" rgb(184, 183, 183)"}}>{showForm ? 'You don"t have Account?' : 'Already have Account?'} <Link style={{color:'black'}} onClick={() => setShowForm(!showForm)}>{showForm ? 'Sign Up' : 'Sign In'}</Link></h5>
          </div>
      )
    }
  }

  function isNumber(phoneNumber) {
    var pattern = /^\d+\.?\d*$/;
    return pattern.test(phoneNumber);  // returns a boolean
}

const isValidS = () => {
  if(!fullName || !email || !password || !phoneNumber ){
    return false

}
return true
}

  const signUp= async()=>{

    // if(!fullName || !email || !password || !phoneNumber ){
    //   toast.error(`All fialds are required`)
    // }
    var checkPhone = isNumber(phoneNumber)
    if (!fullName.trim() || fullName.length<0) {
      setfullNameErr(
        <>
          Invalid full name <MdErrorOutline />
        </>
      );
    } else {
      setfullNameErr('');
    }
    
    if (password.length < 6) {
      setpasswordErr(
        < >
          Invalid password <MdErrorOutline />
        </>
      );      }
    else {
      setpasswordErr('')  }
    if(!checkPhone){
      setPhoneNumberErr(
        < >
          Invalid Phone Number <MdErrorOutline />
        </>
      );    }else {
      setPhoneNumberErr('')
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setemaildErr(
        < >
          Invalid Email <MdErrorOutline />
        </>
      );     }
    else{
      setemaildErr('')   }

      try {

        if(isValidS()){        
          const res = await axios.post('http://localhost:2024/api/signUp', {
            fullName,
            email,
            phoneNumber,
            password,
          });
          
          if (res.status === 201) {
            toast.success("Account created successfully");
            localStorage.setItem('user', JSON.stringify(res.data));
            setTimeout(() => {
              navigate("/");
            }, 1000);
      
            // Clear form
            setEmail('');
            setFullName('');
            setPhoneNumber('');
            setPassword('');
          } 
        }
        else{
          toast.error(`All fialds are required`)
        }
    
      } catch (error) {
        console.error(error);
        if (error.status != 200) {
          toast.error(error.response?.data?.message || 'Server error occurred');
        }      }
  }


const isValid = () => {
  if(!email || !password){
    return false

}
return true
}


  const singIn= async()=>{
    try {      
      console.log(isValid())
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        setemaildErr(
          < >
            Invalid Email <MdErrorOutline />
          </>
      );}
      if (password.length < 6) {
        setpasswordErr(
          < >
            Invalid password <MdErrorOutline />
          </>
      );}
      if(isValid()){
        const res= await axios.post('http://localhost:2024/api/signIn',{
          email,
          password
        })
  
        console.log(res.status)
        if(res.status === 200){
          toast.success("Welcome back")
          localStorage.setItem('user' , JSON.stringify(res.data))
          setTimeout(() => {
            navigate('/')
          }, 1000);
        }

      } else{
        toast.error('All fields are required')
      }
    } catch (error) {
      console.error(error);
      if (error.status != 200) {
        
        toast.error(error.response?.data?.message || 'Server error occurred');
      }

    }
  }




  return (
    
    <div className='backline'>
      <div className='backline-2'>

      </div>
      {/* <motion.div variants={pageVariants}   initial="initial" animate="animate" exit="exit" > */}
        {displayForm()}
      {/* </motion.div> */}
    </div>
  )
}

export default SignUp