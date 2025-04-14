import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';
import Select from 'react-select';

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
  { value: "POCO", label: "Poco" },
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
    boxShadow: state.isFocused ? '0 0 0 1px #888' : 'none',
    '&:hover': {
      borderColor: '#888',
    },
    width: '100%',
  }),
  option: (baseStyles, state) => ({
    ...baseStyles,
    backgroundColor: state.isSelected ? "#555" : state.isFocused ? "#444" : "#333",
    color: "white",
    padding: "8px 12px",
    '&:active': {
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
    marginTop: '4px',
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
    display: 'none',
  }),
  dropdownIndicator: (base, state) => ({
    ...base,
    color: state.isFocused ? 'white' : '#aaa',
    '&:hover': {
      color: 'white',
    },
  }),
  clearIndicator: (base) => ({
    ...base,
    color: '#aaa',
    '&:hover': {
      color: 'white',
    },
  }),
};


function App() {
  const [blueBrawlers, setBlueBrawlers] = useState(["", "", ""]);
  const [redBrawlers, setRedBrawlers] = useState(["", "", ""]);
  const [bans, setBans] = useState(["", "", "", "", "", ""]);
  const [map, setMap] = useState("");
  const [rawBrawlerStats, setRawBrawlerStats] = useState([]);
  const [rawTeamStats, setRawTeamStats] = useState([]);
  const [filteredBrawlerStats, setFilteredBrawlerStats] = useState([]);
  const [filteredTeamStats, setFilteredTeamStats] = useState([]);
  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [filterValue, setFilterValue] = useState(0);
  const [showType, setShowType] = useState("Brawlers");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rank, setRank] = useState(18);
  const [sortColumn, setSortColumn] = useState('matchCount');
  const [sortDirection, setSortDirection] = useState('desc');
  const [bluesIncluded, setBluesIncluded] = useState(false);
  const [isButton2Hovered, setIsButton2Hovered] = useState(false);


  useEffect(() => {
    async function fetchData() {
      setIsLoading(true);
      setError(null);
      console.log(`Fetching data... Map: '${map}', Blue:`, blueBrawlers, "Red:", redBrawlers, "rank:", rank);
      try {
        const response = await axios.post('http://localhost:8080/api/data/brawler', {
          map: map,
          blueBrawlers: blueBrawlers.filter(b => b !== ""),
          redBrawlers: redBrawlers.filter(b => b !== ""),
          trophies: rank,
          bluesIncluded: bluesIncluded,
        });

        console.log('API Response Received:', response.data);
        const data = response.data || [];

        const currentRawTeamStats = [];
        const currentRawIndividualStats = [];

        const capitalizeBrawlerName = (name) => {
          return name
            .split(' ')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
            .join(' ');
        };

        for (const item of data) {
          if (typeof item === 'object' && item !== null && item.brawlerName && typeof item.winRate === 'number' && typeof item.matchCount === 'number') {
            if (/\s+VS\s+/i.test(item.brawlerName)) {
              const parts = item.brawlerName.split(/(\s+VS\s+)/i);
              let formattedParts = [];
              for (const part of parts) {
                const trimmedPart = part?.trim();
                if (!trimmedPart) continue;

                if (trimmedPart.toUpperCase() === 'VS') {
                  formattedParts.push('VS');
                } else {
                  formattedParts.push(capitalizeBrawlerName(trimmedPart));
                }
              }
              item.brawlerName = formattedParts.join(' ');
              currentRawTeamStats.push(item);
            } else {
              item.brawlerName = capitalizeBrawlerName(item.brawlerName);
              currentRawIndividualStats.push(item);
            }
          } else {
            console.warn("Skipping invalid item in API response:", item);
          }
        }

        console.log('Parsed Raw Individual Stats:', currentRawIndividualStats.length);
        console.log('Parsed Raw Team Stats:', currentRawTeamStats.length);

        setRawBrawlerStats(currentRawIndividualStats);
        setRawTeamStats(currentRawTeamStats);

      } catch (err) {
        console.error('Error fetching data:', err);
        setError(`Failed to fetch data: ${err.message || 'Unknown error'}. Check console.`);
        setRawBrawlerStats([]);
        setRawTeamStats([]);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [map, blueBrawlers, redBrawlers, rank, bluesIncluded]);

  useEffect(() => {
    console.log(`Applying frontend filters and sorting... Column: ${sortColumn}, Direction: ${sortDirection}`);

    const activeBans = new Set(bans.filter(b => b !== "").map(b => b.toUpperCase()));
    console.log("Active Bans for filtering:", activeBans);

    let processedBrawlerStats = rawBrawlerStats.filter(brawler => !activeBans.has(brawler.brawlerName.toUpperCase())).filter(brawler => brawler.matchCount >= filterValue);

    let processedTeamStats = rawTeamStats.filter(team => {
      const teamMembers = team.brawlerName.split(/ VS /i).map(name => name.trim().toUpperCase())
      const isBanned = teamMembers.some(member => activeBans.has(member));
      return !isBanned;
    });

    console.log('Filtered Individual Stats Count:', processedBrawlerStats.length);
    console.log('Filtered Team Stats Count:', processedTeamStats.length);


    const sortMultiplier = sortDirection === 'asc' ? 1 : -1;

    const sortFn = (a, b) => {
      let valA = a[sortColumn];
      let valB = b[sortColumn];

      let comparison = 0;
      if (sortColumn === 'brawlerName') {
        comparison = valA.localeCompare(valB);
      } else {
        comparison = valA - valB;
      }

      return comparison * sortMultiplier;
    };


    processedBrawlerStats.sort(sortFn);
    processedTeamStats.sort(sortFn);

    console.log('Setting Filtered/Sorted State...');
    setFilteredBrawlerStats(processedBrawlerStats);
    setFilteredTeamStats(processedTeamStats);

  }, [rawBrawlerStats, rawTeamStats, bans, filterValue, sortColumn, sortDirection]);


  function handleBlueChange(selectedOption, index) {
    let newBlueBrawlers = [...blueBrawlers];
    newBlueBrawlers[index] = selectedOption ? selectedOption.value : "";
    setBlueBrawlers(newBlueBrawlers);
  };

  function handleRedChange(selectedOption, index) {
    let newRedBrawlers = [...redBrawlers];
    newRedBrawlers[index] = selectedOption ? selectedOption.value : "";
    setRedBrawlers(newRedBrawlers);
  }

  function handleBanChange(selectedOption, index) {
    let newBans = [...bans];
    newBans[index] = selectedOption ? selectedOption.value : "";
    setBans(newBans);
  }

  function handleMapChange(event) {
    setMap(event.target.value);
  }

  function handleRankChange(event) {
    setRank(parseInt(event.target.value, 10));
  }

  function SortIndicator(direction) {
    if (!direction) return null;
    return direction === 'asc' ? ' ▲' : ' ▼';
  };


  function handleHeaderClick(column) {
    if (isLoading) return; 

    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection(column === 'brawlerName' ? 'asc' : 'desc');
    }
  }


  function handleShowClick() {
    const newShowType = showType === "Brawlers" ? "Teams" : "Brawlers";
    setShowType(newShowType);
  }

  function handleBlueClick() {
    setBluesIncluded(!bluesIncluded);
  }

  function handleFilter(event) {
    const newValue = event.target.value === '' ? 0 : parseInt(event.target.value, 10);
    setFilterValue(isNaN(newValue) ? 0 : newValue);
  }

  const findBrawlerOption = (value) => brawlers.find(option => option.value === value) || null;

  let statusMessage = "";
  if (isLoading) {
    statusMessage = "Loading statistics...";
  } else if (error) {
    statusMessage = error;
  }

  return (
    <div style={{ backgroundColor: "#2d2d2d", minHeight: "100vh", width: "100vw", display: "flex", color: "white" }}>
      <div style={{ display: "flex", flex: "0 0 400px", height: "100vh", backgroundColor: "#444444", flexDirection: "column", padding: "20px", boxSizing: 'border-box', gap: '15px', overflowY: 'auto' }}>
        <div style={{ display: "flex", flexDirection: "column", gap: '5px' }}>
          <label htmlFor="mapSelect" style={{ marginBottom: '5px', fontWeight: 'bold' }}>Map:</label>
          <select id="mapSelect" value={map} onChange={handleMapChange} style={{ padding: "10px", borderRadius: "4px", backgroundColor: "#333", color: "white", border: "1px solid #666", fontSize: '1rem' }} disabled={isLoading}>
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

            <optgroup label="Brawl Hockey">
              <option value="Below Zero">Below Zero</option>
              <option value="Cool Box">Cool Box</option>
              <option value="Starr Garden">Starr Garden</option>
              <option value="Super Center">Super Center</option>
            </optgroup>

            <optgroup label="Gem Grab">
              <option value="Double Swoosh">Double Swoosh</option>
              <option value="Gem Fort">Gem Fort</option>
              <option value="Hard Rock Mine">Hard Rock Mine</option>
              <option value="Undermine">Undermine</option>
            </optgroup>

            <optgroup label="Hot Zone">
              <option value="Dueling Beetles">Dueling Beetles</option>
              <option value="Open Business">Open Business</option>
              <option value="Parallel Plays">Parallel Plays</option>
              <option value="Ring of Fire">Ring of Fire</option>
            </optgroup>

            <optgroup label="Knockout">
              <option value="Belle's Rock">Belle's Rock</option>
              <option value="Flaring Phoenix">Flaring Phoenix</option>
              <option value="New Horizons">New Horizons</option>
              <option value="Out in the Open">Out in the Open</option>
            </optgroup>
          </select>
        </div>

        <div style={{ display: "flex", flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#87CEFA' }}>Blue Team</h4>
          {[0, 1].map(index => (
            <Select key={`blue-${index}`} options={brawlers} value={findBrawlerOption(blueBrawlers[index])} onChange={(selectedOption) => handleBlueChange(selectedOption, index)} styles={customSelectStyles} placeholder={`Blue Brawler ${index + 1}`} isClearable isSearchable menuPortalTarget={document.body} classNamePrefix="react-select" isDisabled={isLoading}/>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#FF7F7F' }}>Red Team</h4>
          {[0, 1, 2].map(index => (
            <Select key={`red-${index}`} options={brawlers} value={findBrawlerOption(redBrawlers[index])} onChange={(selectedOption) => handleRedChange(selectedOption, index)} styles={customSelectStyles} placeholder={`Red Brawler ${index + 1}`} isClearable isSearchable menuPortalTarget={document.body} classNamePrefix="react-select" isDisabled={isLoading}/>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: 'column', gap: '10px' }}>
          <h4 style={{ margin: '0 0 5px 0', color: '#AAAAAA' }}>Bans</h4>
          {[0, 1, 2, 3, 4, 5].map(index => (
            <Select key={`ban-${index}`} options={brawlers} value={findBrawlerOption(bans[index])} onChange={(selectedOption) => handleBanChange(selectedOption, index)} styles={customSelectStyles} placeholder={`Ban ${index + 1}`} isClearable isSearchable menuPortalTarget={document.body} classNamePrefix="react-select"/>
          ))}
        </div>
      </div>


      <div style={{ backgroundColor: "#222222", flex: "1", height: "100vh", padding: "20px", boxSizing: 'border-box', overflowY: "auto" }}>
        <div style={{ display: "flex", gap: "15px", marginBottom: '20px', flexWrap: 'wrap' }}>
          <button onClick={handleShowClick} style={{ padding: "10px 20px", height: "40px", backgroundColor: isButtonHovered ? "#888888" : "#666666", border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onMouseEnter={() => setIsButtonHovered(true)} onMouseLeave={() => setIsButtonHovered(false)} disabled={isLoading}>
            {"Show " + (showType === "Teams" ? "Brawlers" : "Teams")}
          </button>
          <button onClick={handleBlueClick} style={{ padding: "10px 20px", height: "40px", backgroundColor: isButton2Hovered ? "#888888" : "#666666", border: 'none', borderRadius: '4px', color: 'white', cursor: 'pointer', transition: 'background-color 0.3s ease' }} onMouseEnter={() => setIsButton2Hovered(true)} onMouseLeave={() => setIsButton2Hovered(false)} disabled={isLoading}>
            {bluesIncluded ? "Remove blue brawlers from lookup" : "Add blue brawlers to lookup"}
          </button>
        </div>

        <div style={{ display: "flex", gap: "30px", marginBottom: "30px", flexWrap: 'wrap' }}>
          <div style={{ display: "flex", gap: "15px", alignItems: 'center' }}>
            <label htmlFor="minBattlesInput" style={{ flexShrink: 0 }}>Min Battles:</label>
            <input
              id="minBattlesInput"
              type="number"
              min="0"
              style={{ width: "100px", height: "40px", borderRadius: "4px", boxSizing: "border-box", border: "1px solid #666", backgroundColor: '#333', color: 'white', padding: '0 10px' }}
              onChange={handleFilter}
              value={filterValue}
              placeholder="Min Battles"
              disabled={isLoading}
            />
          </div>

          <div style={{ display: "flex", gap: "15px", alignItems: 'center' }}>
            <label htmlFor="rankFilter" style={{ flexShrink: 0 }}>Ignore ranks below:</label>
            <select id="rankFilter" style={{ width: "150px", height: "40px", borderRadius: "4px", boxSizing: "border-box", border: "1px solid #666", backgroundColor: '#333', color: 'white', padding: '0 10px' }} onChange={handleRankChange} value={rank} disabled={isLoading}>
              <option value="18">Masters I</option>
              <option value="19">Masters II</option>
              <option value="20">Masters III</option>
              <option value="21">Pro</option>
            </select>
          </div>
        </div>

        {statusMessage && (
          <p style={{ marginTop: '10px', marginBottom: '20px', textAlign: 'center', color: error ? '#FF7F7F' : '#AAAAAA' }}>
            {statusMessage}
          </p>
        )}

        <>
          {showType === "Teams" && (
            <>
              <h3 style={{ marginBottom: "10px" }}>Team Statistics</h3>
              {filteredTeamStats.length > 0 ? (
                <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "50px" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #555" }}>
                      <th style={{ textAlign: "left", padding: "10px 8px", fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleHeaderClick('brawlerName')}>
                        Team Composition
                        {sortColumn === 'brawlerName' && <SortIndicator direction={sortDirection} />}
                      </th>
                      <th style={{ textAlign: "right", padding: "10px 8px", fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleHeaderClick('winRate')} >
                        Win Rate
                        {sortColumn === 'winRate' && <SortIndicator direction={sortDirection} />}
                      </th>
                      <th style={{ textAlign: "right", padding: "10px 8px", fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleHeaderClick('matchCount')}>
                        Battles
                        {sortColumn === 'matchCount' && <SortIndicator direction={sortDirection} />}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTeamStats.map((team, index) => (
                      <tr key={`${team.brawlerName}-${index}`} style={{ backgroundColor: index % 2 === 0 ? "#3a3a3a" : "#444444", borderBottom: "1px solid #555" }}>
                        <td style={{ padding: "10px 8px" }}>{team.brawlerName}</td>
                        <td style={{ textAlign: "right", padding: "10px 8px", color: team.winRate > 0.5 ? '#87CEFA' : team.winRate < 0.5 ? '#FF7F7F' : 'white' }}>
                          {(team.winRate * 100).toFixed(1)}%
                        </td>
                        <td style={{ textAlign: "right", padding: "10px 8px" }}>
                          {team.matchCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                !isLoading && !error && <p>No team statistics available for the current filters.</p>
              )}
            </>
          )}

          {showType === "Brawlers" && (
            <>
              <h3 style={{ marginBottom: "10px" }}>
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
                <table style={{ width: "100%", borderCollapse: "collapse" }}>
                  <thead>
                    <tr style={{ borderBottom: "2px solid #555" }}>
                      <th style={{ textAlign: "left", padding: "10px 8px", fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleHeaderClick('brawlerName')}>
                        Brawler
                        {sortColumn === 'brawlerName' && <SortIndicator direction={sortDirection} />}
                      </th>
                      <th style={{ textAlign: "right", padding: "10px 8px", fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleHeaderClick('winRate')}>
                        Win Rate
                        {sortColumn === 'winRate' && <SortIndicator direction={sortDirection} />}
                      </th>
                      <th style={{ textAlign: "right", padding: "10px 8px", fontWeight: 'bold', cursor: 'pointer' }} onClick={() => handleHeaderClick('matchCount')}>
                        Battles
                        {sortColumn === 'matchCount' && <SortIndicator direction={sortDirection} />}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBrawlerStats.map((brawler, index) => (
                      <tr key={`${brawler.brawlerName}-${index}`} style={{ backgroundColor: index % 2 === 0 ? "#3a3a3a" : "#444444", borderBottom: "1px solid #555" }}>
                        <td style={{ padding: "10px 8px" }}>{brawler.brawlerName}</td>
                        <td style={{ textAlign: "right", padding: "10px 8px", color: brawler.winRate > 0.5 ? '#87CEFA' : brawler.winRate < 0.5 ? '#FF7F7F' : 'white' }}>
                          {(brawler.winRate * 100).toFixed(1)}%
                        </td>
                        <td style={{ textAlign: "right", padding: "10px 8px" }}>
                          {brawler.matchCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                !isLoading && !error && (
                  <p>No brawler statistics available for the current filters
                    {filterValue > 0 ? ` >= ${filterValue} battles` : ''}
                    {bans.filter(b => b !== "").length > 0 ?
                      `, excluding ${bans.filter(b => b !== "").length} ban${bans.filter(b => b !== "").length > 1 ? 's' : ''}` :
                      ''}
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