import React from "react";
import { DataContext } from "../context/AppContext";
import categorize from "../components/utils/categorize";

export default function Transaction() {
  const { transactions, setTransactions } = React.useContext(DataContext);
  return (
    <>
      <table className="">
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions?.map((data, i) => (
            <tr key={i}>
              <td>{data.Date}</td>
              <td>categorize({data.Description})</td>
              <td>{data.Amount}</td>
              <td>{categorize(data.Description)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
