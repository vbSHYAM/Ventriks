import React, { useState, useEffect } from "react";
import axios from "axios";
const Table = () => {
  const [data, setData] = useState([]);
  let [search, setSearch] = useState("");
  let [country, setCountry] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://universities.hipolabs.com/search");
      setData(result.data);
      console.log(result.data);
    };
    fetchData();
  }, []);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const handleNextPageClick = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPageClick = () => {
    setCurrentPage(currentPage - 1);
  };

  return (
    <div>
      <input
        type="text"
        name="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select name="country" value={country} onChange={(e)=>setCountry(e.target.value)}>
      <option value="select country"> select country</option>
      <option value="china">china</option>
      <option value="united kingdom">United Kingdom</option>
      <option value="united states">United states</option>
      <option value="france">france</option>
      <option value="india">india</option>
      </select>
      <table>
        <thead>
          <tr>
            <th>sl nom</th>
            <th>Name</th>
            <th>Country</th>
            <th>Website</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.map((val,ind) => {
            if (
              val.name.toLowerCase().includes(search) &&
              val.country.toLowerCase().includes(country)
            ) {
              return (
                <tr key={ind+1}>
                    <td>{ind+1}</td>
                  <td>{val.name}</td>
                  <td>{val.country}</td>
                  <td>{val.web_pages[0]}</td>
                </tr>
              );
            }
          })}
        </tbody>
      </table>
      <div className="pagination">
        <button
          className="prev-btn"
          onClick={handlePrevPageClick}
          disabled={currentPage === 1}
        >
          Prev
        </button>
        <button
          className="next-btn"
          onClick={handleNextPageClick}
          disabled={indexOfLastRow >= data.length}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Table;
