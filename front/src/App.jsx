import { useEffect, useState, useCallback, useMemo } from "react";
import { useTranslation } from 'react-i18next';
import "./App.css";
import axios from "axios";
import Select from "react-select";
import discordLogo from "./assets/discord.svg";
import InfoTooltip from "./InfoTooltip";
import LeaderboardModal from "./LeaderboardModal";
import gbFlag from "./assets/gb.png";
import trFlag from "./assets/tr.png";

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
  { value: "JAE-YONG", label: "Jae-Yong" },
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

function App() {
  const { t, i18n } = useTranslation();

  const dateFilterOptions = useMemo(() => [
    { value: "2025-04-10", label: t("app.mainContent.dateFilter.options.allTimeApril10") },
    { value: "2025-04-30", label: t("app.mainContent.dateFilter.options.balanceChangesApril30") },
  ], [t]);

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
  const [selectedDateFilter, setSelectedDateFilter] = useState(dateFilterOptions[1].value);
  const [playerTag, setPlayerTag] = useState("");
  const [playerTotalWinRate, setPlayerTotalWinRate] = useState(null);
  const [playerTotalMatches, setPlayerTotalMatches] = useState(0);
  const [isLeaderboardModalOpen, setIsLeaderboardModalOpen] = useState(false);
  const [leaderboardData, setLeaderboardData] = useState({ mostMatches: [], highestWinRate: [] });
  const [isLeaderboardLoading, setIsLeaderboardLoading] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState(null);
  const [isLangButtonHovered, setIsLangButtonHovered] = useState(false);

  function changeLanguage(lng) {
    i18n.changeLanguage(lng);
  };

  function toggleLanguage() {
    const newLang = i18n.language === 'en' ? 'tr' : 'en';
    changeLanguage(newLang);
  };

  const shouldShowPlayerTag = useCallback(() => {
    return blueBrawlers.filter(b => b !== "").length === 0 && redBrawlers.filter(b => b !== "").length === 0;
  }, [blueBrawlers, redBrawlers]);

  const fetchLeaderboardData = useCallback(async (leaderboardRankFilter, dateFilter, minGames) => {
    console.log("Fetching leaderboard data...");
    setIsLeaderboardLoading(true);
    setLeaderboardError(null);
    try {
      const rankToFetch = Number(leaderboardRankFilter);
      if (isNaN(rankToFetch)) {
        console.warn("Leaderboard rank filter is invalid or undefined. Skipping fetch.", leaderboardRankFilter);
        setLeaderboardData({ mostMatches: [], highestWinRate: [] });
        setIsLeaderboardLoading(false);
        return;
      }
      const requestBody = {
        rank: rankToFetch,
      };
      if (dateFilter) {
        requestBody.dateFilter = dateFilter;
      }
      if (minGames !== undefined) {
        requestBody.minBattles = minGames;
      }
      console.log(requestBody);
      const response = await axios.post(`https://8c96-213-142-134-32.ngrok-free.app/api/data/leaderboard`, requestBody);
      console.log("Leaderboard API Response Received:", response.data);
      setLeaderboardData(response.data || { mostMatches: [], highestWinRate: [] });
    } catch (err) {
      console.error("Error fetching leaderboard data:", err);
      setLeaderboardError(t("app.mainContent.status.leaderboardFetchError"));
      setLeaderboardData({ mostMatches: [], highestWinRate: [] });
    } finally {
      setIsLeaderboardLoading(false);
    }
  }, [setIsLeaderboardLoading, setLeaderboardError, setLeaderboardData, t]);

  function openLeaderboardModal() {
    setIsLeaderboardModalOpen(true);
  };

  function closeLeaderboardModal() {
    setIsLeaderboardModalOpen(false);
  };

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setPlayerTotalWinRate(null);
    setPlayerTotalMatches(0);
    console.log(`Fetching data... Map: "${map}", Blue:`, blueBrawlers.filter(b => b), "Red:", redBrawlers.filter(b => b), "rank:", rank, "Blues Included:", bluesIncluded);
    try {
      const activePlayerTag = shouldShowPlayerTag() ? playerTag : "";
      const response = await axios.post("https://8c96-213-142-134-32.ngrok-free.app/api/data/brawler", {
        map: map,
        blueBrawlers: blueBrawlers.filter(b => b !== ""),
        redBrawlers: redBrawlers.filter(b => b !== ""),
        trophies: rank,
        bluesIncluded: bluesIncluded,
        dateFilter: selectedDateFilter,
        playerTag: playerTag
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

      if (activePlayerTag && currentRawIndividualStats.length > 0) {
        let totalPlayerWins = 0;
        let tempTotalPlayerMatches = 0;
        currentRawIndividualStats.forEach(stat => {
          const matchCount = Number(stat.matchCount) || 0;
          const winRate = Number(stat.winRate) || 0;
          tempTotalPlayerMatches += matchCount;
          totalPlayerWins += winRate * matchCount;
        });
        const overallWinRate = tempTotalPlayerMatches > 0 ? (totalPlayerWins / tempTotalPlayerMatches) : 0;
        setPlayerTotalWinRate(overallWinRate);
        setPlayerTotalMatches(tempTotalPlayerMatches);
      } else {
        setPlayerTotalWinRate(null);
        setPlayerTotalMatches(0);
      }

    } catch (err) {
      console.error("Error fetching data:", err);
      setError(t("app.mainContent.status.fetchError"));
      setRawBrawlerStats([]);
      setRawTeamStats([]);
    } finally {
      setIsLoading(false);
    }
  }, [map, blueBrawlers, redBrawlers, rank, bluesIncluded, selectedDateFilter, playerTag, shouldShowPlayerTag, t]);

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

    if (!shouldShowPlayerTag()) {
      setPlayerTag("");
      setPlayerTotalWinRate(null);
      setPlayerTotalMatches(0);
    }

  }, [blueBrawlers, redBrawlers, bans, shouldShowPlayerTag]);

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
    if (name === "R-T") return "R-T";
    if (name === "8-BIT") return "8-Bit";
    if (name === "JAE-YONG") return "Jae-Yong";
    return name
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  function handleBlueChange(selectedOption, index) {
    let newBlueBrawlers = [...blueBrawlers];
    newBlueBrawlers[index] = selectedOption ? selectedOption.value : "";
    setBlueBrawlers(newBlueBrawlers);
    if (newBlueBrawlers.length === 2) {
      return;
    }
    let tempArr = [];
    for (let i = 0; i < newBlueBrawlers.length + 1; i++) {
      tempArr.push(i);
    }
    setBlueCount(tempArr);
  };

  function handleRedChange(selectedOption, index) {
    let newRedBrawlers = [...redBrawlers];
    newRedBrawlers[index] = selectedOption ? selectedOption.value : "";
    setRedBrawlers(newRedBrawlers);
    if (newRedBrawlers.length === 3) {
      return;
    }
    let tempArr = [];
    for (let i = 0; i < newRedBrawlers.length + 1; i++) {
      tempArr.push(i);
    }
    setRedCount(tempArr);
  }

  function handleBanChange(selectedOption, index) {
    let newBans = [...bans];
    newBans[index] = selectedOption ? selectedOption.value : "";
    setBans(newBans);
    if (newBans.length === 6) {
      return;
    }
    let tempArr = [];
    for (let i = 0; i < newBans.length + 1; i++) {
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

  function handlePlayerTagChange(event) {
    setPlayerTag(event.target.value.toUpperCase());
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

  const leaderboardRankOptions = useMemo(() => [
    { value: 18, label: t("app.mainContent.rankFilter.ranks.masters1") },
    { value: 19, label: t("app.mainContent.rankFilter.ranks.masters2") },
    { value: 20, label: t("app.mainContent.rankFilter.ranks.masters3") },
    { value: 21, label: t("app.mainContent.rankFilter.ranks.pro") },
  ], [t]);

  let statusMessage = "";
  if (isLoading) {
    statusMessage = t("app.mainContent.status.loading");
  } else if (error) {
    statusMessage = error;
  }

  function renderTable(data, type) {
    const isTeam = type === "Teams";
    const columns = [
      { key: "brawlerName", label: isTeam ? t("app.mainContent.tableHeaders.teamComposition") : t("app.mainContent.tableHeaders.brawler"), align: "left" },
      { key: "winRate", label: t("app.mainContent.tableHeaders.winRate"), align: "right" },
      { key: "matchCount", label: t("app.mainContent.tableHeaders.battles"), align: "right" },
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
                      <div style={{ width: "7px" }}></div>
                      {iconSrc && (<img src={iconSrc} alt={item.brawlerName} style={{ width: "24px", height: "auto", marginRight: "8px", verticalAlign: "middle" }} onError={(e) => { e.target.style.display = "none"; }} />)}
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

  const mapOptions = useMemo(() => [
    { value: "", label: t("app.sidebar.map.allMapsOption") },
    {
      label: t("app.sidebar.mapGroups.bounty"), options: [
        { value: "Dry Season", label: t("app.sidebar.maps.drySeason") },
        { value: "Hideout", label: t("app.sidebar.maps.hideout") },
        { value: "Layer Cake", label: t("app.sidebar.maps.layerCake") },
        { value: "Shooting Star", label: t("app.sidebar.maps.shootingStar") },
      ]
    },
    {
      label: t("app.sidebar.mapGroups.brawlBall"), options: [
        { value: "Center Stage", label: t("app.sidebar.maps.centerStage") },
        { value: "Pinball Dreams", label: t("app.sidebar.maps.pinballDreams") },
        { value: "Sneaky Fields", label: t("app.sidebar.maps.sneakyFields") },
        { value: "Triple Dribble", label: t("app.sidebar.maps.tripleDribble") },
      ]
    },
    {
      label: t("app.sidebar.mapGroups.gemGrab"), options: [
        { value: "Double Swoosh", label: t("app.sidebar.maps.doubleSwoosh") },
        { value: "Gem Fort", label: t("app.sidebar.maps.gemFort") },
        { value: "Hard Rock Mine", label: t("app.sidebar.maps.hardRockMine") },
        { value: "Undermine", label: t("app.sidebar.maps.undermine") },
      ]
    },
    {
      label: t("app.sidebar.mapGroups.heist"), options: [
        { value: "Bridge Too Far", label: t("app.sidebar.maps.bridgeTooFar") },
        { value: "Hot Potato", label: t("app.sidebar.maps.hotPotato") },
        { value: "Kaboom Canyon", label: t("app.sidebar.maps.kaboomCanyon") },
        { value: "Safe Zone", label: t("app.sidebar.maps.safeZone") },
      ]
    },
    {
      label: t("app.sidebar.mapGroups.knockout"), options: [
        { value: "Belle's Rock", label: t("app.sidebar.maps.bellesRock") },
        { value: "Flaring Phoenix", label: t("app.sidebar.maps.flaringPhoenix") },
        { value: "New Horizons", label: t("app.sidebar.maps.newHorizons") },
        { value: "Out in the Open", label: t("app.sidebar.maps.outInTheOpen") },
      ]
    },
    {
      label: t("app.sidebar.mapGroups.hotZone"), options: [
        { value: "Dueling Beetles", label: t("app.sidebar.maps.duelingBeetles") },
        { value: "Open Business", label: t("app.sidebar.maps.openBusiness") },
        { value: "Parallel Plays", label: t("app.sidebar.maps.parallelPlays") },
        { value: "Ring of Fire", label: t("app.sidebar.maps.ringOfFire") },
      ]
    }
  ], [t]);


  return (
    <div className="app-container">
      <div className="sidebar">
        <div className="sidebar-section">
          <button
            onClick={toggleLanguage}
            className="control-button"
            style={{
              marginBottom: '10px',
              width: '51px',
              padding: '5px',
              border: '1px solid #777',
              background: isLangButtonHovered ? '#686868' : '#4A4A4A',
              cursor: 'pointer',
              borderRadius: '10px'
            }}
            onMouseEnter={() => setIsLangButtonHovered(true)}
            onMouseLeave={() => setIsLangButtonHovered(false)}
          >
            <img
              src={i18n.language === 'en' ? gbFlag : trFlag}
              alt={i18n.language === 'en' ? "Switch to Turkish" : "Switch to English"}
              style={{ width: '40px', height: '30px', display: 'block', borderRadius: "10px" }}
            />
          </button>
          <label htmlFor="mapSelect" className="sidebar-label">
            {t("app.sidebar.map.label")}
            <InfoTooltip text={t("app.sidebar.map.tooltip")} />
          </label>
          <select id="mapSelect" value={map} onChange={handleMapChange} className="sidebar-select" disabled={isLoading}>
            {mapOptions.map(groupOrOption => {
              if (groupOrOption.options) {
                return (
                  <optgroup key={groupOrOption.label} label={groupOrOption.label}>
                    {groupOrOption.options.map(option => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                  </optgroup>
                );
              }
              return <option key={groupOrOption.value} value={groupOrOption.value}>{groupOrOption.label}</option>;
            })}
          </select>
        </div>

        <div className="sidebar-section">
          <h4 className="sidebar-heading" style={{ color: "#87CEFA" }}>
            {t("app.sidebar.blueTeam.heading")}
            <InfoTooltip text={t("app.sidebar.blueTeam.tooltip")} />
          </h4>
          {blueCount.map(index => (
            <Select
              key={`blue-${index}`}
              options={availableBrawlers}
              value={findBrawlerOption(blueBrawlers[index])}
              onChange={(selectedOption) => handleBlueChange(selectedOption, index)}
              styles={customSelectStyles}
              placeholder={t("app.sidebar.blueTeam.placeholderPrefix") + (index + 1)}
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
          <h4 className="sidebar-heading" style={{ color: "#FF7F7F" }}>
            {t("app.sidebar.redTeam.heading")}
            <InfoTooltip text={t("app.sidebar.redTeam.tooltip")} />
          </h4>
          {redCount.map(index => (
            <Select
              key={`red-${index}`}
              options={availableBrawlers}
              value={findBrawlerOption(redBrawlers[index])}
              onChange={(selectedOption) => handleRedChange(selectedOption, index)}
              styles={customSelectStyles}
              placeholder={t("app.sidebar.redTeam.placeholderPrefix") + (index + 1)}
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
          <h4 className="sidebar-heading" style={{ color: "#AAAAAA" }}>
            {t("app.sidebar.bans.heading")}
            <InfoTooltip text={t("app.sidebar.bans.tooltip")} />
          </h4>
          {banCount.map(index => (
            <Select
              key={`ban-${index}`}
              options={availableBrawlers}
              value={findBrawlerOption(bans[index])}
              onChange={(selectedOption) => handleBanChange(selectedOption, index)}
              styles={customSelectStyles}
              placeholder={t("app.sidebar.bans.placeholderPrefix") + (index + 1)}
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
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'flex-start' }}>
          <button
            onClick={openLeaderboardModal}
            className="control-button"
            style={{ backgroundColor: '#666666' }}
            disabled={isLoading || isLeaderboardLoading}>
            {t("app.mainContent.viewLeaderboardButton")}
          </button>
          <InfoTooltip style={{ marginTop: "9px" }} text={t("app.mainContent.viewLeaderboardTooltip")} />
        </div>
        <div className="controls-row">
          <button
            onClick={handleShowClick}
            className="control-button"
            style={{ backgroundColor: isButtonHovered ? "#888888" : "#666666" }}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
            disabled={isLoading}>
            {showType === "Team" ? t("app.mainContent.toggleStatsButton.viewBrawlerStats") : t("app.mainContent.toggleStatsButton.viewTeamStats")}
          </button>
          <InfoTooltip style={{ marginLeft: "-4px" }} text={t("app.mainContent.toggleStatsTooltip")} />
          <button
            onClick={handleBlueClick}
            className="control-button"
            style={{ backgroundColor: isButton2Hovered ? "#888888" : "#666666" }}
            onMouseEnter={() => setIsButton2Hovered(true)}
            onMouseLeave={() => setIsButton2Hovered(false)}
            disabled={isLoading}>
            {bluesIncluded ? t("app.mainContent.blueTeamLookupButton.exclude") : t("app.mainContent.blueTeamLookupButton.include")}
          </button>
          <InfoTooltip style={{ marginLeft: "-4px" }} text={t("app.mainContent.blueTeamLookupTooltip")} />
        </div>

        <div className="controls-row">
          <div className="control-group">
            <label htmlFor="minBattlesInput" className="control-label">
              {t("app.mainContent.minBattles.label")}
              <InfoTooltip text={t("app.mainContent.minBattles.tooltip")} />
            </label>
            <input
              id="minBattlesInput"
              type="number"
              min="0"
              className="control-input number-input"
              onChange={handleFilter}
              value={filterValue}
              placeholder={t("app.mainContent.minBattles.placeholder")}
              disabled={isLoading}
            />
          </div>

          <div className="control-group">
            <label htmlFor="rankFilter" className="control-label">
              {t("app.mainContent.rankFilter.label")}
              <InfoTooltip text={t("app.mainContent.rankFilter.tooltip")} />
            </label>
            <select
              id="rankFilter"
              className="control-input select-input"
              onChange={handleRankChange}
              value={rank}
              disabled={isLoading}>
              <option value="18">{t("app.mainContent.rankFilter.ranks.masters1")}</option>
              <option value="19">{t("app.mainContent.rankFilter.ranks.masters2")}</option>
              <option value="20">{t("app.mainContent.rankFilter.ranks.masters3")}</option>
              <option value="21">{t("app.mainContent.rankFilter.ranks.pro")}</option>
            </select>
          </div>
        </div>

        <div className="controls-row">
          <div className="control-group">
            <label htmlFor="dateFilterSelect" className="control-label">
              {t("app.mainContent.dateFilter.label")}
              <InfoTooltip text={t("app.mainContent.dateFilter.tooltip")} />
            </label>
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

          {shouldShowPlayerTag() && (
            <div className="control-group">
              <label htmlFor="playerTagInput" className="control-label">
                {t("app.mainContent.playerTag.label")}
                <InfoTooltip text={t("app.mainContent.playerTag.tooltip")} />
              </label>
              <input
                id="playerTagInput"
                type="text"
                className="control-input"
                style={{ width: '150px' }}
                onChange={handlePlayerTagChange}
                value={playerTag}
                placeholder={t("app.mainContent.playerTag.placeholder")}
              />
            </div>
          )}
        </div>

        {shouldShowPlayerTag() && playerTag && playerTotalWinRate !== null && (
          <div className="player-total-winrate" style={{ margin: '10px 0', color: 'white', textAlign: 'center', fontSize: '1.1em' }}>
            {playerTotalMatches > 0
              ? t("app.mainContent.playerTotalWinRate", { winRate: (playerTotalWinRate * 100).toFixed(1), matches: playerTotalMatches })
              : t("app.mainContent.playerTotalWinRate", { winRate: (playerTotalWinRate * 100).toFixed(1), matches: playerTotalMatches }).split(" (")[0]
            }
          </div>
        )}


        {statusMessage && (
          <p className={`status-message ${error ? "error" : ""}`}>
            {statusMessage}
          </p>
        )}

        <LeaderboardModal
          isOpen={isLeaderboardModalOpen}
          onClose={closeLeaderboardModal}
          data={leaderboardData}
          isLoading={isLeaderboardLoading}
          error={leaderboardError}
          initialRank={rank}
          rankOptions={leaderboardRankOptions}
          onFetchLeaderboard={fetchLeaderboardData}
        />

        <>
          {showType === "Team" && (
            <>
              <h3 className="section-title">{t("app.mainContent.teamStatisticsTitle")}</h3>
              {filteredTeamStats.length > 0 ? (
                renderTable(filteredTeamStats, "Teams")
              ) : (
                !isLoading && !error && <p className="no-data-message">{t("app.mainContent.noTeamStatistics")}</p>
              )}
            </>
          )}

          {showType === "Brawler" && (
            <>
              <h3 className="section-title">
                {(() => {
                  let mainTitleText = t("app.mainContent.individualBrawlerStatisticsTitle");

                  let clausesText = "";

                  const filteredRedBrawlers = redBrawlers.filter(b => b !== "").map(b => capitalizeBrawlerName(b));
                  let againstTextPart = "";
                  if (filteredRedBrawlers.length > 0) {
                    let brawlerListString = "";
                    if (filteredRedBrawlers.length === 1) {
                      brawlerListString = filteredRedBrawlers[0];
                    } else if (filteredRedBrawlers.length === 2) {
                      if (i18n.language === "tr") {
                        brawlerListString = `${filteredRedBrawlers[0]} ve ${filteredRedBrawlers[1]}`;
                      } else {
                        brawlerListString = `${filteredRedBrawlers[0]} and ${filteredRedBrawlers[1]}`;
                      }
                    } else if (filteredRedBrawlers.length > 2) {
                      const lastRed = filteredRedBrawlers.pop();
                      const andKeyword = i18n.language === "tr" ? "ve" : "and";
                      brawlerListString = `${filteredRedBrawlers.join(", ")} ${andKeyword} ${lastRed}`;
                    }
                    if (brawlerListString) {
                      againstTextPart = t("app.mainContent.againstClause", { brawlers: brawlerListString });
                    }
                  }

                  let withTextPart = "";
                  const filteredBlueBrawlers = blueBrawlers.filter(b => b !== "").map(b => capitalizeBrawlerName(b));
                  if (bluesIncluded) {
                    if (filteredBlueBrawlers.length > 0) {
                      let brawlerListString = "";
                      if (filteredBlueBrawlers.length === 1) {
                        brawlerListString = filteredBlueBrawlers[0];
                      } else if (filteredBlueBrawlers.length === 2) {
                        if (i18n.language === "tr") {
                          brawlerListString = `${filteredBlueBrawlers[0]} ve ${filteredBlueBrawlers[1]}`;
                        } else {
                          brawlerListString = `${filteredBlueBrawlers[0]} and ${filteredBlueBrawlers[1]}`;
                        }
                      }
                      if (brawlerListString) {
                        withTextPart = t("app.mainContent.withClause", { brawlers: brawlerListString });
                      }
                    }
                  }

                  if (i18n.language === "tr") {
                    clausesText = `${withTextPart}${withTextPart && againstTextPart ? " " : ""}${againstTextPart}`;
                  } else {
                    clausesText = `${againstTextPart}${againstTextPart && withTextPart ? " " : ""}${withTextPart}`;
                  }
                  clausesText = clausesText.trim();

                  if (i18n.language === "tr") {
                    if (filteredBlueBrawlers.length > 0 || filteredRedBrawlers.length > 0) {
                      mainTitleText = " varken " + mainTitleText;
                    }
                    if (!(filteredBlueBrawlers.length <= filteredRedBrawlers.length)) {
                      mainTitleText = mainTitleText.replace(" varken ", "");
                    }
                    return (
                      <>
                        {clausesText}
                        {clausesText ? " " : ""}
                        {mainTitleText}
                      </>
                    );
                  } else {
                    return (
                      <>
                        {mainTitleText}
                        {clausesText ? " " : ""}
                        {clausesText}
                      </>
                    );
                  }
                })()}
              </h3>
              {filteredBrawlerStats.length > 0 ? (
                renderTable(filteredBrawlerStats, "Brawlers")
              ) : (
                !isLoading && !error && (
                  <p className="no-data-message">
                    {(() => {
                      let battleFilterText = filterValue > 0 ? t("app.mainContent.battleFilterClause", { count: filterValue }) : "";
                      let banFilterText = "";
                      const numBans = bans.filter(b => b !== "").length;
                      if (numBans === 1) {
                        banFilterText = t("app.mainContent.banFilterClauseSingle");
                      } else if (numBans > 1) {
                        banFilterText = t("app.mainContent.banFilterClauseMultiple", { count: numBans });
                      }
                      return t("app.mainContent.noBrawlerStatistics", { battleFilter: battleFilterText, banFilter: banFilterText });
                    })()}
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