import React, { useEffect,useState } from 'react'
import { FaUser } from "react-icons/fa";
import { FaSearch } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { UserRound,House,Menu,BellRing ,X ,Scan  } from 'lucide-react';
import {Link,useNavigate} from "react-router-dom"
import KOP from '../images/KOP.png'
import bayrne from '../images/bayrne.jpg'
import KOF from '../images/KOF.png'
import axios from 'axios';

function HeadBar({activeStep,setActiveStep}) {
  const user = JSON.parse(localStorage.getItem('user'))
  const [showRow, setShowRow] = useState(false);
  const [showP, setShowp] = useState(false);
  const[Prequest,setPRequest]=useState([])
  const [requests,setRequests]=useState([])
  const [MenuPhone,setMenuPhone]=useState(false)
  const[Ring,setRing]=useState(false)
  // const Prequest.length = requests.filter(req => req.status === 'Pending');
  const navigate=useNavigate()

  const Notification = async () => {
    try {
      const res = await axios.get(`https://svko.onrender.com/api/Owner/get-Requests-Owner/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      const requestsArray = res.data || []; // fallback to empty array
        const todayStr = new Date().toISOString().split("T")[0];

        const futureRequests = requestsArray.filter((req) => {
          const reqDayStr = new Date(req.day).toISOString().split("T")[0];
          return reqDayStr >= todayStr;
        });
      setRequests(futureRequests);      
      const pending = res.data.filter(req => req.status === 'Pending');
      setPRequest(futureRequests);
    } catch (error) {
      console.error("Failed to fetch requests", error);
    }
  };
  
  const LogOut=()=>{
    localStorage.removeItem("user");
    navigate('/')
    window.location.reload()
  }

useEffect(() => {
  // Initial fetch
  Notification();

  const interval = setInterval(() => {
    Notification();
  }, 120000); // 2 minutes = 120000 ms

  // Clean up interval on component unmount
  return () => clearInterval(interval);
}, []);

  return (
      <div>
        <div className='headbar'>
            <Link onClick={()=>setActiveStep(0)} to="/" style={{textDecoration:"none",marginLeft:"5%",cursor:"pointer"}}>
            <h1  style={{color:"white"}}>Kick<span style={{color:"#00E6AD"}}>Off</span></h1>
           </Link>
            <div className='choose'>
              <Link to='/TerrainsFootball' onClick={() => (setActiveStep(1),setShowp(false),setRing(false))}  style={{  backgroundColor: activeStep === 1 ? 'transparent' : 'transparent', color: activeStep === 1 ? "white" : "#D6D6D6", padding: activeStep === 1 ? "6px 30px" : "black", borderRadius: activeStep === 1 ? "0" : "0" , borderBottom: activeStep === 1 ? " 3px solid white" : "0"  }} className='ftpd'>Foot</Link>
              <Link to='/TerrainsPadel' onClick={() => (setActiveStep(2),setShowp(false),setRing(false))} style={{  backgroundColor: activeStep === 2 ? 'transparent' : 'transparent', color: activeStep === 2 ? "white" : "#D6D6D6", padding: activeStep === 2 ? "6px 30px" : "black", borderRadius: activeStep === 2 ? "0" : "0" , borderBottom: activeStep === 2 ? " 3px solid white" : "0"  }} className='ftpd'>Padel</Link>
            </div>
            
            <div className='CardRing' style={{
                height: Ring ? '500px' : '0px', overflowY: Ring ? (Prequest.length > 3 ? 'scroll' : 'hidden') : 'hidden',
                padding: Ring ? '10px' : '0px',
                opacity: Ring ? 1 : 0,
                transition: 'all 0.3s ease',
              }}>
                <h2 style={{display:Ring === true ?'':'none'}}>Requests</h2>
                {
                  Prequest.length == 0 ? (
                    <h3 style={{ display: Ring ? '' : 'none',color:"black",textAlign:"center",marginTop:"30%" }}>
                      No requests for <br /> now
                    </h3>
                  ) : (
                  Prequest.map((request, index) => {
                    const date = new Date(request.day);
                    const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }); // e.g. "Friday"
                    const dayNumber = date.getDate(); // e.g. 30

                    return (
                      <Link to='/Requests'  key={index} style={{textDecoration:"none",width:"100%"}}>
                        <div onClick={()=> setRing(false)} className='request-c' style={{ display: Ring ? '' : 'none' }}>
                          <h5>{request.title}</h5>
                          <h5>{request.time}</h5>
                          <h5>{dayName} {dayNumber}</h5>
                        </div>
                      </Link>
                    );
                  })
                  )
                }
            </div>
              <div className='accessProfile' style={{height: showP ?"150px":"0px"}}>
                <div style={{width:"100%"}}>
                  <X size={19} style={{marginLeft:"80%",color:"black",marginTop:"2%",cursor:"pointer",display:showP  ?"":'none' }} onClick={()=>setShowp(!showP)}/>
                </div>
                <Link className='LinkProfile' style={{display:showP  ?"":'none' }} to='/Profile' onClick={()=> (setActiveStep(0),setShowp(!showP))}>Profile</Link>
                <Link className='LinkProfile' style={{display:showP  ?"":'none' }} to='/Profile' onClick={()=> (setActiveStep(0),setShowp(!showP),LogOut())}>Log out</Link>
              </div>
          
            <div className='icons'>
              {user?.role === 'Owner' && Prequest.length > 0 && (
                <div className='conteur' onClick={() => (setRing(!Ring),setShowp(false))}>
                  {Prequest.length}
                </div>
              )}
              {
                user?.role === 'Owner' ?(
                  <BellRing styl  e={{cursor:"pointer"}} onClick={()=> (setRing(!Ring),setMenuPhone(false))}/>
                ):(
                  ''
                )
              }
              <Link to='/'><House  onClick={() => (setActiveStep(0),setMenuPhone(false),setRing(false))} style={{fontSize:"large",marginLeft:"20px",color:"white",cursor:"pointer"}}/></Link>
              {user ?(  
              <UserRound onClick={()=>(setShowp(!showP),setRing(false))} id='userIcon' style={{fontSize:"large",marginLeft:"20px",color:"white",cursor:"pointer"}}  />
              ):(
                <Link to='/signUp' onClick={() => (setActiveStep(0),setMenuPhone(false))} > <button className='Hdseconnect'>Se connect</button></Link>
              )}
              <Menu className='iconMenuPhone' onClick={()=>(setMenuPhone(!MenuPhone),setRing(false))}/>
              {
                user?.role === 'Admin' || user?.role === 'Owner'  ?(
                  <Menu id='MenuAdmin' style={{fontSize:"xx-large",marginLeft:"10px",color:"white",cursor:"pointer"}} onClick={()=>(setShowRow(!showRow),setShowp(false),setRing(false))} />
                ):(
                  ""
                )
              }
            </div>
          {showRow && (
            <>
              {/* Overlay to prevent clicks on other parts of the page */}
              <div className="overlay" onClick={() => setShowRow(false)}></div>

              <div className="adminlinks">
                <IoIosClose onClick={() => setShowRow(false)} size={25} className="iconnav"/>
                <h1 >
                  {user?.role === 'Admin' ? 'Admin Access' : 'Owner Access'}
                </h1>                
                <Link
                  to={user?.role === 'Admin' ? '/Admin' : '/Admin'}
                  onClick={() => {
                    setShowRow(false);
                    setActiveStep(0);
                  }}
                  className="block linkadmin bg-black text-white text-center py-3 rounded-lg hover:bg-gray-800 transition"
                >
                  {user?.role === 'Admin' ? 'Enter Admin Panel' : 'Enter Owner Panel'}
                </Link>
              </div>
            </>
          )}
          <div className='MenuPhone' style={{height: MenuPhone ?"150px":"0px",paddingTop: MenuPhone ?"5%":"0px",paddingBottom: MenuPhone ?"4%":"0px"}}>
            <Link className='LinkMenuPhone' to='/TerrainsPadel' onClick={()=>(setMenuPhone(false))} style={{display:MenuPhone ? '':"none"}}>Padel</Link>
            <Link className='LinkMenuPhone' to='/TerrainsFootball' onClick={()=>(setMenuPhone(false))} style={{display:MenuPhone ? '':"none"}}>Football</Link>
            {user ?(  
            <Link className='LinkMenuPhone' to='/Profile' onClick={()=> (setActiveStep(0),setMenuPhone(false))} style={{display:MenuPhone ? '':"none"}} >Profile</Link>
            ):(
              ''
            )}
            {user ?(  
            <Link className='LinkMenuPhone'onClick={()=> (setActiveStep(0),setMenuPhone(false),LogOut())} style={{display:MenuPhone ? '':"none"}}>LogOut</Link>
            ):(
              ''
            )}
            
            {
                user?.role === 'Admin' || user?.role === 'Owner'  ?(
                <Link to={user?.role === 'Admin' ? '/Admin' : '/Admin'} onClick={() => {
                                    setShowRow(false);
                                    setActiveStep(0);
                                    setMenuPhone(!MenuPhone)
                                  }}style={{display:MenuPhone ? '':"none"}} className="LinkMenuPhone" id='LinkAdminPhone'>
                                  {user?.role === 'Admin' ? 'Enter Admin Panel' : 'Enter Owner Panel'}
                </Link>
                ):(
                  ""
                )
              }
            
          </div>
           </div>
        </div>
  )
}

export default HeadBar