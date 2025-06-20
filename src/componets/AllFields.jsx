import React,{useState,useEffect} from 'react'
import HeadOwner from './HeadOwner'
import axios from 'axios'
import { motion, useScroll } from "motion/react"
import terrain from '../images/sassi.jpg';
import { FaUsers } from "react-icons/fa";
import { Link } from "react-router-dom";
import { CiLocationOn } from "react-icons/ci";
import { FaBaseballBall } from "react-icons/fa";
import { IoMdFootball } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import { MapPinHouse,Trash2,UsersRound,Pencil } from "lucide-react";
function AllFields() {
  const [Fields, setFields] = useState([]);
  const { scrollYProgress } = useScroll()
  const [Type,setType]=useState('football')


  const getAllFields = async () => {
    try {
      const res = await axios.get('http://localhost:2024/api/getAllFields');
      setFields(res.data);
    } catch (error) {
      console.error("Error fetching fields:", error);
    }
  };
  useEffect(() => {
    getAllFields();
  }, []);



  return (
    <div className='AllFields'>
        <HeadOwner/>
        <motion.div id="scroll-indicator" style={{scaleX: scrollYProgress,position: "fixed",top: 0,left: 0,right: 0, height: 10, originX: 0, backgroundColor: "black",}} />
        <div className='typeFields'>
          <div className='towbt'>
            <span className='spanBt'>Footbal</span>
            <button onClick={() => setType('football')}><IoMdFootball style={{fontSize:"20px"}}/></button>
          </div>
          <div className='towbt'>
            <span className='spanBt'>Padel</span>
            <button onClick={() => setType('padel')}><FaBaseballBall style={{fontSize:"20px"}}/></button>
          </div>
        </div>
      <div className='Fields'>
      {Fields.filter((Field) => Field.type === Type).map((Field) => (
        <div className='Field' key={Field.id}> {/* Assuming Field has a unique 'id' */}
          <div style={{ height: "85%" }}>
            <img src={terrain} alt="Field" />
           
            <div className='donner'>
              <h4>{Field.title}</h4> {/* Display dynamic name */}
            </div>            
            <div className='donner'>
              <h4 style={{color:"#28A745", fontWeight:"bolder"}}>{(Field.price*Field.capacity)} DT</h4>
            </div>
            <div className='donner'>
              <h3 style={{ marginRight: "10px" }}><UsersRound size={19}/></h3>
              <h3>Capacity:</h3>
              <h4>{Field.capacity}</h4>
            </div>
            <div className='donner'>
              <h3 style={{ marginRight: "10px" }}><MapPinHouse size={19}/></h3>
              <h3>Address:</h3>
              <h4>{Field.address}</h4>
            </div>
            <div className='DUFields'>
              <div className='ActionFields' style={{marginLeft:'14%',borderRight:"2px solid rgb(226, 226, 226)"}}>
                <Trash2 style={{cursor:'pointer'}} size={19}/>
              </div>
              <div className='ActionFields'>
                <Pencil style={{cursor:'pointer'}}  size={19}/>
              </div>
            </div>
          </div>
        </div>
      ))}

      </div>
    </div>
  )
}

export default AllFields