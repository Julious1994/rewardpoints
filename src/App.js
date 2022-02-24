import "./App.css";
import { useEffect, useState } from "react";
import moment from "moment";

import { getData } from "./api";

function getMonth(date) {
  let newDate = moment(date, "DD-MM-YYYY").format("MM-YYYY");
  return newDate;
}

function getPoints(amount) {
  let points = 0;
  if (amount > 50) {
    points += amount > 100 ? 50 : amount - 50;
  }
  if (amount > 100) {
    points += (amount - 100) * 2;
  }
  return points;
}

function calculatePoints(list) {
  const data = {};
  const monthList = [];
  list.forEach((item) => {
    const month = getMonth(item.date);
    const points = getPoints(item.amount);
    if (monthList.indexOf(month) === -1) {
      monthList.push(month);
    }
    if (data[item.userId]) {
      let monthlyPoints = points;
      if (data[item.userId].months[month]) {
        monthlyPoints += data[item.userId].months[month];
      }
      data[item.userId] = {
        ...data[item.userId],
        months: { ...data[item.userId].months, [month]: monthlyPoints },
        total: data[item.userId].total + points,
      };
    } else {
      data[item.userId] = {
        userId: item.userId,
        userName: item.userName,
        months: { [month]: points },
        total: points,
      };
    }
  });
  return { data, monthList };
}

function App() {
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    getData().then((response) => {
      setUserData([...response]);
    });
  }, []);

  const { data, monthList } = calculatePoints(userData);

  return (
    <div className="App">
      <h1>Reward points earned by customers</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            {monthList.map((month) => (
              <th key={month}>{moment(month, "MM-YYYY").format("MMM YYYY")}</th>
            ))}
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {Object.values(data).map((userData) => (
            <tr key={userData.userId}>
              <td>{userData.userName}</td>
              {monthList.map((month) => (
                <td key={`${month}-${userData.userId}`}>
                  {userData.months[month]}
                </td>
              ))}
              <td>{userData.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="dataset-title">DataSet: </div>
      <div className="user-dataset">{JSON.stringify(userData)}</div>
    </div>
  );
}

export default App;
