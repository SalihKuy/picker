import { useEffect, useState } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [blueBrawlers, setBlueBrawlers] = useState(["", "", ""]);
  const [redBrawlers, setRedBrawlers] = useState(["", "", ""]);
  const [map, setMap] = useState("");
  const [brawlerStats, setBrawlerStats] = useState([]);
  const [sortType, setSortType] = useState("Pick Rate");

  useEffect(() => {
    if (map === "") return;

    const fetchData = async () => {
      try {

        const response = await axios.post('http://localhost:8080/api/data/brawler', {
          map: map,
          blueBrawlers: blueBrawlers,
          redBrawlers: redBrawlers
        });

        console.log('API Response:', response.data);
        setBrawlerStats(response.data);
      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [map]);

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
    console.log(event.target.value);
  }

  function handleClick() {
    const newSortType = sortType === "Pick Rate" ? "Win Rate" : "Pick Rate";
    setSortType(newSortType);
    const sortedStats = [...brawlerStats].sort((a, b) => {
      if (newSortType === "Win Rate") {
        return b.matchCount - a.matchCount;
      } else {
        return b.winRate - a.winRate;
      }
    });
    setBrawlerStats(sortedStats);
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
              <option value="8-bit">8-Bit</option>
              <option value="amber">Amber</option>
              <option value="angelo">Angelo</option>
              <option value="ash">Ash</option>
              <option value="barley">Barley</option>
              <option value="bea">Bea</option>
              <option value="belle">Belle</option>
              <option value="berry">Berry</option>
              <option value="bibi">Bibi</option>
              <option value="bo">Bo</option>
              <option value="bonnie">Bonnie</option>
              <option value="brock">Brock</option>
              <option value="bull">Bull</option>
              <option value="buster">Buster</option>
              <option value="buzz">Buzz</option>
              <option value="byron">Byron</option>
              <option value="carl">Carl</option>
              <option value="charlie">Charlie</option>
              <option value="chester">Chester</option>
              <option value="chuck">Chuck</option>
              <option value="clancy">Clancy</option>
              <option value="colette">Colette</option>
              <option value="colt">Colt</option>
              <option value="cordelius">Cordelius</option>
              <option value="crow">Crow</option>
              <option value="darryl">Darryl</option>
              <option value="doug">Doug</option>
              <option value="draco">Draco</option>
              <option value="dynamike">Dynamike</option>
              <option value="edgar">Edgar</option>
              <option value="el-primo">El Primo</option>
              <option value="emz">Emz</option>
              <option value="eve">Eve</option>
              <option value="fang">Fang</option>
              <option value="frank">Frank</option>
              <option value="gale">Gale</option>
              <option value="gene">Gene</option>
              <option value="gray">Gray</option>
              <option value="griff">Griff</option>
              <option value="grom">Grom</option>
              <option value="gus">Gus</option>
              <option value="hank">Hank</option>
              <option value="jacky">Jacky</option>
              <option value="janet">Janet</option>
              <option value="jessie">Jessie</option>
              <option value="juju">Juju</option>
              <option value="kenji">Kenji</option>
              <option value="kit">Kit</option>
              <option value="larry-lawrie">Larry & Lawrie</option>
              <option value="leon">Leon</option>
              <option value="lily">Lily</option>
              <option value="lola">Lola</option>
              <option value="lou">Lou</option>
              <option value="mandy">Mandy</option>
              <option value="max">Max</option>
              <option value="meg">Meg</option>
              <option value="melodie">Melodie</option>
              <option value="meeple">Meeple</option>
              <option value="mico">Mico</option>
              <option value="moe">Moe</option>
              <option value="mortis">Mortis</option>
              <option value="mr-p">Mr. P</option>
              <option value="nani">Nani</option>
              <option value="nita">Nita</option>
              <option value="ollie">Ollie</option>
              <option value="otis">Otis</option>
              <option value="pam">Pam</option>
              <option value="penny">Penny</option>
              <option value="pearl">Pearl</option>
              <option value="piper">Piper</option>
              <option value="poco">Poco</option>
              <option value="r-t">R-T</option>
              <option value="rico">Rico</option>
              <option value="rosa">Rosa</option>
              <option value="ruffs">Ruffs</option>
              <option value="sam">Sam</option>
              <option value="sandy">Sandy</option>
              <option value="shelly">Shelly</option>
              <option value="shade">Shade</option>
              <option value="spike">Spike</option>
              <option value="sprout">Sprout</option>
              <option value="squeak">Squeak</option>
              <option value="stu">Stu</option>
              <option value="surge">Surge</option>
              <option value="tara">Tara</option>
              <option value="tick">Tick</option>
              <option value="willow">Willow</option>
            </select>
          </div>
          <div style={{ "flex": "1" }}>
            <label htmlFor="blueBrawler1">Blue Brawler 2: </label>
            <select id="blueBrawler1" value={blueBrawlers[1]} onChange={(e) => handleBlueChange(e, 1)} style={{ padding: "8px", borderRadius: "4px" }}>
              <option value="">Select a Brawler</option>
              <option value="8-bit">8-Bit</option>
              <option value="amber">Amber</option>
              <option value="angelo">Angelo</option>
              <option value="ash">Ash</option>
              <option value="barley">Barley</option>
              <option value="bea">Bea</option>
              <option value="belle">Belle</option>
              <option value="berry">Berry</option>
              <option value="bibi">Bibi</option>
              <option value="bo">Bo</option>
              <option value="bonnie">Bonnie</option>
              <option value="brock">Brock</option>
              <option value="bull">Bull</option>
              <option value="buster">Buster</option>
              <option value="buzz">Buzz</option>
              <option value="byron">Byron</option>
              <option value="carl">Carl</option>
              <option value="charlie">Charlie</option>
              <option value="chester">Chester</option>
              <option value="chuck">Chuck</option>
              <option value="clancy">Clancy</option>
              <option value="colette">Colette</option>
              <option value="colt">Colt</option>
              <option value="cordelius">Cordelius</option>
              <option value="crow">Crow</option>
              <option value="darryl">Darryl</option>
              <option value="doug">Doug</option>
              <option value="draco">Draco</option>
              <option value="dynamike">Dynamike</option>
              <option value="edgar">Edgar</option>
              <option value="el-primo">El Primo</option>
              <option value="emz">Emz</option>
              <option value="eve">Eve</option>
              <option value="fang">Fang</option>
              <option value="frank">Frank</option>
              <option value="gale">Gale</option>
              <option value="gene">Gene</option>
              <option value="gray">Gray</option>
              <option value="griff">Griff</option>
              <option value="grom">Grom</option>
              <option value="gus">Gus</option>
              <option value="hank">Hank</option>
              <option value="jacky">Jacky</option>
              <option value="janet">Janet</option>
              <option value="jessie">Jessie</option>
              <option value="juju">Juju</option>
              <option value="kenji">Kenji</option>
              <option value="kit">Kit</option>
              <option value="larry-lawrie">Larry & Lawrie</option>
              <option value="leon">Leon</option>
              <option value="lily">Lily</option>
              <option value="lola">Lola</option>
              <option value="lou">Lou</option>
              <option value="mandy">Mandy</option>
              <option value="max">Max</option>
              <option value="meg">Meg</option>
              <option value="melodie">Melodie</option>
              <option value="meeple">Meeple</option>
              <option value="mico">Mico</option>
              <option value="moe">Moe</option>
              <option value="mortis">Mortis</option>
              <option value="mr-p">Mr. P</option>
              <option value="nani">Nani</option>
              <option value="nita">Nita</option>
              <option value="ollie">Ollie</option>
              <option value="otis">Otis</option>
              <option value="pam">Pam</option>
              <option value="penny">Penny</option>
              <option value="pearl">Pearl</option>
              <option value="piper">Piper</option>
              <option value="poco">Poco</option>
              <option value="r-t">R-T</option>
              <option value="rico">Rico</option>
              <option value="rosa">Rosa</option>
              <option value="ruffs">Ruffs</option>
              <option value="sam">Sam</option>
              <option value="sandy">Sandy</option>
              <option value="shelly">Shelly</option>
              <option value="shade">Shade</option>
              <option value="spike">Spike</option>
              <option value="sprout">Sprout</option>
              <option value="squeak">Squeak</option>
              <option value="stu">Stu</option>
              <option value="surge">Surge</option>
              <option value="tara">Tara</option>
              <option value="tick">Tick</option>
              <option value="willow">Willow</option>
            </select>
          </div>
          <div style={{ "flex": "1" }}>
            <label htmlFor="blueBrawler2">Blue Brawler 3: </label>
            <select id="blueBrawler2" value={blueBrawlers[2]} onChange={(e) => handleBlueChange(e, 2)} style={{ padding: "8px", borderRadius: "4px" }}>
              <option value="">Select a Brawler</option>
              <option value="8-bit">8-Bit</option>
              <option value="amber">Amber</option>
              <option value="angelo">Angelo</option>
              <option value="ash">Ash</option>
              <option value="barley">Barley</option>
              <option value="bea">Bea</option>
              <option value="belle">Belle</option>
              <option value="berry">Berry</option>
              <option value="bibi">Bibi</option>
              <option value="bo">Bo</option>
              <option value="bonnie">Bonnie</option>
              <option value="brock">Brock</option>
              <option value="bull">Bull</option>
              <option value="buster">Buster</option>
              <option value="buzz">Buzz</option>
              <option value="byron">Byron</option>
              <option value="carl">Carl</option>
              <option value="charlie">Charlie</option>
              <option value="chester">Chester</option>
              <option value="chuck">Chuck</option>
              <option value="clancy">Clancy</option>
              <option value="colette">Colette</option>
              <option value="colt">Colt</option>
              <option value="cordelius">Cordelius</option>
              <option value="crow">Crow</option>
              <option value="darryl">Darryl</option>
              <option value="doug">Doug</option>
              <option value="draco">Draco</option>
              <option value="dynamike">Dynamike</option>
              <option value="edgar">Edgar</option>
              <option value="el-primo">El Primo</option>
              <option value="emz">Emz</option>
              <option value="eve">Eve</option>
              <option value="fang">Fang</option>
              <option value="frank">Frank</option>
              <option value="gale">Gale</option>
              <option value="gene">Gene</option>
              <option value="gray">Gray</option>
              <option value="griff">Griff</option>
              <option value="grom">Grom</option>
              <option value="gus">Gus</option>
              <option value="hank">Hank</option>
              <option value="jacky">Jacky</option>
              <option value="janet">Janet</option>
              <option value="jessie">Jessie</option>
              <option value="juju">Juju</option>
              <option value="kenji">Kenji</option>
              <option value="kit">Kit</option>
              <option value="larry-lawrie">Larry & Lawrie</option>
              <option value="leon">Leon</option>
              <option value="lily">Lily</option>
              <option value="lola">Lola</option>
              <option value="lou">Lou</option>
              <option value="mandy">Mandy</option>
              <option value="max">Max</option>
              <option value="meg">Meg</option>
              <option value="melodie">Melodie</option>
              <option value="meeple">Meeple</option>
              <option value="mico">Mico</option>
              <option value="moe">Moe</option>
              <option value="mortis">Mortis</option>
              <option value="mr-p">Mr. P</option>
              <option value="nani">Nani</option>
              <option value="nita">Nita</option>
              <option value="ollie">Ollie</option>
              <option value="otis">Otis</option>
              <option value="pam">Pam</option>
              <option value="penny">Penny</option>
              <option value="pearl">Pearl</option>
              <option value="piper">Piper</option>
              <option value="poco">Poco</option>
              <option value="r-t">R-T</option>
              <option value="rico">Rico</option>
              <option value="rosa">Rosa</option>
              <option value="ruffs">Ruffs</option>
              <option value="sam">Sam</option>
              <option value="sandy">Sandy</option>
              <option value="shelly">Shelly</option>
              <option value="shade">Shade</option>
              <option value="spike">Spike</option>
              <option value="sprout">Sprout</option>
              <option value="squeak">Squeak</option>
              <option value="stu">Stu</option>
              <option value="surge">Surge</option>
              <option value="tara">Tara</option>
              <option value="tick">Tick</option>
              <option value="willow">Willow</option>
            </select>
          </div>
        </div>
        <div style={{ display: "flex", flex: "1" }}>
          <div style={{ "flex": "1" }}>
            <label htmlFor="redBrawler0">Red Brawler 1: </label>
            <select id="redBrawler0" value={redBrawlers[0]} onChange={(e) => handleRedChange(e, 0)} style={{ padding: "8px", borderRadius: "4px" }}>
              <option value="">Select a Brawler</option>
              <option value="8-bit">8-Bit</option>
              <option value="amber">Amber</option>
              <option value="angelo">Angelo</option>
              <option value="ash">Ash</option>
              <option value="barley">Barley</option>
              <option value="bea">Bea</option>
              <option value="belle">Belle</option>
              <option value="berry">Berry</option>
              <option value="bibi">Bibi</option>
              <option value="bo">Bo</option>
              <option value="bonnie">Bonnie</option>
              <option value="brock">Brock</option>
              <option value="bull">Bull</option>
              <option value="buster">Buster</option>
              <option value="buzz">Buzz</option>
              <option value="byron">Byron</option>
              <option value="carl">Carl</option>
              <option value="charlie">Charlie</option>
              <option value="chester">Chester</option>
              <option value="chuck">Chuck</option>
              <option value="clancy">Clancy</option>
              <option value="colette">Colette</option>
              <option value="colt">Colt</option>
              <option value="cordelius">Cordelius</option>
              <option value="crow">Crow</option>
              <option value="darryl">Darryl</option>
              <option value="doug">Doug</option>
              <option value="draco">Draco</option>
              <option value="dynamike">Dynamike</option>
              <option value="edgar">Edgar</option>
              <option value="el-primo">El Primo</option>
              <option value="emz">Emz</option>
              <option value="eve">Eve</option>
              <option value="fang">Fang</option>
              <option value="frank">Frank</option>
              <option value="gale">Gale</option>
              <option value="gene">Gene</option>
              <option value="gray">Gray</option>
              <option value="griff">Griff</option>
              <option value="grom">Grom</option>
              <option value="gus">Gus</option>
              <option value="hank">Hank</option>
              <option value="jacky">Jacky</option>
              <option value="janet">Janet</option>
              <option value="jessie">Jessie</option>
              <option value="juju">Juju</option>
              <option value="kenji">Kenji</option>
              <option value="kit">Kit</option>
              <option value="larry-lawrie">Larry & Lawrie</option>
              <option value="leon">Leon</option>
              <option value="lily">Lily</option>
              <option value="lola">Lola</option>
              <option value="lou">Lou</option>
              <option value="mandy">Mandy</option>
              <option value="max">Max</option>
              <option value="meg">Meg</option>
              <option value="melodie">Melodie</option>
              <option value="meeple">Meeple</option>
              <option value="mico">Mico</option>
              <option value="moe">Moe</option>
              <option value="mortis">Mortis</option>
              <option value="mr-p">Mr. P</option>
              <option value="nani">Nani</option>
              <option value="nita">Nita</option>
              <option value="ollie">Ollie</option>
              <option value="otis">Otis</option>
              <option value="pam">Pam</option>
              <option value="penny">Penny</option>
              <option value="pearl">Pearl</option>
              <option value="piper">Piper</option>
              <option value="poco">Poco</option>
              <option value="r-t">R-T</option>
              <option value="rico">Rico</option>
              <option value="rosa">Rosa</option>
              <option value="ruffs">Ruffs</option>
              <option value="sam">Sam</option>
              <option value="sandy">Sandy</option>
              <option value="shelly">Shelly</option>
              <option value="shade">Shade</option>
              <option value="spike">Spike</option>
              <option value="sprout">Sprout</option>
              <option value="squeak">Squeak</option>
              <option value="stu">Stu</option>
              <option value="surge">Surge</option>
              <option value="tara">Tara</option>
              <option value="tick">Tick</option>
              <option value="willow">Willow</option>
            </select>
          </div>
          <div style={{ "flex": "1" }}>
            <label htmlFor="redBrawler1">Red Brawler 2: </label>
            <select id="redBrawler1" value={redBrawlers[1]} onChange={(e) => handleRedChange(e, 1)} style={{ padding: "8px", borderRadius: "4px" }}>
              <option value="">Select a Brawler</option>
              <option value="8-bit">8-Bit</option>
              <option value="amber">Amber</option>
              <option value="angelo">Angelo</option>
              <option value="ash">Ash</option>
              <option value="barley">Barley</option>
              <option value="bea">Bea</option>
              <option value="belle">Belle</option>
              <option value="berry">Berry</option>
              <option value="bibi">Bibi</option>
              <option value="bo">Bo</option>
              <option value="bonnie">Bonnie</option>
              <option value="brock">Brock</option>
              <option value="bull">Bull</option>
              <option value="buster">Buster</option>
              <option value="buzz">Buzz</option>
              <option value="byron">Byron</option>
              <option value="carl">Carl</option>
              <option value="charlie">Charlie</option>
              <option value="chester">Chester</option>
              <option value="chuck">Chuck</option>
              <option value="clancy">Clancy</option>
              <option value="colette">Colette</option>
              <option value="colt">Colt</option>
              <option value="cordelius">Cordelius</option>
              <option value="crow">Crow</option>
              <option value="darryl">Darryl</option>
              <option value="doug">Doug</option>
              <option value="draco">Draco</option>
              <option value="dynamike">Dynamike</option>
              <option value="edgar">Edgar</option>
              <option value="el-primo">El Primo</option>
              <option value="emz">Emz</option>
              <option value="eve">Eve</option>
              <option value="fang">Fang</option>
              <option value="frank">Frank</option>
              <option value="gale">Gale</option>
              <option value="gene">Gene</option>
              <option value="gray">Gray</option>
              <option value="griff">Griff</option>
              <option value="grom">Grom</option>
              <option value="gus">Gus</option>
              <option value="hank">Hank</option>
              <option value="jacky">Jacky</option>
              <option value="janet">Janet</option>
              <option value="jessie">Jessie</option>
              <option value="juju">Juju</option>
              <option value="kenji">Kenji</option>
              <option value="kit">Kit</option>
              <option value="larry-lawrie">Larry & Lawrie</option>
              <option value="leon">Leon</option>
              <option value="lily">Lily</option>
              <option value="lola">Lola</option>
              <option value="lou">Lou</option>
              <option value="mandy">Mandy</option>
              <option value="max">Max</option>
              <option value="meg">Meg</option>
              <option value="melodie">Melodie</option>
              <option value="meeple">Meeple</option>
              <option value="mico">Mico</option>
              <option value="moe">Moe</option>
              <option value="mortis">Mortis</option>
              <option value="mr-p">Mr. P</option>
              <option value="nani">Nani</option>
              <option value="nita">Nita</option>
              <option value="ollie">Ollie</option>
              <option value="otis">Otis</option>
              <option value="pam">Pam</option>
              <option value="penny">Penny</option>
              <option value="pearl">Pearl</option>
              <option value="piper">Piper</option>
              <option value="poco">Poco</option>
              <option value="r-t">R-T</option>
              <option value="rico">Rico</option>
              <option value="rosa">Rosa</option>
              <option value="ruffs">Ruffs</option>
              <option value="sam">Sam</option>
              <option value="sandy">Sandy</option>
              <option value="shelly">Shelly</option>
              <option value="shade">Shade</option>
              <option value="spike">Spike</option>
              <option value="sprout">Sprout</option>
              <option value="squeak">Squeak</option>
              <option value="stu">Stu</option>
              <option value="surge">Surge</option>
              <option value="tara">Tara</option>
              <option value="tick">Tick</option>
              <option value="willow">Willow</option>
            </select>
          </div>
          <div style={{ "flex": "1" }}>
            <label htmlFor="redBrawler2">Red Brawler 3: </label>
            <select id="redBrawler2" value={redBrawlers[2]} onChange={(e) => handleRedChange(e, 2)} style={{ padding: "8px", borderRadius: "4px" }}>
              <option value="">Select a Brawler</option>
              <option value="8-bit">8-Bit</option>
              <option value="amber">Amber</option>
              <option value="angelo">Angelo</option>
              <option value="ash">Ash</option>
              <option value="barley">Barley</option>
              <option value="bea">Bea</option>
              <option value="belle">Belle</option>
              <option value="berry">Berry</option>
              <option value="bibi">Bibi</option>
              <option value="bo">Bo</option>
              <option value="bonnie">Bonnie</option>
              <option value="brock">Brock</option>
              <option value="bull">Bull</option>
              <option value="buster">Buster</option>
              <option value="buzz">Buzz</option>
              <option value="byron">Byron</option>
              <option value="carl">Carl</option>
              <option value="charlie">Charlie</option>
              <option value="chester">Chester</option>
              <option value="chuck">Chuck</option>
              <option value="clancy">Clancy</option>
              <option value="colette">Colette</option>
              <option value="colt">Colt</option>
              <option value="cordelius">Cordelius</option>
              <option value="crow">Crow</option>
              <option value="darryl">Darryl</option>
              <option value="doug">Doug</option>
              <option value="draco">Draco</option>
              <option value="dynamike">Dynamike</option>
              <option value="edgar">Edgar</option>
              <option value="el-primo">El Primo</option>
              <option value="emz">Emz</option>
              <option value="eve">Eve</option>
              <option value="fang">Fang</option>
              <option value="frank">Frank</option>
              <option value="gale">Gale</option>
              <option value="gene">Gene</option>
              <option value="gray">Gray</option>
              <option value="griff">Griff</option>
              <option value="grom">Grom</option>
              <option value="gus">Gus</option>
              <option value="hank">Hank</option>
              <option value="jacky">Jacky</option>
              <option value="janet">Janet</option>
              <option value="jessie">Jessie</option>
              <option value="juju">Juju</option>
              <option value="kenji">Kenji</option>
              <option value="kit">Kit</option>
              <option value="larry-lawrie">Larry & Lawrie</option>
              <option value="leon">Leon</option>
              <option value="lily">Lily</option>
              <option value="lola">Lola</option>
              <option value="lou">Lou</option>
              <option value="mandy">Mandy</option>
              <option value="max">Max</option>
              <option value="meg">Meg</option>
              <option value="melodie">Melodie</option>
              <option value="meeple">Meeple</option>
              <option value="mico">Mico</option>
              <option value="moe">Moe</option>
              <option value="mortis">Mortis</option>
              <option value="mr-p">Mr. P</option>
              <option value="nani">Nani</option>
              <option value="nita">Nita</option>
              <option value="ollie">Ollie</option>
              <option value="otis">Otis</option>
              <option value="pam">Pam</option>
              <option value="penny">Penny</option>
              <option value="pearl">Pearl</option>
              <option value="piper">Piper</option>
              <option value="poco">Poco</option>
              <option value="r-t">R-T</option>
              <option value="rico">Rico</option>
              <option value="rosa">Rosa</option>
              <option value="ruffs">Ruffs</option>
              <option value="sam">Sam</option>
              <option value="sandy">Sandy</option>
              <option value="shelly">Shelly</option>
              <option value="shade">Shade</option>
              <option value="spike">Spike</option>
              <option value="sprout">Sprout</option>
              <option value="squeak">Squeak</option>
              <option value="stu">Stu</option>
              <option value="surge">Surge</option>
              <option value="tara">Tara</option>
              <option value="tick">Tick</option>
              <option value="willow">Willow</option>
            </select>
          </div>
        </div>
      </div>
      <div style={{ backgroundColor: "#222222", height: "100%", width: "100%", flex: "1", padding: "20px", overflow: "auto" }}>
        <div style={{ display: "flex", gap: "200px" }}>
          <h2 style={{ marginBottom: "20px" }}>Brawler Statistics</h2>
          <button onClick={handleClick} style={{ paddingLeft: "50px", paddingRight: "50px", height: "50px", marginTop: "15px", backgroundColor: "#666666" }}>{"Sort By " + sortType}</button>
        </div>
        {Array.isArray(brawlerStats) ? (
          brawlerStats.length > 0 ? (
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: "8px", borderBottom: "2px solid #ddd" }}>Brawler</th>
                  <th style={{ textAlign: "right", padding: "8px", borderBottom: "2px solid #ddd" }}>Win Rate</th>
                  <th style={{ textAlign: "right", padding: "8px", borderBottom: "2px solid #ddd" }}>Matches</th>
                </tr>
              </thead>
              <tbody>
                {brawlerStats.map((brawler, index) => {
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
            <p>No brawler statistics available for this map.</p>
          )
        ) : (
          <p>Select a map to view brawler statistics.</p>
        )}
      </div>
    </div>
  )
}

export default App