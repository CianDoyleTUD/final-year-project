import './App.css';

function SearchBar() {
  return (
    <div className="SearchBarContainer">
        <input type="text" className="SearchBar" placeholder="Search for a transaction, block or wallet"/>
    </div>
  );
}

export default SearchBar;
