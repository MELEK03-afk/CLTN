import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios'
import { Instagram ,Facebook,Smile } from 'lucide-react';
import ko from '../images/ko.png'
function ContactBar() {
  const[Name,setName]=useState('')
  const[Number,setNummber]=useState('')
  const[email,setEmail]=useState('')
  const[message,setMessage]=useState('')
  
  const sendmail= async()=>{
    console.log(Name)
    console.log(email)
    console.log(Number)
    console.log(message)
    if(isValid()){
      try {
        const res = await axios.post('http://localhost:2024/api/Admin/Contac-message', {
          Name,
          email,
          message,
          Number,
        });
        if(res.status === 200){
            toast.success("message send successful")
        }
      
      } catch (error) {
        console.log(error)
      }
    }
    else{
      toast.error("All fields are required")
    }
  }

  return (
    <div>
    <div className='divcontact'></div>
      <div style={{display:'flex'}}>
      <div className='divcontact-1'>
        <h3>
          Join our network of Sport Booking partners and make your venue easily accessible to thousands of users looking to book courts, fields, and sports spaces online <span style={{color:"#00E6AD"}}> . If you're interested in becoming a partner, feel free to contact us via email — we’d love to hear from you!  </span>  
        </h3>
      </div>
      <div className='divcontact-2'>
      {/* <Toaster  /> */}
        <input type="text" onChange={(e)=> setName(e.target.value)} placeholder="Name" id="" />
        <input type="text" onChange={(e)=> setNummber(e.target.value)} placeholder="Phone Number" id="" />
        <input type="text" onChange={(e)=> setEmail(e.target.value)} placeholder="Email" id="" />
        <textarea placeholder="Your message" onChange={(e)=> setMessage(e.target.value)} id=""></textarea>
        <button className='sendcontact' onClick={sendmail}>Send</button>
      </div>
    </div>
    </div>
  )
}

export default ContactBar