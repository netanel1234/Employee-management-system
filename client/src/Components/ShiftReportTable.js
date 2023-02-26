import Shift from "./Shift";

function ShiftReportTable({ shifts }) {
  return (
    <div className="App">
      <div className="table-container">
        <table border="1" className="shift-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Entrance time</th>
              <th>Leaving time</th>
              <th>Total hours</th>
              <th>Total break</th>
              <th>Regular hours</th>
              <th>Overtime 125%</th>
              <th>Overtime 150%</th>
            </tr>
          </thead>
          <tbody>
            {shifts.map((shift, index) => (
              <Shift key={index} shift={shift} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ShiftReportTable;
