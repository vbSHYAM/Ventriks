import React, { useState, useEffect } from "react";
import axios from "axios";
import { AiFillDelete } from "react-icons/ai";

const Table = () => {
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios("http://universities.hipolabs.com/search");
      setData(result.data);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const storedFavorites = JSON.parse(localStorage.getItem("favorites"));
    if (storedFavorites) {
      setFavorites(storedFavorites);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const indexOfLastRow = currentPage * rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;

  const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

  const handleNextPageClick = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePrevPageClick = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleFavoriteClick = (name) => {
    const isFavorite = favorites.includes(name);
    if (isFavorite) {
      setFavorites(favorites.filter((favorite) => favorite !== name));
    } else {
      setFavorites([...favorites, name]);
    }
  };

  const handleDeleteClick = (name) => {
    setFavorites(favorites.filter((favorite) => favorite !== name));
  };

  const filteredRows = currentRows.filter((row) => {
    const nameMatches = row.name.toLowerCase().includes(search);
    const countryMatches =
      country === "" || row.country.toLowerCase() === country.toLowerCase();
    return nameMatches && countryMatches;
  });

  const favoriteRows = data.filter((row) => favorites.includes(row.name));

  return (
    <section>
      <div className="filters">
        <label htmlFor="">Search :</label>
        <input
          className="searchInput"
          type="text"
          name="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search university name"
        />

        <select
          id="select_country"
          name="country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        >
          <option value="">Select Countries</option>
          <option value="china">China</option>
          <option value="united kingdom">United Kingdom</option>
          <option value="united states">United States</option>
          <option value="france">France</option>
          <option value="india">India</option>
        </select>
      </div>
      <table id="Display_table">
        <thead>
          <tr>
            <th>Sl.No</th>
            <th>Name</th>
            <th>Country</th>
            <th>Website</th>
            <th>Favorite</th>
          </tr>
        </thead>
        <tbody>
          {filteredRows.map((row, index) => (
            <tr key={row.name}>
              <td>{indexOfFirstRow + index + 1}</td>
              <td>{row.name}</td>
              <td>{row.country}</td>
              <td>{row.web_pages[0]}</td>
              <td>
                <button
                  id="star_button"
                  style={{}}
                  className={favorites.includes(row.name) ? "active" : ""}
                  onClick={() => handleFavoriteClick(row.name)}
                >
                  ★
                </button>
              </td>
            </tr>
          ))}
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

      {/* -----Favourite List--------- */}

      <ul id="fav_ul">
        {favorites.length > 0 && <h1 id="FavTitle">Favourite</h1>}

        {favorites.map((val, ind) => {
          return (
            <li id="fav_li" key={ind}>
              {val}
              <li>
                <AiFillDelete
                  id="delete_ico"
                  onClick={() => handleDeleteClick(val)}
                />
              </li>
            </li>
          );
        })}
      </ul>
    </section>
  );
};

export default Table;
