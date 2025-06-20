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

  const user = JSON.parse(localStorage.getItem("user"));

const getAllRequests = async () => {
  try {
    const URL =
      user?.role === "Admin"
        ? "http://localhost:2024/api/Admin/getAllRequests"
        : `http://localhost:2024/api/Owner/get-Requests-Owner/${user.id}`;

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
        `http://localhost:2024/api/Owner/UpdateRequest/${id}`,
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

  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));

  useEffect(() => {
    const pendingCount = requests.filter((req) => req.status === "Pending").length;
    const controls = animate(count, pendingCount, { duration: 2 });
    return () => controls.stop();
  }, [requests]);

  const filteredRequests = requestNP.filter(
    (req) =>
      req.status === "Pending" &&
      req.title.toLowerCase().includes(searchTerm.toLowerCase())
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

      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
          <ScaleLoader color="white" />
        </div>
      ) : (
        <div className="divtabe">
          {spinerR && (
            <FadeLoader size={29} color="black" style={{ zIndex: 20, position: "relative", left: "50%" }} />
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
              {filteredRequests.map((req) => (
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
                      onClick={() => updateRequest(req._id, "Canceled")}
                    >
                      <X style={{ color: "#F63528" }} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRequests.length === 0 && (
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
