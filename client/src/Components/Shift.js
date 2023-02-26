function Shift({ shift }) {
  return (
    <tr>
      <td>{shift.fullDate}</td>
      <td>{shift.entranceTime}</td>
      <td>{shift.leavingTime}</td>
      <td>{shift.totalHoursShift}</td>
      <td>{shift.totalPause}</td>
      <td>{shift.totalRegularHoursShift}</td>
      <td>{shift.totalOvertime1}</td>
      <td>{shift.totalOvertime2}</td>
    </tr>
  );
}

export default Shift;
