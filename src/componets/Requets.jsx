import React, { useState, useEffect } from "react";
import HeadAdmin from "./HeadAdmin.jsx";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import { FaSearch } from "react-icons/fa";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { ScaleLoader, FadeLoader } from "react-spinners";
import { Check, X } from "lucide-react";
import moment from "moment";

function TestPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [spinerR, setSpinerR] = useState(false);
  const [requestNP, setRequestNP] = useState([]);
  const [requests, setRequests] = useState([]);
  const [day, setday] = useState(() => {
        const today = new Date();
        return today.toISOString().split("T")[0]; // "YYYY-MM-DD"
  }); 
  const [typeR,setType]=useState('')

  const user = JSON.parse(localStorage.getItem("user"));

const getAllRequests = async () => {
  try {
    const URL =
      user?.role === "Admin"
        ? "https://svko.onrender.com/api/Admin/getAllRequests"
        : `https://svko.onrender.com/api/Owner/get-Requests-Owner/${user.id}`;

    const res = await axios.get(URL, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    });

    const requestsArray = res.data || []; // fallback to empty array
    const todayStr = new Date().toISOString().split("T")[0];

    const futureRequests = requestsArray.filter((req) => {
      const reqDayStr = new Date(req.day).toISOString().split("T")[0];
      return reqDayStr >= todayStr;
    });

    setRequestNP(futureRequests);
    setRequests(requestsArray);
    
  } catch (error) {
    console.error("Error fetching Requests:", error);
  }
};

  useEffect(() => {
    getAllRequests();
    const timer = setTimeout(() => setLoading(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const spinerRequest = () => {
    setSpinerR(true);
    setTimeout(() => {
      setSpinerR(false);
    }, 2000);
  };

  const updateRequest = async (id, status) => {
    try {
      const res = await axios.post(
        `https://svko.onrender.com/api/Owner/UpdateRequest/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      setTimeout(() => {
        if (res.status === 201) {
          toast.success("Request Updated ✅");
        } else {
          toast.success("Request Canceled ❌");
        }
        getAllRequests();
      }, 2000);
    } catch (error) {
      console.log(error);
      if (error.response?.status !== 200) {
        toast.error(error.response?.data?.message || "Server error occurred");
      }
    }
  };
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
    const pendingCount = requests.filter((req) => req.status === "Pending").length;
    const controls = animate(count, pendingCount, { duration: 2 });
    return () => controls.stop();
  }, [requests]);

  const filteredRquests = requests.filter((Requests) =>
    Requests.day.includes(day) &&
    Requests.title.toLowerCase().includes(searchTerm.toLowerCase())&&
    Requests.status === "Pending"

  );

  return (
    <div className="APUSers">
      <HeadAdmin />
      <Toaster />
      <div className="headUsrs">
        <h1>Management Requests</h1>
        <div className="head-3">
          <div className="srch-1">
            <input
              type="search"
              className="search"
              placeholder="Search by Type"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
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
          {spinerR && (
            <FadeLoader size={29} color="black" style={{ zIndex: 30, position:"absolute", left: "50%",top:'50%' }} />
          )}
          <table border={0}>
            <thead>
              <tr>
                <th>Field Title</th>
                <th>Request Name</th>
                <th>Phone Number</th>
                <th>Capacity</th>
                <th>Price</th>
                <th>Time</th>
                <th>Day</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRquests.map((req) => (
                <tr key={req._id}>
                  <td>{req.title}</td>
                  <td>{req.fullName}</td>
                  <td>{req.phoneNumber}</td>
                  <td>{req.capacity}</td>
                  <td>{req.price}</td>
                  <td>{req.time}</td>
                  <td>{moment(req.day).format("YYYY-MM-DD")}</td>
                  <td style={{ display: "flex", justifyContent: "space-evenly", fontSize: "large" }}>
                    <button
                      style={{ backgroundColor: "transparent", border: 0, cursor: "pointer" }}
                      disabled={spinerR}
                      onClick={async () => {
                        await updateRequest(req._id, "Accepted");
                        spinerRequest();
                      }}
                    >
                      <Check style={{ color: "#38BC60" }} size={30} />
                    </button>
                    <button
                      style={{ backgroundColor: "transparent", border: 0, cursor: "pointer" }}
                      disabled={spinerR}
                      onClick={() => (updateRequest(req._id, "Canceled"),spinerRequest())}
                    >
                      <X style={{ color: "#F63528" }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRquests.length === 0 && (
            <p style={{ textAlign: "center", marginTop: "30px" }}>
              No pending requests found.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default TestPage;
