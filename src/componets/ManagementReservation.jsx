import React, { useState, useEffect } from "react";
import HeadAdmin from "./HeadAdmin.jsx";
import axios from "axios";
import { MdDelete } from "react-icons/md";
import { CiEdit } from "react-icons/ci";
import toast, { Toaster } from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { IoIosClose } from "react-icons/io";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ScaleLoader } from "react-spinners";
import { Check,Trash2, X } from "lucide-react";
import { use } from "react";
import moment from "moment";

function TestPage() {
  // const [Reservation, setReservation] = useState([]);
  const [typeR,setType]=useState('')
  const [day, setday] = useState(() => {
      const today = new Date();
      return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  }); 
  const [w,setW]=useState(false) 
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user'));
  const [Requests, setRequests] = useState([]);

  const getAllRequests = async () => {
    try {
      const URL = user?.role === 'Admin' ? 'https://svko.onrender.com/api/Admin/getAllRequests' : `https://svko.onrender.com/api/Owner/get-Requests-Owner/${user.id}`
      const res = await axios.get(URL ,{
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
        setRequests(futureRequests)        
    } catch (error) {
      console.error("Error fetching Requests:", error); 
    }
  };
  
  useEffect(() => {
    getAllRequests();    
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);
  const conformationCamcelReservation = async (id) => {
    toast((t) => (
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", backgroundColor: "white" }}>
        <p>Are you sure you want to Cancel this Reservation?</p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={() => cancelReservation(id)}
            style={{ background: "red", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            Yes
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            style={{ background: "gray", color: "white", padding: "5px 10px", border: "none", borderRadius: "5px", cursor: "pointer" }}
          >
            No
          </button>
        </div>
      </div>
    ), { duration: 5000 });
  };
  const cancelReservation = async(id)=>{
    try {
       const res = await axios.put(
      `https://svko.onrender.com/api/Owner/CanceledReservation/${id}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
      if (res.status === 200) {
        toast.success("Reservation Canceled")
        getAllRequests()
      }
    } catch (error) {
      console.error(error);
      if (error.status != 200) {
        
        toast.error(error.response?.data?.message || 'Server error occurred');
      }    }
  }




  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = moment().add(i, 'days');
      // console.log(day); // This logs the full moment object
      days.push({
        date: day.format('YYYY-MM-DD'),  // Formats the date as "2025-04-23"
        dayName: day.format('dddd'),     // Full day name, e.g., "Wednesday"
        shortDay: day.format('ddd'),     // Abbreviated day, e.g., "Wed"
      });
    }
    return days;
  };


  const days = getNext7Days();    

  
  
  
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  
  useEffect(() => {
    const controls = animate(count, Requests.length, { duration: 2 });
    return () => controls.stop();
  }, [Requests, Requests.length]);



  const filteredReservation = Requests.filter((Requests) =>
    Requests.day.includes(day) &&
    Requests.title.toLowerCase().includes(searchTerm.toLowerCase())&&
    Requests.type.includes(typeR)
  );

  return (
    <div className="APUSers">
      <HeadAdmin />
      <Toaster />
      <div className="headReservation">
        <h1> Reservation</h1>
        <select  className="TypeRvt" id="TypeRvtV2" onChange={(e)=> setType(e.target.value)}>
          <option value="">Type</option>
          <option value="padel">Padel</option>
          <option value="football">football</option>
        </select>
        <div className="head-3" id="head-3v2">
          <div className="srch-1">
            <input type="search" className="search" placeholder="Search by title" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <div className="srch-2">
            <FaSearch style={{ color: "black" }} />
          </div>
        </div>
        <motion.h6 style={{ fontSize: "20px" }}>{rounded}</motion.h6>
      </div>
      <div>
        <div className="TimeReservationMR">
          {
          days.map(item => (
            <div key={item.date} className="day" style={{color: day === item.date ? "white" :'',backgroundColor: day === item.date ? "#111827" :'#C1C1C1'}} onClick={() => (setday(item.date),setNameDay(item.dayName))}>
              <h5>{item.dayName}</h5>
              <h5>{item.date}</h5>
            </div>
          ))
          }

        </div>
      </div>
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <ScaleLoader color="white" />
        </div>
      ) : (
        <div className="divtabe">
          <table border={0}>
            <thead>
              <tr>
                <th>field Title</th>
                <th>request name</th>
                <th>phoneNumber</th>
                <th>Capacity</th>
                <th>Price</th>
                <th>time</th>
                <th>day</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {filteredReservation.filter((requests) => requests.status === 'Accepted').map((requests) => 
               <tr key={requests._id}>
                  <td>{requests.title}</td>
                  <td>{requests.fullName}</td>
                  <td>{requests.phoneNumber}</td>
                  <td>{requests.capacity}</td>
                  <td>{requests.price}</td>
                  <td>{requests.time}</td>
                  <td>{moment(requests.day).format("YYYY-MM-DD")}</td>
                  <td style={{ display: "flex", justifyContent: "space-evenly", fontSize: "large" }}>
                    <X onClick={()=> conformationCamcelReservation(requests._id)}  style={{color:"#F63528"}}/>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          
        </div>
      )}
    </div>
  );
}

export default TestPage;
