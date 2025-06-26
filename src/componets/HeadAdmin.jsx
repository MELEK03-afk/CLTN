import React,{useEffect,useState} from 'react'
import { IoHomeSharp } from "react-icons/io5";
import { UserRound,House,Menu  } from 'lucide-react';
import { Link } from 'react-router-dom';
import BackChange from './BackChange';
function HeadAdmin({activeStep,setActiveStep}) {
  const user = JSON.parse(localStorage.getItem('user'))
  const [MenuS,SetShowMenu]=useState(false)
  return (
    <div>
        <div className='HeadAdmin'>
            <h1>Sports Terrain Manager </h1>
            <div className='MenuAdmin' style={{height: MenuS === false ?'0px':'200px' }}>
              <Link to='/AllFields' className='MenuAdminLink' style={{display: MenuS === false ? 'none':""}}>Fields</Link>
              <Link to='/ReservationManagment' className='MenuAdminLink' style={{display: MenuS === false ? 'none':""}}>Reservation</Link>
                {user.role === "Admin" ?(
                  <Link to='/MangementU' className='MenuAdminLink' style={{display: MenuS === false ? 'none':""}}>Users</Link>
                ):(
                  ''
                )
                  
                }              
                <Link to='/AddTerrains' className='MenuAdminLink' style={{display: MenuS === false ? 'none':""}}>Add Terrain</Link>
            </div>
            <div className='access'>
                <Link to='/AllFields' className='OwnerLink'>Fields</Link>
                {user.role === "Owner" ?(
                  <Link to='/Requests' className='OwnerLink'>Requests</Link>
                ):(
                  ''
                )
                  
                }
                <Link to='/ReservationManagment' className='OwnerLink'>Reservation</Link>
                {user.role === "Admin" ?(
                  <Link to='/MangementU' className='OwnerLink'>Users</Link>
                ):(
                  ''
                )
                  
                }
                <Link
                  to="/AddTerrains"
                  style={{
                    backgroundColor: activeStep === 3 ? 'white' : 'transparent',
                    color: activeStep === 3 ? 'black' : '',
                    padding: activeStep === 3 ? '6px 30px' : '',
                    borderRadius: activeStep === 3 ? '20px' : ''
                  }}
                  className="OwnerLink"
                >
                  Add terrain
                </Link>            </div>  
            <div className='icons'>
                <Link to='/'><IoHomeSharp onClick={() => setActiveStep(0)} style={{fontSize:"large",marginLeft:"20px",color:"white",cursor:"pointer"}}/></Link>
                <Menu className='MenuIcon' onClick={()=>SetShowMenu(!MenuS)} style={{cursor:"pointer"}}/>
            </div>
        </div>
    </div>
  )
}

export default HeadAdmin