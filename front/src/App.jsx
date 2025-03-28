import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [blueBrawlers, setBlueBrawlers] = useState(["", "", ""]);
  const [redBrawlers, setRedBrawlers] = useState(["", "", ""]);
  const [map, setMap] = useState("");
  const [brawlerStats, setBrawlerStats] = useState([]);
  const [filteredStats, setFilteredStats] = useState([]);
  const [sortType, setSortType] = useState("Win Rate");
  const [teamStats, setTeamStats] = useState([]);
  const [filterValue, setFilterValue] = useState(25);
  const [showType, setShowType] = useState("Teams");
  const [isNoMap, setIsNoMap] = useState(false);
  const [isNoBrawler, setIsNoBrawler] = useState(false);


  useEffect(() => {
    if (map === "") return;


    async function fetchData() {
      try {

        const response = await axios.post('http://localhost:8080/api/data/brawler', {
          map: map,
          blueBrawlers: blueBrawlers,
          redBrawlers: redBrawlers
        });

        console.log('API Response:', response.data);

        const data = response.data;
        const teamStats = [];
        const individualStats = [];

        for (const item of data) {
          if (item.brawlerName.includes("VS")) {
            teamStats.push(item);
          } else {
            individualStats.push(item);
          }
        }

        const sortedStats = [...individualStats].sort((a, b) => {
          return b.matchCount - a.matchCount;
        });
        setBrawlerStats(sortedStats);
        setFilteredStats(sortedStats);
        setSortType("Win Rate");
        setTeamStats(teamStats);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [map, blueBrawlers, redBrawlers]);

  function handleBlueChange(event, index) {
    let newBlueBrawlers = [...blueBrawlers];
    newBlueBrawlers[index] = event.target.value;
    setBlueBrawlers(newBlueBrawlers);
    console.log(newBlueBrawlers);
  };

  function handleRedChange(event, index) {
    let newRedBrawlers = [...redBrawlers];
    newRedBrawlers[index] = event.target.value;
    setRedBrawlers(newRedBrawlers);
    console.log(newRedBrawlers);
  }

  function handleMapChange(event) {
    setMap(event.target.value);
    setBlueBrawlers(["", "", ""]);
    setRedBrawlers(["", "", ""]);
    console.log(event.target.value);
  }

  function handleSortClick() {
    const newSortType = sortType === "Pick Rate" ? "Win Rate" : "Pick Rate";
    setSortType(newSortType);
    const sortedStats = [...filteredStats].sort((a, b) => {
      if (newSortType === "Win Rate") {
        return b.matchCount - a.matchCount;
      } else {
        return b.winRate - a.winRate;
      }
    });
    setFilteredStats(sortedStats);
    const sortedTeams = [...teamStats].sort((a, b) => {
      if (newSortType === "Win Rate") {
        return b.matchCount - a.matchCount;
      } else {
        return b.winRate - a.winRate;
      }
    });
    setTeamStats(sortedTeams);
  }

  function handleShowClick() {
    const newShowType = showType === "Brawlers" ? "Teams" : "Brawlers";
    setShowType(newShowType);
  }

  function handleBrawlerClick() {
    const newBrawlerType = isNoBrawler ? false : true;
    setIsNoBrawler(newBrawlerType);
  }

  function handleMapClick() {
    const newMapType = isNoMap ? false : true;
    setIsNoMap(newMapType);
  }

  function handleFilter(event) {
    event.preventDefault();
    setFilterValue(event.target.value);
    const x = brawlerStats.filter((brawler) => {
      return brawler.matchCount >= event.target.value;
    });
    setFilteredStats(x);
  }

  return (
    <div style={{ backgroundColor: "gray", height: "100vh", width: "100vw", display: "flex", justifyContent: "flex-start", alignItems: "center" }}>
      <div style={{ display: "flex", flex: "1", height: "100vh", backgroundColor: "#444444", flexDirection: "column" }}>
        <div style={{ display: "flex", flex: "0.3", justifyContent: "center", alignItems: "center", width: "100%" }}>
          <label htmlFor="mapSelect">Map: </label>
          <select id="mapSelect" value={map} onChange={(e) => handleMapChange(e)} style={{ padding: "8px", borderRadius: "4px" }}>
            <option value="">Select a Map</option>

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
        <div style={{ display: "flex", flex: "1" }}>
          <div style={{ "flex": "1" }}>
            <label htmlFor="blueBrawler0">Blue Brawler 1: </label>
            <select id="blueBrawler0" value={blueBrawlers[0]} onChange={(e) => handleBlueChange(e, 0)} style={{ padding: "8px", borderRadius: "4px" }}>
              <option value="">Select a Brawler</option>
              <option value="8-BIT">8-Bit</option>
              <option value="AMBER">Amber</option>
              <option value="ANGELO">Angelo</option>
              <option value="ASH">Ash</option>
              <option value="BARLEY">Barley</option>
              <option value="BEA">Bea</option>
              <option value="BELLE">Belle</option>
              <option value="BERRY">Berry</option>
              <option value="BIBI">Bibi</option>
              <option value="BO">Bo</option>
              <option value="BONNIE">Bonnie</option>
              <option value="BROCK">Brock</option>
              <option value="BULL">Bull</option>
              <option value="BUSTER">Buster</option>
              <option value="BUZZ">Buzz</option>
              <option value="BYRON">Byron</option>
              <option value="CARL">Carl</option>
              <option value="CHARLIE">Charlie</option>
              <option value="CHESTER">Chester</option>
              <option value="CHUCK">Chuck</option>
              <option value="CLANCY">Clancy</option>
              <option value="COLETTE">Colette</option>
              <option value="COLT">Colt</option>
              <option value="CORDELIUS">Cordelius</option>
              <option value="CROW">Crow</option>
              <option value="DARRYL">Darryl</option>
              <option value="DOUG">Doug</option>
              <option value="DRACO">Draco</option>
              <option value="DYNAMIKE">Dynamike</option>
              <option value="EDGAR">Edgar</option>
              <option value="EL PRIMO">El Primo</option>
              <option value="EMZ">Emz</option>
              <option value="EVE">Eve</option>
              <option value="FANG">Fang</option>
              <option value="FINX">Finx</option>
              <option value="FRANK">Frank</option>
              <option value="GALE">Gale</option>
              <option value="GENE">Gene</option>
              <option value="GRAY">Gray</option>
              <option value="GRIFF">Griff</option>
              <option value="GROM">Grom</option>
              <option value="GUS">Gus</option>
              <option value="HANK">Hank</option>
              <option value="JACKY">Jacky</option>
              <option value="JANET">Janet</option>
              <option value="JESSIE">Jessie</option>
              <option value="JUJU">Juju</option>
              <option value="KENJI">Kenji</option>
              <option value="KIT">Kit</option>
              <option value="LARRY & LAWRIE">Larry & Lawrie</option>
              <option value="LEON">Leon</option>
              <option value="LILY">Lily</option>
              <option value="LOLA">Lola</option>
              <option value="LOU">Lou</option>
              <option value="MAISIE">Maisie</option>
              <option value="MANDY">Mandy</option>
              <option value="MAX">Max</option>
              <option value="MEG">Meg</option>
              <option value="MELODIE">Melodie</option>
              <option value="MEEPLE">Meeple</option>
              <option value="MICO">Mico</option>
              <option value="MOE">Moe</option>
              <option value="MORTIS">Mortis</option>
              <option value="MR. P">Mr. P</option>
              <option value="NANI">Nani</option>
              <option value="NITA">Nita</option>
              <option value="OLLIE">Ollie</option>
              <option value="OTIS">Otis</option>
              <option value="PAM">Pam</option>
              <option value="PENNY">Penny</option>
              <option value="PEARL">Pearl</option>
              <option value="PIPER">Piper</option>
              <option value="POCO">Poco</option>
              <option value="R-T">R-T</option>
              <option value="RICO">Rico</option>
              <option value="ROSA">Rosa</option>
              <option value="RUFFS">Ruffs</option>
              <option value="SAM">Sam</option>
              <option value="SANDY">Sandy</option>
              <option value="SHELLY">Shelly</option>
              <option value="SHADE">Shade</option>
              <option value="SPIKE">Spike</option>
              <option value="SPROUT">Sprout</option>
              <option value="SQUEAK">Squeak</option>
              <option value="STU">Stu</option>
              <option value="SURGE">Surge</option>
              <option value="TARA">Tara</option>
              <option value="TICK">Tick</option>
              <option value="WILLOW">Willow</option>
            </select>
          </div>
          <div style={{ "flex": "1" }}>
            <label htmlFor="blueBrawler1">Blue Brawler 2: </label>
            <select id="blueBrawler1" value={blueBrawlers[1]} onChange={(e) => handleBlueChange(e, 1)} style={{ padding: "8px", borderRadius: "4px" }}>
              <option value="">Select a Brawler</option>
              <option value="8-BIT">8-Bit</option>
              <option value="AMBER">Amber</option>
              <option value="ANGELO">Angelo</option>
              <option value="ASH">Ash</option>
              <option value="BARLEY">Barley</option>
              <option value="BEA">Bea</option>
              <option value="BELLE">Belle</option>
              <option value="BERRY">Berry</option>
              <option value="BIBI">Bibi</option>
              <option value="BO">Bo</option>
              <option value="BONNIE">Bonnie</option>
              <option value="BROCK">Brock</option>
              <option value="BULL">Bull</option>
              <option value="BUSTER">Buster</option>
              <option value="BUZZ">Buzz</option>
              <option value="BYRON">Byron</option>
              <option value="CARL">Carl</option>
              <option value="CHARLIE">Charlie</option>
              <option value="CHESTER">Chester</option>
              <option value="CHUCK">Chuck</option>
              <option value="CLANCY">Clancy</option>
              <option value="COLETTE">Colette</option>
              <option value="COLT">Colt</option>
              <option value="CORDELIUS">Cordelius</option>
              <option value="CROW">Crow</option>
              <option value="DARRYL">Darryl</option>
              <option value="DOUG">Doug</option>
              <option value="DRACO">Draco</option>
              <option value="DYNAMIKE">Dynamike</option>
              <option value="EDGAR">Edgar</option>
              <option value="EL PRIMO">El Primo</option>
              <option value="EMZ">Emz</option>
              <option value="EVE">Eve</option>
              <option value="FANG">Fang</option>
              <option value="FINX">Finx</option>
              <option value="FRANK">Frank</option>
              <option value="GALE">Gale</option>
              <option value="GENE">Gene</option>
              <option value="GRAY">Gray</option>
              <option value="GRIFF">Griff</option>
              <option value="GROM">Grom</option>
              <option value="GUS">Gus</option>
              <option value="HANK">Hank</option>
              <option value="JACKY">Jacky</option>
              <option value="JANET">Janet</option>
              <option value="JESSIE">Jessie</option>
              <option value="JUJU">Juju</option>
              <option value="KENJI">Kenji</option>
              <option value="KIT">Kit</option>
              <option value="LARRY & LAWRIE">Larry & Lawrie</option>
              <option value="LEON">Leon</option>
              <option value="LILY">Lily</option>
              <option value="LOLA">Lola</option>
              <option value="LOU">Lou</option>
              <option value="MAISIE">Maisie</option>
              <option value="MANDY">Mandy</option>
              <option value="MAX">Max</option>
              <option value="MEG">Meg</option>
              <option value="MELODIE">Melodie</option>
              <option value="MEEPLE">Meeple</option>
              <option value="MICO">Mico</option>
              <option value="MOE">Moe</option>
              <option value="MORTIS">Mortis</option>
              <option value="MR. P">Mr. P</option>
              <option value="NANI">Nani</option>
              <option value="NITA">Nita</option>
              <option value="OLLIE">Ollie</option>
              <option value="OTIS">Otis</option>
              <option value="PAM">Pam</option>
              <option value="PENNY">Penny</option>
              <option value="PEARL">Pearl</option>
              <option value="PIPER">Piper</option>
              <option value="POCO">Poco</option>
              <option value="R-T">R-T</option>
              <option value="RICO">Rico</option>
              <option value="ROSA">Rosa</option>
              <option value="RUFFS">Ruffs</option>
              <option value="SAM">Sam</option>
              <option value="SANDY">Sandy</option>
              <option value="SHELLY">Shelly</option>
              <option value="SHADE">Shade</option>
              <option value="SPIKE">Spike</option>
              <option value="SPROUT">Sprout</option>
              <option value="SQUEAK">Squeak</option>
              <option value="STU">Stu</option>
              <option value="SURGE">Surge</option>
              <option value="TARA">Tara</option>
              <option value="TICK">Tick</option>
              <option value="WILLOW">Willow</option>
            </select>
          </div>
          <div style={{ "flex": "1" }}>
            <label htmlFor="blueBrawler2">Blue Brawler 3: </label>
            <select id="blueBrawler2" value={blueBrawlers[2]} onChange={(e) => handleBlueChange(e, 2)} style={{ padding: "8px", borderRadius: "4px" }}>
              <option value="">Select a Brawler</option>
              <option value="8-BIT">8-Bit</option>
              <option value="AMBER">Amber</option>
              <option value="ANGELO">Angelo</option>
              <option value="ASH">Ash</option>
              <option value="BARLEY">Barley</option>
              <option value="BEA">Bea</option>
              <option value="BELLE">Belle</option>
              <option value="BERRY">Berry</option>
              <option value="BIBI">Bibi</option>
              <option value="BO">Bo</option>
              <option value="BONNIE">Bonnie</option>
              <option value="BROCK">Brock</option>
              <option value="BULL">Bull</option>
              <option value="BUSTER">Buster</option>
              <option value="BUZZ">Buzz</option>
              <option value="BYRON">Byron</option>
              <option value="CARL">Carl</option>
              <option value="CHARLIE">Charlie</option>
              <option value="CHESTER">Chester</option>
              <option value="CHUCK">Chuck</option>
              <option value="CLANCY">Clancy</option>
              <option value="COLETTE">Colette</option>
              <option value="COLT">Colt</option>
              <option value="CORDELIUS">Cordelius</option>
              <option value="CROW">Crow</option>
              <option value="DARRYL">Darryl</option>
              <option value="DOUG">Doug</option>
              <option value="DRACO">Draco</option>
              <option value="DYNAMIKE">Dynamike</option>
              <option value="EDGAR">Edgar</option>
              <option value="EL PRIMO">El Primo</option>
              <option value="EMZ">Emz</option>
              <option value="EVE">Eve</option>
              <option value="FANG">Fang</option>
              <option value="FINX">Finx</option>
              <option value="FRANK">Frank</option>
              <option value="GALE">Gale</option>
              <option value="GENE">Gene</option>
              <option value="GRAY">Gray</option>
              <option value="GRIFF">Griff</option>
              <option value="GROM">Grom</option>
              <option value="GUS">Gus</option>
              <option value="HANK">Hank</option>
              <option value="JACKY">Jacky</option>
              <option value="JANET">Janet</option>
              <option value="JESSIE">Jessie</option>
              <option value="JUJU">Juju</option>
              <option value="KENJI">Kenji</option>
              <option value="KIT">Kit</option>
              <option value="LARRY & LAWRIE">Larry & Lawrie</option>
              <option value="LEON">Leon</option>
              <option value="LILY">Lily</option>
              <option value="LOLA">Lola</option>
              <option value="LOU">Lou</option>
              <option value="MAISIE">Maisie</option>
              <option value="MANDY">Mandy</option>
              <option value="MAX">Max</option>
              <option value="MEG">Meg</option>
              <option value="MELODIE">Melodie</option>
              <option value="MEEPLE">Meeple</option>
              <option value="MICO">Mico</option>
              <option value="MOE">Moe</option>
              <option value="MORTIS">Mortis</option>
              <option value="MR. P">Mr. P</option>
              <option value="NANI">Nani</option>
              <option value="NITA">Nita</option>
              <option value="OLLIE">Ollie</option>
              <option value="OTIS">Otis</option>
              <option value="PAM">Pam</option>
              <option value="PENNY">Penny</option>
              <option value="PEARL">Pearl</option>
              <option value="PIPER">Piper</option>
              <option value="POCO">Poco</option>
              <option value="R-T">R-T</option>
              <option value="RICO">Rico</option>
              <option value="ROSA">Rosa</option>
              <option value="RUFFS">Ruffs</option>
              <option value="SAM">Sam</option>
              <option value="SANDY">Sandy</option>
              <option value="SHELLY">Shelly</option>
              <option value="SHADE">Shade</option>
              <option value="SPIKE">Spike</option>
              <option value="SPROUT">Sprout</option>
              <option value="SQUEAK">Squeak</option>
              <option value="STU">Stu</option>
              <option value="SURGE">Surge</option>
              <option value="TARA">Tara</option>
              <option value="TICK">Tick</option>
              <option value="WILLOW">Willow</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flex: "1" }}>
          <div style={{ "flex": "1" }}>
            <label htmlFor="redBrawler0">Red Brawler 1: </label>
            <select id="redBrawler0" value={redBrawlers[0]} onChange={(e) => handleRedChange(e, 0)} style={{ padding: "8px", borderRadius: "4px" }}>
              <option value="">Select a Brawler</option>
              <option value="8-BIT">8-Bit</option>
              <option value="AMBER">Amber</option>
              <option value="ANGELO">Angelo</option>
              <option value="ASH">Ash</option>
              <option value="BARLEY">Barley</option>
              <option value="BEA">Bea</option>
              <option value="BELLE">Belle</option>
              <option value="BERRY">Berry</option>
              <option value="BIBI">Bibi</option>
              <option value="BO">Bo</option>
              <option value="BONNIE">Bonnie</option>
              <option value="BROCK">Brock</option>
              <option value="BULL">Bull</option>
              <option value="BUSTER">Buster</option>
              <option value="BUZZ">Buzz</option>
              <option value="BYRON">Byron</option>
              <option value="CARL">Carl</option>
              <option value="CHARLIE">Charlie</option>
              <option value="CHESTER">Chester</option>
              <option value="CHUCK">Chuck</option>
              <option value="CLANCY">Clancy</option>
              <option value="COLETTE">Colette</option>
              <option value="COLT">Colt</option>
              <option value="CORDELIUS">Cordelius</option>
              <option value="CROW">Crow</option>
              <option value="DARRYL">Darryl</option>
              <option value="DOUG">Doug</option>
              <option value="DRACO">Draco</option>
              <option value="DYNAMIKE">Dynamike</option>
              <option value="EDGAR">Edgar</option>
              <option value="EL PRIMO">El Primo</option>
              <option value="EMZ">Emz</option>
              <option value="EVE">Eve</option>
              <option value="FANG">Fang</option>
              <option value="FINX">Finx</option>
              <option value="FRANK">Frank</option>
              <option value="GALE">Gale</option>
              <option value="GENE">Gene</option>
              <option value="GRAY">Gray</option>
              <option value="GRIFF">Griff</option>
              <option value="GROM">Grom</option>
              <option value="GUS">Gus</option>
              <option value="HANK">Hank</option>
              <option value="JACKY">Jacky</option>
              <option value="JANET">Janet</option>
              <option value="JESSIE">Jessie</option>
              <option value="JUJU">Juju</option>
              <option value="KENJI">Kenji</option>
              <option value="KIT">Kit</option>
              <option value="LARRY & LAWRIE">Larry & Lawrie</option>
              <option value="LEON">Leon</option>
              <option value="LILY">Lily</option>
              <option value="LOLA">Lola</option>
              <option value="LOU">Lou</option>
              <option value="MAISIE">Maisie</option>
              <option value="MANDY">Mandy</option>
              <option value="MAX">Max</option>
              <option value="MEG">Meg</option>
              <option value="MELODIE">Melodie</option>
              <option value="MEEPLE">Meeple</option>
              <option value="MICO">Mico</option>
              <option value="MOE">Moe</option>
              <option value="MORTIS">Mortis</option>
              <option value="MR. P">Mr. P</option>
              <option value="NANI">Nani</option>
              <option value="NITA">Nita</option>
              <option value="OLLIE">Ollie</option>
              <option value="OTIS">Otis</option>
              <option value="PAM">Pam</option>
              <option value="PENNY">Penny</option>
              <option value="PEARL">Pearl</option>
              <option value="PIPER">Piper</option>
              <option value="POCO">Poco</option>
              <option value="R-T">R-T</option>
              <option value="RICO">Rico</option>
              <option value="ROSA">Rosa</option>
              <option value="RUFFS">Ruffs</option>
              <option value="SAM">Sam</option>
              <option value="SANDY">Sandy</option>
              <option value="SHELLY">Shelly</option>
              <option value="SHADE">Shade</option>
              <option value="SPIKE">Spike</option>
              <option value="SPROUT">Sprout</option>
              <option value="SQUEAK">Squeak</option>
              <option value="STU">Stu</option>
              <option value="SURGE">Surge</option>
              <option value="TARA">Tara</option>
              <option value="TICK">Tick</option>
              <option value="WILLOW">Willow</option>
            </select>
          </div>
          <div style={{ "flex": "1" }}>
            <label htmlFor="redBrawler1">Red Brawler 2: </label>
            <select id="redBrawler1" value={redBrawlers[1]} onChange={(e) => handleRedChange(e, 1)} style={{ padding: "8px", borderRadius: "4px" }}>
              <option value="">Select a Brawler</option>
              <option value="8-BIT">8-Bit</option>
              <option value="AMBER">Amber</option>
              <option value="ANGELO">Angelo</option>
              <option value="ASH">Ash</option>
              <option value="BARLEY">Barley</option>
              <option value="BEA">Bea</option>
              <option value="BELLE">Belle</option>
              <option value="BERRY">Berry</option>
              <option value="BIBI">Bibi</option>
              <option value="BO">Bo</option>
              <option value="BONNIE">Bonnie</option>
              <option value="BROCK">Brock</option>
              <option value="BULL">Bull</option>
              <option value="BUSTER">Buster</option>
              <option value="BUZZ">Buzz</option>
              <option value="BYRON">Byron</option>
              <option value="CARL">Carl</option>
              <option value="CHARLIE">Charlie</option>
              <option value="CHESTER">Chester</option>
              <option value="CHUCK">Chuck</option>
              <option value="CLANCY">Clancy</option>
              <option value="COLETTE">Colette</option>
              <option value="COLT">Colt</option>
              <option value="CORDELIUS">Cordelius</option>
              <option value="CROW">Crow</option>
              <option value="DARRYL">Darryl</option>
              <option value="DOUG">Doug</option>
              <option value="DRACO">Draco</option>
              <option value="DYNAMIKE">Dynamike</option>
              <option value="EDGAR">Edgar</option>
              <option value="EL PRIMO">El Primo</option>
              <option value="EMZ">Emz</option>
              <option value="EVE">Eve</option>
              <option value="FANG">Fang</option>
              <option value="FINX">Finx</option>
              <option value="FRANK">Frank</option>
              <option value="GALE">Gale</option>
              <option value="GENE">Gene</option>
              <option value="GRAY">Gray</option>
              <option value="GRIFF">Griff</option>
              <option value="GROM">Grom</option>
              <option value="GUS">Gus</option>
              <option value="HANK">Hank</option>
              <option value="JACKY">Jacky</option>
              <option value="JANET">Janet</option>
              <option value="JESSIE">Jessie</option>
              <option value="JUJU">Juju</option>
              <option value="KENJI">Kenji</option>
              <option value="KIT">Kit</option>
              <option value="LARRY & LAWRIE">Larry & Lawrie</option>
              <option value="LEON">Leon</option>
              <option value="LILY">Lily</option>
              <option value="LOLA">Lola</option>
              <option value="LOU">Lou</option>
              <option value="MAISIE">Maisie</option>
              <option value="MANDY">Mandy</option>
              <option value="MAX">Max</option>
              <option value="MEG">Meg</option>
              <option value="MELODIE">Melodie</option>
              <option value="MEEPLE">Meeple</option>
              <option value="MICO">Mico</option>
              <option value="MOE">Moe</option>
              <option value="MORTIS">Mortis</option>
              <option value="MR. P">Mr. P</option>
              <option value="NANI">Nani</option>
              <option value="NITA">Nita</option>
              <option value="OLLIE">Ollie</option>
              <option value="OTIS">Otis</option>
              <option value="PAM">Pam</option>
              <option value="PENNY">Penny</option>
              <option value="PEARL">Pearl</option>
              <option value="PIPER">Piper</option>
              <option value="POCO">Poco</option>
              <option value="R-T">R-T</option>
              <option value="RICO">Rico</option>
              <option value="ROSA">Rosa</option>
              <option value="RUFFS">Ruffs</option>
              <option value="SAM">Sam</option>
              <option value="SANDY">Sandy</option>
              <option value="SHELLY">Shelly</option>
              <option value="SHADE">Shade</option>
              <option value="SPIKE">Spike</option>
              <option value="SPROUT">Sprout</option>
              <option value="SQUEAK">Squeak</option>
              <option value="STU">Stu</option>
              <option value="SURGE">Surge</option>
              <option value="TARA">Tara</option>
              <option value="TICK">Tick</option>
              <option value="WILLOW">Willow</option>
            </select>
          </div>
          <div style={{ "flex": "1" }}>
            <label htmlFor="redBrawler2">Red Brawler 3: </label>
            <select id="redBrawler2" value={redBrawlers[2]} onChange={(e) => handleRedChange(e, 2)} style={{ padding: "8px", borderRadius: "4px" }}>
              <option value="">Select a Brawler</option>
              <option value="8-BIT">8-Bit</option>
              <option value="AMBER">Amber</option>
              <option value="ANGELO">Angelo</option>
              <option value="ASH">Ash</option>
              <option value="BARLEY">Barley</option>
              <option value="BEA">Bea</option>
              <option value="BELLE">Belle</option>
              <option value="BERRY">Berry</option>
              <option value="BIBI">Bibi</option>
              <option value="BO">Bo</option>
              <option value="BONNIE">Bonnie</option>
              <option value="BROCK">Brock</option>
              <option value="BULL">Bull</option>
              <option value="BUSTER">Buster</option>
              <option value="BUZZ">Buzz</option>
              <option value="BYRON">Byron</option>
              <option value="CARL">Carl</option>
              <option value="CHARLIE">Charlie</option>
              <option value="CHESTER">Chester</option>
              <option value="CHUCK">Chuck</option>
              <option value="CLANCY">Clancy</option>
              <option value="COLETTE">Colette</option>
              <option value="COLT">Colt</option>
              <option value="CORDELIUS">Cordelius</option>
              <option value="CROW">Crow</option>
              <option value="DARRYL">Darryl</option>
              <option value="DOUG">Doug</option>
              <option value="DRACO">Draco</option>
              <option value="DYNAMIKE">Dynamike</option>
              <option value="EDGAR">Edgar</option>
              <option value="EL PRIMO">El Primo</option>
              <option value="EMZ">Emz</option>
              <option value="EVE">Eve</option>
              <option value="FANG">Fang</option>
              <option value="FINX">Finx</option>
              <option value="FRANK">Frank</option>
              <option value="GALE">Gale</option>
              <option value="GENE">Gene</option>
              <option value="GRAY">Gray</option>
              <option value="GRIFF">Griff</option>
              <option value="GROM">Grom</option>
              <option value="GUS">Gus</option>
              <option value="HANK">Hank</option>
              <option value="JACKY">Jacky</option>
              <option value="JANET">Janet</option>
              <option value="JESSIE">Jessie</option>
              <option value="JUJU">Juju</option>
              <option value="KENJI">Kenji</option>
              <option value="KIT">Kit</option>
              <option value="LARRY & LAWRIE">Larry & Lawrie</option>
              <option value="LEON">Leon</option>
              <option value="LILY">Lily</option>
              <option value="LOLA">Lola</option>
              <option value="LOU">Lou</option>
              <option value="MAISIE">Maisie</option>
              <option value="MANDY">Mandy</option>
              <option value="MAX">Max</option>
              <option value="MEG">Meg</option>
              <option value="MELODIE">Melodie</option>
              <option value="MEEPLE">Meeple</option>
              <option value="MICO">Mico</option>
              <option value="MOE">Moe</option>
              <option value="MORTIS">Mortis</option>
              <option value="MR. P">Mr. P</option>
              <option value="NANI">Nani</option>
              <option value="NITA">Nita</option>
              <option value="OLLIE">Ollie</option>
              <option value="OTIS">Otis</option>
              <option value="PAM">Pam</option>
              <option value="PENNY">Penny</option>
              <option value="PEARL">Pearl</option>
              <option value="PIPER">Piper</option>
              <option value="POCO">Poco</option>
              <option value="R-T">R-T</option>
              <option value="RICO">Rico</option>
              <option value="ROSA">Rosa</option>
              <option value="RUFFS">Ruffs</option>
              <option value="SAM">Sam</option>
              <option value="SANDY">Sandy</option>
              <option value="SHELLY">Shelly</option>
              <option value="SHADE">Shade</option>
              <option value="SPIKE">Spike</option>
              <option value="SPROUT">Sprout</option>
              <option value="SQUEAK">Squeak</option>
              <option value="STU">Stu</option>
              <option value="SURGE">Surge</option>
              <option value="TARA">Tara</option>
              <option value="TICK">Tick</option>
              <option value="WILLOW">Willow</option>
            </select>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "#222222", height: "100%", width: "100%", flex: "1", padding: "20px", overflow: "auto" }}>
        <div style={{ display: "flex", gap: "30px" }}>
          <h3 style={{ marginBottom: "20px" }}>Brawler Statistics</h3>
          <button onClick={handleSortClick} style={{ paddingLeft: "40px", paddingRight: "40px", height: "40px", marginTop: "15px", backgroundColor: "#666666" }}>{"Sort By " + sortType}</button>
          <button onClick={handleShowClick} style={{ marginLeft: "10px", paddingLeft: "40px", paddingRight: "40px", height: "40px", marginTop: "15px", backgroundColor: "#666666" }}>{"See " + showType}</button>
        </div>
        <div style={{ display: "flex", gap: "30px" }}>
          <form onSubmit={(e) => { e.preventDefault() }} style={{ display: "flex" }}>
            <div style={{ display: "flex", border: "1px solid black", borderRadius: "10px", boxSizing: "border-box" }}>
              <input type="number" style={{ width: "10vw", height: "40px", borderRadius: "8px", boxSizing: "border-box", border: "1px solid white" }} onChange={(e) => handleFilter(e)} value={filterValue} placeholder="Filter by match count" />
            </div>
          </form>
          <button onClick={handleBrawlerClick} style={{ width: "240px", height: "60px", backgroundColor: "#666666" }}>{isNoBrawler ? "Show winrates against selected red brawlers" : "Show map winrates"}</button>
          <button onClick={handleMapClick} style={{ paddingLeft: "10px", paddingRight: "10px", height: "60px", backgroundColor: "#666666" }}>{isNoMap ? "Show map specific" : "Make map agnostic"}</button>
        </div>
        {Array.isArray(teamStats) ? (
          teamStats.length > 0 && showType == "Brawlers" ? (
            <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: "50px" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px", borderBottom: "2px solid #ddd" }}>Team</th>
                  <th style={{ textAlign: "right", padding: "8px", borderBottom: "2px solid #ddd" }}>Win Rate</th>
                  <th style={{ textAlign: "right", padding: "8px", borderBottom: "2px solid #ddd" }}>Matches</th>
                </tr>
              </thead>
              <tbody>
                {teamStats.map((team, index) => {
                  const rowBackgroundColor = index % 2 === 0 ? "#444444" : "#666666";
                  return (
                    <tr key={`${team.brawlerName}-${team.matchCount}`} style={{ backgroundColor: rowBackgroundColor }}>
                      <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{team.brawlerName}</td>
                      <td style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #ddd" }}>
                        {(team.winRate * 100).toFixed(1)}%
                      </td>
                      <td style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #ddd" }}>
                        {team.matchCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p></p>
          )
        ) : (
          <p>Select a map to view brawler statistics.</p>
        )}

        {Array.isArray(filteredStats) ? (
          filteredStats.length > 0 && showType == "Teams" ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px", borderBottom: "2px solid #ddd" }}>Brawler</th>
                  <th style={{ textAlign: "right", padding: "8px", borderBottom: "2px solid #ddd" }}>Win Rate</th>
                  <th style={{ textAlign: "right", padding: "8px", borderBottom: "2px solid #ddd" }}>Matches</th>
                </tr>
              </thead>
              <tbody>
                {filteredStats.map((brawler, index) => {
                  const rowBackgroundColor = index % 2 === 0 ? "#444444" : "#666666";
                  return (
                    <tr key={`${brawler.brawlerName}-${brawler.matchCount}`} style={{ backgroundColor: rowBackgroundColor }}>
                      <td style={{ padding: "8px", borderBottom: "1px solid #ddd" }}>{brawler.brawlerName}</td>
                      <td style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #ddd" }}>
                        {(brawler.winRate * 100).toFixed(1)}%
                      </td>
                      <td style={{ textAlign: "right", padding: "8px", borderBottom: "1px solid #ddd" }}>
                        {brawler.matchCount}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            showType === "Brawlers" ? <p></p> : <p>No brawler statistics available for this map.</p>
          )
        ) : (
          <p>Select a map to view brawler statistics.</p>
        )}
      </div>
    </div>
  )
}

export default App