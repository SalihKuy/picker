import { useEffect, useState, useCallback } from "react";
import "./App.css";
import axios from "axios";
import Select from "react-select";
import discordLogo from "./assets/discord.svg";

const brawlers = [
  { value: "8-BIT", label: "8-Bit" },
  { value: "AMBER", label: "Amber" },
  { value: "ANGELO", label: "Angelo" },
  { value: "ASH", label: "Ash" },
  { value: "BARLEY", label: "Barley" },
  { value: "BEA", label: "Bea" },
  { value: "BELLE", label: "Belle" },
  { value: "BERRY", label: "Berry" },
  { value: "BIBI", label: "Bibi" },
  { value: "BO", label: "Bo" },
  { value: "BONNIE", label: "Bonnie" },
  { value: "BROCK", label: "Brock" },
  { value: "BULL", label: "Bull" },
  { value: "BUSTER", label: "Buster" },
  { value: "BUZZ", label: "Buzz" },
  { value: "BYRON", label: "Byron" },
  { value: "CARL", label: "Carl" },
  { value: "CHARLIE", label: "Charlie" },
  { value: "CHESTER", label: "Chester" },
  { value: "CHUCK", label: "Chuck" },
  { value: "CLANCY", label: "Clancy" },
  { value: "COLETTE", label: "Colette" },
  { value: "COLT", label: "Colt" },
  { value: "CORDELIUS", label: "Cordelius" },
  { value: "CROW", label: "Crow" },
  { value: "DARRYL", label: "Darryl" },
  { value: "DOUG", label: "Doug" },
  { value: "DRACO", label: "Draco" },
  { value: "DYNAMIKE", label: "Dynamike" },
  { value: "EDGAR", label: "Edgar" },
  { value: "EL PRIMO", label: "El Primo" },
  { value: "EMZ", label: "Emz" },
  { value: "EVE", label: "Eve" },
  { value: "FANG", label: "Fang" },
  { value: "FINX", label: "Finx" },
  { value: "FRANK", label: "Frank" },
  { value: "GALE", label: "Gale" },
  { value: "GENE", label: "Gene" },
  { value: "GRAY", label: "Gray" },
  { value: "GRIFF", label: "Griff" },
  { value: "GROM", label: "Grom" },
  { value: "GUS", label: "Gus" },
  { value: "HANK", label: "Hank" },
  { value: "JACKY", label: "Jacky" },
  { value: "JANET", label: "Janet" },
  { value: "JESSIE", label: "Jessie" },
  { value: "JUJU", label: "Juju" },
  { value: "KENJI", label: "Kenji" },
  { value: "KIT", label: "Kit" },
  { value: "LARRY & LAWRIE", label: "Larry & Lawrie" },
  { value: "LEON", label: "Leon" },
  { value: "LILY", label: "Lily" },
  { value: "LOLA", label: "Lola" },
  { value: "LOU", label: "Lou" },
  { value: "LUMI", label: "Lumi" },
  { value: "MAISIE", label: "Maisie" },
  { value: "MANDY", label: "Mandy" },
  { value: "MAX", label: "Max" },
  { value: "MEG", label: "Meg" },
  { value: "MELODIE", label: "Melodie" },
  { value: "MEEPLE", label: "Meeple" },
  { value: "MICO", label: "Mico" },
  { value: "MOE", label: "Moe" },
  { value: "MORTIS", label: "Mortis" },
  { value: "MR. P", label: "Mr. P" },
  { value: "NANI", label: "Nani" },
  { value: "NITA", label: "Nita" },
  { value: "OLLIE", label: "Ollie" },
  { value: "OTIS", label: "Otis" },
  { value: "PAM", label: "Pam" },
  { value: "PENNY", label: "Penny" },
  { value: "PEARL", label: "Pearl" },
  { value: "PIPER", label: "Piper" },
  { value: "POCO", label: "Poco"},
  { value: "R-T", label: "R-T" },
  { value: "RICO", label: "Rico" },
  { value: "ROSA", label: "Rosa" },
  { value: "RUFFS", label: "Ruffs" },
  { value: "SAM", label: "Sam" },
  { value: "SANDY", label: "Sandy" },
  { value: "SHELLY", label: "Shelly" },
  { value: "SHADE", label: "Shade" },
  { value: "SPIKE", label: "Spike" },
  { value: "SPROUT", label: "Sprout" },
  { value: "SQUEAK", label: "Squeak" },
  { value: "STU", label: "Stu" },
  { value: "SURGE", label: "Surge" },
  { value: "TARA", label: "Tara" },
  { value: "TICK", label: "Tick" },
  { value: "WILLOW", label: "Willow" }
];

const customSelectStyles = {
  control: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: "#333",
    borderColor: state.isFocused ? "#888" : "#666",
    minHeight: "40px",
    color: "white",
    boxShadow: state.isFocused ? "0 0 0 1px #888" : "none",
    "&:hover": {
      borderColor: "#888",
    },
    width: "100%",
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isSelected ? "#555" : state.isFocused ? "#444" : "#333",
    color: "white",
    padding: "8px 12px",
    "&:active": {
      backgroundColor: "#666",
    },
  }),
  singleValue: (baseStyles) => ({
    ...baseStyles,
    color: "white"
  }),
  menu: (baseStyles) => ({
    ...baseStyles,
    backgroundColor: "#333",
    border: "1px solid #666",
    marginTop: "4px",
    zIndex: 9999
  }),
  menuPortal: base => ({
    ...base,
    zIndex: 9999
  }),
  input: (baseStyles) => ({
    ...baseStyles,
    color: "white"
  }),
  placeholder: (baseStyles) => ({
    ...baseStyles,
    color: "#aaa"
  }),
  indicatorSeparator: () => ({
    display: "none",
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? "white" : "#aaa",
    "&:hover": {
      color: "white",
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: "#aaa",
    "&:hover": {
      color: "white",
    },
  }),
};

const dateFilterOptions = [
  { value: "2025-03-27", label: "All Time" },
  { value: "2025-05-01", label: "Jae-Yong release(May 1)" },
];

function App() {
  const [blueBrawlers, setBlueBrawlers] = useState([""]);
  const [blueCount, setBlueCount] = useState([0]);
  const [redBrawlers, setRedBrawlers] = useState([""]);
  const [redCount, setRedCount] = useState([0]);
  const [bans, setBans] = useState([""]);
  const [banCount, setBanCount] = useState([0]);
  const [map, setMap] = useState("");
  const [rawBrawlerStats, setRawBrawlerStats] = useState([]);
  const [rawTeamStats, setRawTeamStats] = useState([]);
  const [filteredBrawlerStats, setFilteredBrawlerStats] = useState([]);
  const [filteredTeamStats, setFilteredTeamStats] = useState([]);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [filterValue, setFilterValue] = useState(0);
  const [showType, setShowType] = useState("Brawler");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rank, setRank] = useState(18);
  const [sortColumn, setSortColumn] = useState("matchCount");
  const [sortDirection, setSortDirection] = useState("desc");
  const [bluesIncluded, setBluesIncluded] = useState(false);
  const [isButton2Hovered, setIsButton2Hovered] = useState(false);
  const [availableBrawlers, setAvailableBrawlers] = useState(brawlers); 
  const [selectedDateFilter, setSelectedDateFilter] = useState(dateFilterOptions[0].value);

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    console.log(`Fetching data... Map: "${map}", Blue:`, blueBrawlers.filter(b => b), "Red:", redBrawlers.filter(b => b), "rank:", rank, "Blues Included:", bluesIncluded);
    try {
      const response = await axios.post("http://localhost:8080/api/data/brawler", {
        map: map,
        blueBrawlers: blueBrawlers.filter(b => b !== ""),
        redBrawlers: redBrawlers.filter(b => b !== ""),
        trophies: rank,
        bluesIncluded: bluesIncluded,
        dateFilter: selectedDateFilter,
      });

      console.log("API Response Received:", response.data);
      const data = response.data || { brawlerStats: [], teamStats: [] };

      let brawlerList = data.brawlerStats || [];
      let teamList = data.teamStats || [];

      const currentRawTeamStats = [];
      const currentRawIndividualStats = [];

      for (const item of brawlerList) {
        item.brawlerName = capitalizeBrawlerName(item.brawlerName);
        currentRawIndividualStats.push(item);
      }

      for (const item of teamList) {
        if (item.brawlerName) {
          const parts = item.brawlerName.split(/(\s+VS\s+)/i);
          let formattedParts = [];
          for (const part of parts) {
            const trimmedPart = part?.trim();
            if (!trimmedPart) continue;

            if (trimmedPart.toUpperCase() === "VS") {
              formattedParts.push("VS");
            } else {
              formattedParts.push(capitalizeBrawlerName(trimmedPart));
            }
          }
          item.brawlerName = formattedParts.join(" ");
          currentRawTeamStats.push(item);
        }
      }

      console.log("Parsed Raw Individual Stats:", currentRawIndividualStats.length);
      console.log("Parsed Raw Team Stats:", currentRawTeamStats.length);

      setRawBrawlerStats(currentRawIndividualStats);
      setRawTeamStats(currentRawTeamStats);

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(`Failed to fetch data: ${err.message || "Unknown error"}. Check console.`);
      setRawBrawlerStats([]);
      setRawTeamStats([]);
    } finally {
      setIsLoading(false);
    }
  }, [map, blueBrawlers, redBrawlers, rank, bluesIncluded, selectedDateFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const selectedAndBanned = new Set([
      ...blueBrawlers.filter(b => b).map(b => b.toUpperCase()),
      ...redBrawlers.filter(b => b).map(b => b.toUpperCase()),
      ...bans.filter(b => b).map(b => b.toUpperCase())
    ]);

    const filteredOptions = brawlers.filter(option => !selectedAndBanned.has(option.value.toUpperCase()));
    setAvailableBrawlers(filteredOptions);

  }, [blueBrawlers, redBrawlers, bans]); 

  useEffect(() => {
    const activeBans = new Set(bans.filter(b => b !== "").map(b => b.toUpperCase()));

    let processedBrawlerStats = rawBrawlerStats
      .filter(brawler => !activeBans.has(brawler.brawlerName.toUpperCase()))
      .filter(brawler => !blueBrawlers.includes(brawler.brawlerName.toUpperCase()))
      .filter(brawler => !redBrawlers.includes(brawler.brawlerName.toUpperCase()))
      .filter(brawler => brawler.matchCount >= filterValue);

    let processedTeamStats = rawTeamStats.filter(team => {
      if (!team.brawlerName) return false;
      const teamMembers = team.brawlerName.split(/ VS /i).map(name => name.trim().toUpperCase())
      const isBanned = teamMembers.some(member => activeBans.has(member));
      return !isBanned;
    }).filter(team => team.matchCount >= filterValue);

    const sortMultiplier = sortDirection === "asc" ? 1 : -1;

    const sortFn = (a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      if (valA === undefined || valA === null) valA = sortColumn === "brawlerName" ? "" : -Infinity;
      if (valB === undefined || valB === null) valB = sortColumn === "brawlerName" ? "" : -Infinity;


      let comparison = 0;
      if (sortColumn === "brawlerName") {
        comparison = String(valA).localeCompare(String(valB));
      } else {
        const numA = Number(valA);
        const numB = Number(valB);
        comparison = (isNaN(numA) ? -Infinity : numA) - (isNaN(numB) ? -Infinity : numB);
      }

      return comparison * sortMultiplier;
    };

    processedBrawlerStats.sort(sortFn);
    processedTeamStats.sort(sortFn);

    setFilteredBrawlerStats(processedBrawlerStats);
    setFilteredTeamStats(processedTeamStats);

  }, [rawBrawlerStats, rawTeamStats, bans, filterValue, sortColumn, sortDirection, blueBrawlers, redBrawlers]);

  function capitalizeBrawlerName(name) {
    if (!name) return "";
    if(name === "R-T") return "R-T";
    if(name === "8-BIT") return "8-Bit";
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  function handleBlueChange(selectedOption, index) {
    let newBlueBrawlers = [...blueBrawlers];
    newBlueBrawlers[index] = selectedOption ? selectedOption.value : "";
    setBlueBrawlers(newBlueBrawlers);
    if(newBlueBrawlers.length === 2) {
      return;
    }
    let tempArr = [];
    for(let i = 0; i < newBlueBrawlers.length + 1; i++) {
      tempArr.push(i);
    }
    setBlueCount(tempArr);
  };

  function handleRedChange(selectedOption, index) {
    let newRedBrawlers = [...redBrawlers];
    newRedBrawlers[index] = selectedOption ? selectedOption.value : "";
    setRedBrawlers(newRedBrawlers);
    if(newRedBrawlers.length === 3) {
      return;
    }
    let tempArr = [];
    for(let i = 0; i < newRedBrawlers.length + 1; i++) {
      tempArr.push(i);
    }
    setRedCount(tempArr);
  }

  function handleBanChange(selectedOption, index) {
    let newBans = [...bans];
    newBans[index] = selectedOption ? selectedOption.value : "";
    setBans(newBans);
    if(newBans.length === 6) {
      return;
    }
    let tempArr = [];
    for(let i = 0; i < newBans.length + 1; i++) {
      tempArr.push(i);
    }
    setBanCount(tempArr);
  }

  function handleMapChange(event) {
    setMap(event.target.value);
  }

  function handleRankChange(event) {
    setRank(parseInt(event.target.value, 10));
  }

  function handleDateFilterChange(event) {
    setSelectedDateFilter(event.target.value);
  }

  function SortIndicator({ direction }) {
    if (!direction) return null;
    return direction === "asc" ? " ▲" : " ▼";
  };

  function handleHeaderClick(column) {
    if (isLoading) return;

    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection(column === "brawlerName" ? "asc" : "desc");
    }
  }

  function handleShowClick() {
    const newShowType = showType === "Brawler" ? "Team" : "Brawler";
    setSortColumn("matchCount");
    setSortDirection("desc");
    setShowType(newShowType);
  }

  function handleBlueClick() {
    setBluesIncluded(!bluesIncluded);
  }

  function handleFilter(event) {
    const newValue = event.target.value === "" ? 0 : parseInt(event.target.value, 10);
    setFilterValue(isNaN(newValue) ? 0 : newValue);
  }

  const findBrawlerOption = (value) => brawlers.find(option => option.value === value) || null;

  let statusMessage = "";
  if (isLoading) {
    statusMessage = "Loading statistics...";
  } else if (error) {
    statusMessage = error;
  }

  function renderTable(data, type) {
    const isTeam = type === "Teams";
    const columns = [
      { key: "brawlerName", label: isTeam ? "Team Composition" : "Brawler", align: "left" },
      { key: "winRate", label: "Win Rate", align: "right" },
      { key: "matchCount", label: "Battles", align: "right" },
    ];

    return (
      <div className="table-container">
        <table className="stats-table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.key} style={{ textAlign: col.align, cursor: "pointer" }} onClick={() => handleHeaderClick(col.key)}>
                  {col.label}
                  {sortColumn === col.key && <SortIndicator direction={sortDirection} />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              function getIconPath(name) {
                if (!name) return null;
                return `/assets/${name}.png`;
              };

              function renderBrawlerNameCell() {
                if (isTeam) {
                  return item.brawlerName;
                } else {
                  const iconSrc = getIconPath(item.brawlerName);
                  return (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span>{item.brawlerName}</span>
                      <div style={{width:"7px"}}></div>
                      {iconSrc && (<img src={iconSrc} alt={item.brawlerName} style={{ width: "24px", height: "auto", marginRight: "8px", verticalAlign: "middle" }} onError={(e) => { e.target.style.display = "none"; }}/>)}
                    </div>
                  );
                }
              };

              return (
                <tr key={`${item.brawlerName}-${index}`}>
                  <td style={{ textAlign: columns[0].align }}>{renderBrawlerNameCell()}</td>
                  <td style={{ textAlign: columns[1].align, color: item.winRate > 0.5 ? "#90EE90" : item.winRate < 0.5 ? "#FF7F7F" : "white" }}>
                    {(item.winRate * 100).toFixed(1)}%
                  </td>
                  <td style={{ textAlign: columns[2].align }}>
                    {item.matchCount}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };


  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-section">
          <label htmlFor="mapSelect" className="sidebar-label">Map:</label>
          <select id="mapSelect" value={map} onChange={handleMapChange} className="sidebar-select" disabled={isLoading}>
            <option value="">All Maps / Select a Map</option>
            <optgroup label="Bounty">
              <option value="Dry Season">Dry Season</option>
              <option value="Hideout">Hideout</option>
              <option value="Layer Cake">Layer Cake</option>
              <option value="Shooting Star">Shooting Star</option>
            </optgroup>

            <optgroup label="Brawl Ball">
              <option value="Center Stage">Center Stage</option>
              <option value="Pinball Dreams">Pinball Dreams</option>
              <option value="Sneaky Fields">Sneaky Fields</option>
              <option value="Triple Dribble">Triple Dribble</option>
            </optgroup>

            <optgroup label="Cleaning Duty">
              <option value="Dumpster Drive">Dumpster Drive</option>
              <option value="In The Bins">In The Bins</option>
              <option value="Rubbish Rampage">Rubbish Rampage</option>
              <option value="Waste Haven">Waste Haven</option>
            </optgroup>

            <optgroup label="Gem Grab">
              <option value="Double Swoosh">Double Swoosh</option>
              <option value="Gem Fort">Gem Fort</option>
              <option value="Hard Rock Mine">Hard Rock Mine</option>
              <option value="Undermine">Undermine</option>
            </optgroup>

            <optgroup label="Heist">
              <option value="Bridge Too Far">Bridge Too Far</option>
              <option value="Hot Potato">Hot Potato</option>
              <option value="Kaboom Canyon">Kaboom Canyon</option>
              <option value="Safe Zone">Safe Zone</option>
            </optgroup>

            <optgroup label="Knockout">
              <option value="Belle's Rock">Belle"s Rock</option>
              <option value="Flaring Phoenix">Flaring Phoenix</option>
              <option value="New Horizons">New Horizons</option>
              <option value="Out in the Open">Out in the Open</option>
            </optgroup>
          </select>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-heading" style={{ color: "#87CEFA" }}>Blue Team</h4>
          {blueCount.map(index => (
            <Select
              key={`blue-${index}`}
              options={availableBrawlers}
              value={findBrawlerOption(blueBrawlers[index])}
              onChange={(selectedOption) => handleBlueChange(selectedOption, index)}
              styles={customSelectStyles}
              placeholder={`Blue Brawler ${index + 1}`}
              isClearable
              isSearchable
              menuPortalTarget={document.body}
              classNamePrefix="react-select"
              isDisabled={isLoading}
              className="brawler-select"
              formatOptionLabel={({ value, label }) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={`/assets/${capitalizeBrawlerName(value)}b.png`}
                    alt={label}
                    style={{ width: "20px", height: "auto", marginRight: "10px" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <span>{label}</span>
                </div>
              )}
            />
          ))}
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-heading" style={{ color: "#FF7F7F" }}>Red Team</h4>
          {redCount.map(index => (
            <Select
              key={`red-${index}`}
              options={availableBrawlers}
              value={findBrawlerOption(redBrawlers[index])}
              onChange={(selectedOption) => handleRedChange(selectedOption, index)}
              styles={customSelectStyles}
              placeholder={`Red Brawler ${index + 1}`}
              isClearable
              isSearchable
              menuPortalTarget={document.body}
              classNamePrefix="react-select"
              isDisabled={isLoading}
              className="brawler-select"
              formatOptionLabel={({ value, label }) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={`/assets/${capitalizeBrawlerName(value)}b.png`}
                    alt={label}
                    style={{ width: "20px", height: "auto", marginRight: "10px" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <span>{label}</span>
                </div>
              )}
            />
          ))}
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-heading" style={{ color: "#AAAAAA" }}>Bans</h4>
          {banCount.map(index => (
            <Select
              key={`ban-${index}`}
              options={availableBrawlers}
              value={findBrawlerOption(bans[index])}
              onChange={(selectedOption) => handleBanChange(selectedOption, index)}
              styles={customSelectStyles}
              placeholder={`Ban ${index + 1}`}
              isClearable
              isSearchable
              menuPortalTarget={document.body}
              classNamePrefix="react-select"
              className="brawler-select"
              formatOptionLabel={({ value, label }) => (
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={`/assets/${capitalizeBrawlerName(value)}b.png`}
                    alt={label}
                    style={{ width: "20px", height: "auto", marginRight: "10px" }}
                    onError={(e) => { e.target.style.display = "none"; }}
                  />
                  <span>{label}</span>
                </div>
              )}
            />
          ))}
        </div>
      </div>

      <div className="main-content">
        <div className="user-info">
          <img src={discordLogo} alt="Discord Logo" className="discord-logo" />
          <span>mrshark477</span>
        </div>
        <div className="controls-row">
          <button
            onClick={handleShowClick}
            className="control-button"
            style={{ backgroundColor: isButtonHovered ? "#888888" : "#666666" }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            disabled={isLoading}>
            {"View " + (showType === "Team" ? "Brawler" : "Team") + " Stats"}
          </button>
          <button
            onClick={handleBlueClick}
            className="control-button"
            style={{ backgroundColor: isButton2Hovered ? "#888888" : "#666666" }}
            onMouseEnter={() => setIsButton2Hovered(true)}
            onMouseLeave={() => setIsButton2Hovered(false)}
            disabled={isLoading}>
            {bluesIncluded ? "Exclude Blue Team from Lookup" : "Include Blue Team in Lookup"}
          </button>
        </div>

        <div className="controls-row">
          <div className="control-group">
            <label htmlFor="minBattlesInput" className="control-label">Min Battles:</label>
            <input
              id="minBattlesInput"
              type="number"
              min="0"
              className="control-input number-input"
              onChange={handleFilter}
              value={filterValue}
              placeholder="Min Battles"
              disabled={isLoading}
            />
          </div>

          <div className="control-group">
            <label htmlFor="rankFilter" className="control-label">Ignore ranks below:</label>
            <select
              id="rankFilter"
              className="control-input select-input"
              onChange={handleRankChange}
              value={rank}
              disabled={isLoading}>
              <option value="18">Masters I</option>
              <option value="19">Masters II</option>
              <option value="20">Masters III</option>
              <option value="21">Pro</option>
            </select>
          </div>
        </div>

        <div className="control-group">
            <label htmlFor="dateFilterSelect" className="control-label">Filter Battles Since:</label>
            <select
              id="dateFilterSelect"
              className="control-input select-input"
              onChange={handleDateFilterChange}
              value={selectedDateFilter}
              disabled={isLoading}
            >
              {dateFilterOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

        {statusMessage && (
          <p className={`status-message ${error ? "error" : ""}`}>
            {statusMessage}
          </p>
        )}

        <>
          {showType === "Team" && (
            <>
              <h3 className="section-title">Team Statistics</h3>
              {filteredTeamStats.length > 0 ? (
                renderTable(filteredTeamStats, "Teams")
              ) : (
                !isLoading && !error && <p className="no-data-message">No team statistics available for the current filters.</p>
              )}
            </>
          )}

          {showType === "Brawler" && (
            <>
              <h3 className="section-title">
                {"Individual brawler statistics"}
                {(() => {
                  const filteredRedBrawlers = redBrawlers.filter(b => b !== "").map(b => b.charAt(0).toUpperCase() + b.slice(1).toLowerCase());
                  let againstText = "";
                  if (filteredRedBrawlers.length === 1) {
                    againstText = ` against ${filteredRedBrawlers[0]}`;
                  } else if (filteredRedBrawlers.length === 2) {
                    againstText = ` against ${filteredRedBrawlers[0]} and ${filteredRedBrawlers[1]}`;
                  } else if (filteredRedBrawlers.length > 2) {
                    const lastRed = filteredRedBrawlers.pop();
                    againstText = ` against ${filteredRedBrawlers.join(", ")} and ${lastRed}`;
                  }

                  let withText = "";
                  if (bluesIncluded) {
                    const filteredBlueBrawlers = blueBrawlers.filter(b => b !== "").map(b => b.charAt(0).toUpperCase() + b.slice(1).toLowerCase());
                    if (filteredBlueBrawlers.length === 1) {
                      withText = ` with ${filteredBlueBrawlers[0]} on your team`;
                    } else if (filteredBlueBrawlers.length === 2) {
                      withText = ` with ${filteredBlueBrawlers[0]} and ${filteredBlueBrawlers[1]} on your team`;
                    }
                  }
                  return `${againstText}${withText}`;
                })()}
              </h3>
              {filteredBrawlerStats.length > 0 ? (
                renderTable(filteredBrawlerStats, "Brawlers")
              ) : (
                !isLoading && !error && (
                  <p className="no-data-message">
                    No brawler statistics available for the current filters
                    {filterValue > 0 ? ` >= ${filterValue} battles` : ""}
                    {bans.filter(b => b !== "").length > 0 ?
                      `, excluding ${bans.filter(b => b !== "").length} ban${bans.filter(b => b !== "").length > 1 ? "s" : ""}` :
                      ""}
                    .
                  </p>
                )
              )}
            </>
          )}
        </>

      </div>
    </div>
  );
}

export default App;