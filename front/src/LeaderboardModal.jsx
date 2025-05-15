import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './LeaderboardModal.css';
import InfoTooltip from './InfoTooltip';

const LeaderboardModal = ({
  isOpen,
  onClose,
  data,
  isLoading,
  error,
  initialRank,
  rankOptions,
  onFetchLeaderboard
}) => {
  const { t } = useTranslation();

  const [showMostMatches, setShowMostMatches] = useState(true);
  const [currentModalRank, setCurrentModalRank] = useState(undefined);
  const [selectedDate, setSelectedDate] = useState('');
  const [minGamesForWinRate, setMinGamesForWinRate] = useState(15);

  useEffect(() => {
    if (isOpen) {
      setCurrentModalRank(initialRank !== undefined ? Number(initialRank) : (rankOptions && rankOptions.length > 0 ? Number(rankOptions[0].value) : undefined));
      if (!selectedDate) {
          setSelectedDate('2025-04-30');
      }
    }
  }, [isOpen, initialRank, rankOptions, selectedDate]);

  useEffect(() => {
    if (isOpen && currentModalRank !== undefined && !isNaN(Number(currentModalRank)) && selectedDate) {
      const gamesFilter = !showMostMatches ? minGamesForWinRate : undefined;
      console.log(`Fetching leaderboard: Rank=${currentModalRank}, Date=${selectedDate}, MinGames=${gamesFilter}, ShowMostMatches=${showMostMatches}`);
      onFetchLeaderboard(currentModalRank, selectedDate, gamesFilter);
    }
  }, [isOpen, currentModalRank, selectedDate, onFetchLeaderboard, minGamesForWinRate, showMostMatches]);

  function handleRankChange(event) {
    const newRank = parseInt(event.target.value, 10);
    if (!isNaN(newRank)) {
      setCurrentModalRank(newRank);
    }
  };

  function handleDateChange(event) {
    setSelectedDate(event.target.value);
  };

  function handleMinGamesChange(event) {
    const value = parseInt(event.target.value, 10);
    setMinGamesForWinRate(isNaN(value) || value < 0 ? 0 : value);
  }

  if (!isOpen) {
    return null;
  }

  const renderListItem = (player, index, type) => {
    const rank = index + 1;
    const playerTagDisplay = player.playerTag || t('app.leaderboardModal.fallbacks.notAvailable');
    const playerNameDisplay = player.playerName || t('app.leaderboardModal.fallbacks.unknownPlayer');

    if (type === 'battles') {
      return (
        <li key={`${player.playerTag || 'unknown'}-${index}`}>
          {t('app.leaderboardModal.playerListItemBattles', {
            rank: rank,
            playerName: playerNameDisplay,
            playerTag: playerTagDisplay,
            wins: player.wins ?? t('app.leaderboardModal.fallbacks.notAvailable')
          })}
        </li>
      );
    } else if (type === 'winrate') {
      const wins = player.wins ?? t('app.leaderboardModal.fallbacks.notAvailable');
      const losses = player.losses ?? t('app.leaderboardModal.fallbacks.notAvailable');
      const winratePercent = player.winrate != null ? (player.winrate * 100).toFixed(1) : t('app.leaderboardModal.fallbacks.notAvailable');
      return (
        <li key={`${player.playerTag || 'unknown'}-${index}`}>
          {t('app.leaderboardModal.playerListItemWinrate', {
            rank: rank,
            playerName: playerNameDisplay,
            playerTag: playerTagDisplay,
            wins: wins,
            losses: losses,
            winrate: winratePercent
          })}
        </li>
      );
    }
    return null;
  };

  console.log("Data inside modal:", data);
  console.log("Most Matches Data:", data?.topBattles);
  const mostMatchesData = data?.topBattles || [];
  const highestWinRateData = data?.topWinrates || [];

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button onClick={onClose} className="modal-close-button">X</button>
        <h2>{t('app.leaderboardModal.title')}</h2>

        <div className="leaderboard-controls" style={{ marginBottom: '15px', display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
          <button
            onClick={() => setShowMostMatches(!showMostMatches)}
            style={{ padding: '8px 12px', backgroundColor: '#555', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            disabled={isLoading}
          >
            {showMostMatches ? t('app.leaderboardModal.toggleButton.showHighestWinrate') : t('app.leaderboardModal.toggleButton.showMostBattles')}
          </button>

          <div className="rank-filter-group" style={{ display: 'flex', alignItems: 'center' }}>
            <label htmlFor="leaderboardRankFilter" style={{ marginRight: '5px', color: 'white' }}>{t('app.leaderboardModal.rankFilter.label')}</label>
            <select
              id="leaderboardRankFilter"
              value={currentModalRank === undefined ? '' : currentModalRank}
              onChange={handleRankChange}
              disabled={isLoading || !rankOptions || rankOptions.length === 0}
              style={{ padding: '8px', backgroundColor: '#555', color: 'white', border: '1px solid #777', borderRadius: '4px', minWidth: '120px' }}
            >
              {rankOptions && rankOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <InfoTooltip text={t('app.leaderboardModal.rankFilter.tooltip')} style={{ marginLeft: '10px' }} />
          </div>

          <div className="date-filter-group" style={{ display: 'flex', alignItems: 'center' }}>
            <label htmlFor="leaderboardDateFilter" style={{ marginRight: '5px', color: 'white' }}>{t('app.leaderboardModal.dateFilter.label')}</label>
            <input
              type="date"
              id="leaderboardDateFilter"
              value={selectedDate}
              onChange={handleDateChange}
              disabled={isLoading}
              min="2025-04-30"
              style={{ padding: '8px', backgroundColor: '#555', color: 'white', border: '1px solid #777', borderRadius: '4px' }}
            />
            <InfoTooltip text={t('app.leaderboardModal.dateFilter.tooltip')} style={{ marginLeft: '10px' }} />
          </div>

          {!showMostMatches && (
            <div className="min-games-filter-group" style={{ display: 'flex', alignItems: 'center' }}>
              <label htmlFor="leaderboardMinGamesFilter" style={{ marginRight: '5px', color: 'white' }}>{t('app.leaderboardModal.minBattlesFilter.label')}</label>
              <input
                type="number"
                id="leaderboardMinGamesFilter"
                value={minGamesForWinRate}
                onChange={handleMinGamesChange}
                min="0"
                style={{ padding: '8px', backgroundColor: '#555', color: 'white', border: '1px solid #777', borderRadius: '4px', width: '80px' }}
              />
              <InfoTooltip text={t('app.leaderboardModal.minBattlesFilter.tooltip')} style={{ marginLeft: '10px' }} />
            </div>
          )}
        </div>

        {isLoading && <p>{t('app.leaderboardModal.loading')}</p>}
        {error && <p className="error-message">{error}</p>}

        {!isLoading && !error && (
          <>
            {showMostMatches ? (
              <div className="leaderboard-section">
                <h4>{t('app.leaderboardModal.mostBattlesPlayedTitle')}</h4>
                {(mostMatchesData.length === 0) ? (
                  <p>{t('app.leaderboardModal.noData')}</p>
                ) : (
                  <ul>
                    {mostMatchesData.map((player, index) => renderListItem(player, index, 'battles'))}
                  </ul>
                )}
              </div>
            ) : (
              <div className="leaderboard-section">
                <h4>{t('app.leaderboardModal.highestWinRateTitle', { minGames: minGamesForWinRate })}</h4>
                {(highestWinRateData.length === 0) ? (
                   <p>{t('app.leaderboardModal.noDataOrMinBattlesNotMet')}</p>
                ) : (
                  <ul>
                    {highestWinRateData.map((player, index) => renderListItem(player, index, 'winrate'))}
                  </ul>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default LeaderboardModal;