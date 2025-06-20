import React, { useEffect,useState } from 'react'
import photo from '../images/cr7.jpeg'
import { Pencil,Mail,Phone ,ArrowDown,MapPinHouse  } from 'lucide-react';
import axios from 'axios';
import toast, { Toaster, } from 'react-hot-toast';
import {Link,useNavigate} from "react-router-dom"
import userP from '../images/cr7.jpeg'
import { use } from 'react';
import { motion } from "framer-motion";


function ProfilePage() {
  const [Statu,setStatu]=useState(true)
  const[fullName,setFullName]=useState('')
  const [selectValue,setSelect]=useState('Not passed')
  const[email,setEmail]=useState('')
  const[phoneNumber,setPhoneNumber]=useState('')
  const[password,setPassword]=useState('')
  const user=JSON.parse(localStorage.getItem('user'))
  const[color,setColor]=useState('rgb(255, 171, 55)')
  const[request,SetRequest]=useState([])
  const[Allrequest,SetAllRequest]=useState([])
  const[requestNP,SetRequestNP]=useState([])
  const [changheight,setChangheight]=useState(false)
  // const colorStatus = async() =>{
  //   if(request.status === 'Pending'){
  //     setColor('rgb(252, 197, 119)')
  //   }
  //   else if(request.status === 'Accepted'){
  //     setColor('#32DE8A')
  //   }
  //   else{
  //     setColor('rgb(222, 42, 42)')
  //   }
  // }

  const getRequest = async () => {
  try {
    console.log(user.id);
    
    const res = await axios.get(`http://localhost:2024/api/GetRequest/${user.id}`);
    if (res.status === 200) {
      SetAllRequest(res.data.request)
      SetRequest(res.data.request.filter(req => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date
        const reqDate = new Date(req.day);
        reqDate.setHours(0, 0, 0, 0); // Normalize request date
      return reqDate >= today; // Keep only today or future
     })); // <-- fixed here
      SetRequestNP(   res.data.request.filter(req => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Normalize today's date
        const reqDate = new Date(req.day);
        reqDate.setHours(0, 0, 0, 0); // Normalize request date
      return reqDate >= today; // Keep only today or future
     }))
    }
  } catch (error) {
    console.log(error);
  }
};

const Select = (value) => {
  if (value === 'All') {
    SetRequest(Allrequest);
  } else if (value === 'Not passed') {
    SetRequest(requestNP);
  }
};

useEffect(() => {
  getRequest();
}, []);

  const updateProfile = async (id) => {
    if (!id) {
      toast.error("Invalid user ID");
      return;
    }
  
    try {
      const res = await axios.put(`http://localhost:2024/api/UpdateUser/${id}`, {
        email,
        phoneNumber,
        fullName,
      });
  
      if (res.status === 200) {
        toast.success("Profile updated successfully");
        setStatu(true)
        localStorage.removeItem("user");
        localStorage.setItem("user", JSON.stringify(res.data));
        } 
  
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Server error occurred");
    }
  };
  

  const displayFrom=()=>{
    if (Statu === true) {
      return(
        <div className='dsp' >
          <Pencil className='iconProfile'  onClick={() => {  setStatu(false),setEmail(user.email),setFullName(user.fullName);setPhoneNumber(user.phoneNumber)
            // setUpdateAddress(field.address);            
          }}size={15}/>
          <h3>Donner Perssonnel</h3>
          <div id='PhoneDisplay'>
            <h4 >Name    :</h4>
            <h5 style={{marginLeft:"14%"}}>{user.fullName}</h5>
          </div>
          <div id='PhoneDisplay'>
            <h4>Email    :</h4>
            <h5><span style={{marginRight:"5%",marginTop:"2%"}}> <Mail size={20} /></span >  {user.email}</h5>
          </div>
          <div id='PhoneDisplay'>
            <h4>phoneNumber    :</h4>
            <h5><span style={{marginRight:"5%",marginTop:"2%"}}> <Phone size={20} /></span >  {user.phoneNumber}</h5>
          </div>
        </div>
      )
    }
    else{
      return(
          <div style={{width:'100%'}}>
            <h3>Donner Perssonnel</h3>
            <h4>Name    :</h4>
            <input type="text" value={fullName} onChange={(e)=>setFullName(e.target.value)}/>
            <h4>Email    :</h4>
            <input type="text" value={email} onChange={(e)=>setEmail(e.target.value)}/>
            <h4>phoneNumber    :</h4>
            <input type="text" onChange={(e)=>setPhoneNumber(e.target.value)} value={phoneNumber}/>
            
            <div style={{display:"flex",marginTop:"19%"}}>
              <button className='btProfile' style={{backgroundColor:"#BD1717"}}  onClick={()=>setStatu(true)}>Cancel</button>
              <button className='btProfile' style={{backgroundColor:"#11D677"}} onClick={()=>updateProfile(user.id)}>update</button>
            </div>
          </div>
      )
    }
  }
  const displayFromPhone=()=>{
    if (Statu === true) {
      return(
        <>
        <div className='dnpp'>
                <h4>Name:</h4>
                <h5>{user.fullName}</h5>
              </div>
              <div className='dnpp'>
                <Mail size={17} style={{marginLeft:"10px"}}/>
                <h5>{user.email}</h5>
              </div>
              <div className='dnpp'>
                <Phone size={17} style={{marginLeft:"10px"}}/>
                <h5>{user.phoneNumber}</h5>
              </div>
        </>
      )
    }
    else{
      return(
          <>
          </>
      )
    }
  }
  return (
    <div className='PofileComp'>
    <div className='headProfile'>
      </div>
      <div className='Profilesection'>
        <div className='GideProfile' style={{height: Statu === true ? '390px':'410px'}}>
          <Toaster/>
          {/* <motion.div variants={pageVariants}   initial="initial" animate="animate" exit="exit" > */}
          {displayFrom()}
          {/* </motion.div> */}
        </div>
        {/* <div className='GideProfileTab' style={{height: Statu === true ? '190px':'410px'}}>
          <Toaster/>
          {displayFrom()}
        </div> */}
        <div className='donnerProfile'>

            <div className="dp-2">
              <div style={{width:"100%",display:"flex",justifyContent:"space-between",alignItems:"center"}}>

              <h1>My Reservation</h1>
              <select value={selectValue} onChange={(e) => {
                const value = e.target.value;
                setSelect(value);
                Select(value);
              }}>
                <option value="All">All</option>
                <option value="Not passed">Not passed</option>
              </select>
                </div>
              <div className='MyPReservation'>
                {request.map((req, index) => {
                  const color =
                  req.status === 'Accepted' ? '#32DE8A' :
                  req.status === 'Pending' ? 'orange' :
                  req.status === 'Canceled' ? 'red' : 'gray';
                  return (
                    <div key={index} className='MyReservation'>
                      <h3>{req.fullName}</h3>
                      <h3>{req.title}</h3>
                      <h3>{req.time}</h3>
                      <h3>{new Date(req.day).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'long',
                        year: 'numeric'
                      })}</h3>
                      <h3>{req.price} dt
                      </h3>
                      <p style={{display:"flex",alignItems:"center",gap:"20px",padding:"5px",borderRadius:"10px",color:"black",backgroundColor: color}}>{req.status} </p>

                    </div>
                  );
                })}
              </div>

            </div>
        </div>
      </div>
      <div className='ProfilePhone'>
        <div className='donnerProfilePhone'>
          <h1>{user.fullName}</h1>
          <h3>{user.email}</h3>
          <div className='donnerProfilePhone-1'>
              {displayFromPhone()}
          </div>
        </div>
        <div className='reservationProfilePhone'>
          <div className='reservationProfilePhone-1'>
                <h3>My Reservation</h3>
                <select value={selectValue} onChange={(e) => {
                const value = e.target.value;
                setSelect(value);
                Select(value);
              }}>
                  <option value="Not passed">Not passed</option>
                  <option value="passed">passed</option>
                  <option value="All">All</option>
                </select>
          </div>
          <div className='reservationProfilePhone-2'>
            {request.map((req, index) => {
                  const color =
                  req.status === 'Accepted' ? '#32DE8A' :
                  req.status === 'Pending' ? 'orange' :
                  req.status === 'Canceled' ? 'red' : 'gray';
                  return (
                  <div className='reservation-donner'>
                    <div className='reservation-donner-1'>
                      <h5>City : Sidi Hassin</h5>
                      <h5>15:00  | 17 juin</h5>
                    </div>
                    <div className='reservation-donner-1'>
                      <h3>Bayerne</h3>
                    </div>
                    <div className='reservation-donner-1'>
                      <p style={{display:"flex",alignItems:"center",gap:"20px",padding:"5px",borderRadius:"10px",color:"black",backgroundColor: color,marginLeft:"9%"}}>{req.status} </p>
                    </div>
                  </div>
              );
              })}
          </div> 
        </div>
      </div>
    </div>
  )
}

export default ProfilePage