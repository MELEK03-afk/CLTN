    import React, { useState, useEffect } from 'react';
import ChangeBar from './ChangeBar';
import { useNavigate } from 'react-router-dom';
import terrain from '../images/marseille.png';
import axios from 'axios';
import { CiLocationOn } from "react-icons/ci";
import { FaUsers } from "react-icons/fa";
import { motion, useScroll } from "motion/react"
import { Users,MapPinHouse , } from 'lucide-react';
import { PropagateLoader  } from "react-spinners";



function Terrains({activeStep,setActiveStep}) {
  const [Fields, setFields] = useState([]);
  const { scrollYProgress } = useScroll()
  const [loading, setLoading] = useState(true);
  const user=JSON.parse(localStorage.getItem('user'))
  const navigate = useNavigate();

  useEffect(() => {
    getAllFields();
    const timer = setTimeout(() => setLoading(false), 3000);
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
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };
  useEffect(() => {
    getAllFields();
    console.log(Fields)
  }, []);



return (
  <div className="terrainsFoot">
    {loading ? (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
        <PropagateLoader  color="#00E6AD" size={25} />
      </div>
    ) : (
      <div className="Fields">
        {Fields.filter((Field) => Field.type === 'football' && Field.status === 'Available').map((Field) => (
          <div className="Field" key={Field._id}>
            <div style={{ height: "85%" }}>
              <img src={`https://svko.onrender.com/${Field.images[0]}`} alt="Field" />
              <div className="donner">
                <h4>{Field.title}</h4>
              </div>
              <div className="donner">
                <h4 style={{ color: "#28A745", fontWeight: "bolder" }}>{Field.price} DT</h4>
              </div>
              <div className="donner">
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
