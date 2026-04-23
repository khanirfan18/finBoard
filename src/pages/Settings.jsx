import { useState, useContext } from "react";
import Papa from "papaparse";
import { DataContext } from "../context/AppContext";

export default function CSVParser() {
  const { transactions, setTransactions } = useContext(DataContext);
  const [data, setData] = useState([]);

  const handleFile = (e) => {
    const file = e.target.files[0];

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        setData(results.data);
        localStorage.setItem("transactions", JSON.stringify(results.data)); 
        setTransactions(results.data);
       
      },
    });
  };

  return (
    <div className="p-10">
      <input
        type="file"
        accept=".csv"
        className="file-input file-input-bordered"
        onChange={handleFile}
      />

      <pre className="mt-5 text-sm">{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
