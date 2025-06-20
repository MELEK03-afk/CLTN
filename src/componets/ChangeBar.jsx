import React,{useState,useEffect} from 'react'
import pic8 from '../images/padel.jpg'
import pic4 from '../images/pic7.jpg'
import pic5 from '../images/AC.jpg'
import pic3 from '../images/pic3.png'
import small from '../images/sassis.jpg'
import pic6 from '../images/ftback3.jpg';
import pic2 from '../images/bayrne.jpg'
import {Link} from 'react-router-dom'
import { FaXTwitter } from "react-icons/fa6";
import { FaInstagram } from "react-icons/fa6";
import { CiFacebook } from "react-icons/ci";
const backgrounds = [pic6, pic8,pic5,pic3,pic2];

function ChangeBar({}) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const[Ring,setRing]=useState(false)
  const x=<FaXTwitter className='icon'/>
  const insta=<FaInstagram className='icon'/>
  const fc=<CiFacebook className='icon'/>
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % backgrounds.length);
    }, 5000); // Change image every 3 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);
  
  return (
    <div>
      <div onClick={()=>setRing(false)} className='change' style={{ backgroundSize: "cover", backgroundPosition: "center", transition: "background-image 0.5s ease-in-out", backgroundImage: `url('${backgrounds[currentIndex]}')`,}}>
      </div>
      <div className='text'>
          <h1 style={{color:"#00E6AD"}}>Sport</h1>
          <h1 style={{color:"white"}}>Booking</h1>
          <h3>Réservez votre stade | Football | Padel | Disponible maintenant</h3>
          {/* <h3> <br /> more</h3> */}
      </div> 
      <div class="section-2">
            <div class="dvsection-1">
              <img src={pic4} alt="" />
            </div>
            <div class="dvsection-2">
                <h2>
                For Commercial Centres
                Book a meeting with our team                </h2>
                <h2>
                The Leading Online Software Solution for Booking, Payments, Facility Management, Events, Leagues, and more                </h2>
            </div>
        </div>
    </div>
  )
}

export default ChangeBar