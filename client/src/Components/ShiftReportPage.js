import { useState, useEffect } from "react";
import axios from "axios";
import ShiftReportTable from "./ShiftReportTable";

const apiUrl = "http://localhost:3000/shifts/";

function ShiftReportPage() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [shifts, setShifts] = useState([]);
  const [shiftId, setShiftId] = useState("");
  const [isInShift, setIsInShift] = useState(false);
  const [isInPause, setIsInPause] = useState(false);
  const [errors, setErrors] = useState("");

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get(apiUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setShifts(response.data.shifts);
      } catch (ex) {
        setErrors(ex.response.data);
      }
    };

    fetchShifts();
  }, [token]);

  async function handleShift() {
    if (isInPause) {
      setErrors(
        `Not available: You can't finish a shift when you're during a pause`
      );
    } else if (!isInShift) {
      // Starting shift
      try {
        const response = await axios.post(apiUrl + "startShift/", {
          token: token,
        });
        setErrors("");
        setIsInShift(true);
        setShiftId(response.data.shift._id);
      } catch (ex) {
        setErrors(ex.response.data);
      }
    } else {
      // Ending shift
      try {
        const response = await axios.post(apiUrl + "endShift/", {
          token: token,
          shiftId: shiftId,
        });
        setErrors("");
        setIsInShift(false);
        setShifts(response.data.shifts);
      } catch (ex) {
        setErrors(ex.response.data);
      }
    }
  }

  async function handlePause() {
    if (!isInShift) {
      setErrors(
        `Not available: You cannot take a pause outside of a shift (You should start shift first)`
      );
    } else if (!isInPause) {
      // Starting pause
      try {
        const response = await axios.post(apiUrl + "startPause/", {
          token: token,
          shiftId: shiftId,
        });
        setErrors("");
        setIsInPause(true);
      } catch (ex) {
        setErrors(ex.response.data);
      }
    } else {
      // Ending pause
      try {
        const response = await axios.post(apiUrl + "endPause/", {
          token: localStorage.getItem("token"),
          shiftId: shiftId,
        });
        setErrors("");
        setIsInPause(false);
      } catch (ex) {
        setErrors(ex.response.data);
      }
    }
  }

  return (
    <div className="App">
      <h1>Shift Report Page</h1>
      {errors && <div style={{ color: "red" }}>{errors}</div>}
      <br />
      <button onClick={handleShift}>
        {isInShift ? "End shift" : "Start shift"}
      </button>
      <button onClick={handlePause}>
        {isInPause ? "End pause" : "Start pause"}
      </button>
      <br />
      <br />
      <ShiftReportTable shifts={shifts} />
      <br />
      <button onClick={() => (window.location = "/logout")}>Logout</button>
    </div>
  );
}

export default ShiftReportPage;
