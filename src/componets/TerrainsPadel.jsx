import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import terrain from '../images/spadel.jpg';
import axios from 'axios';
import ChangeBar from './ChangeBar';
import { CiLocationOn } from "react-icons/ci";
import { FaUsers } from "react-icons/fa";
import { motion, useScroll } from "motion/react"
import { Users,MapPinHouse  } from 'lucide-react';
import { PropagateLoader  } from "react-spinners";

function Terrains({activeStep,setActiveStep}) {
  const [Fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const { scrollYProgress } = useScroll()
  const user=JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate();

    useEffect(() => {
      getAllFields();
      const timer = setTimeout(() => setLoading(false), 2000);
      return () => clearTimeout(timer);
    }, []);

  const handleReserveClick = (fieldId) => {
    // setActiveStep(0);
    if (user) {
      navigate(`/Reservation/${fieldId}`);
    } else {
      navigate('/signUp');
      setActiveStep(0)
    }
  };

  const getAllFields = async () => {
    try {
      const res = await axios.get('https://svko.onrender.com/api/getAllFields');
      setFields(res.data);
      console.log(res.data)
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };
  useEffect(() => {
    getAllFields();
  }, []);
  return (
    <div className='terrainsPadel'>
      {loading ? (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <PropagateLoader  color="#0000DC" size={25} style={{zIndex:"20"}} />
      </div>
    ) : (
      <div className='Fields'>
      {Fields.filter((Field) => Field.type === 'padel').map((Field) => (
        <div className='Field' key={Field.id}> {/* Assuming Field has a unique 'id' */}
          <div style={{ height: "85%" }}>
          <img src={`https://svko.onrender.com/${Field.images[0]}`} alt="Field" />
          <div className='donner'>
              <h4>{Field.title}</h4> {/* Display dynamic name */}
            </div>
            <div className='donner'>
              <h4 style={{color:"#0328F0",fontWeight:"bolder"}}>{(Field.price)} DT</h4>
            </div>
            <div className='donner'>
              <h3 style={{ marginRight: "10px" }}><MapPinHouse size={15} /></h3>
              <h3>Adress:</h3>
              <h4>{Field.address}</h4>
            </div>
          </div>
          <button onClick={() => handleReserveClick(Field._id)}>Reserve</button>
 
          </div>
      ))}

      </div>
      )}
    </div>
  );
}

export default Terrains;
