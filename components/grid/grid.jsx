"use client";
import { useEffect, useState } from "react";
import styles from "../grid/grid.module.css";
import SearchBar from "../../components/search/search";
import Pagination from "../../components/pagination/pagination";
import { FileDownload } from '../fileDownload/fileDownload'

// Group observations by object and date
function groupObservations(data) {
  const groupedCards = {};

  data.forEach((item) => {
    const night = item["DATE-OBS"]?.split("T")[0] || "Unknown Date";
    // this will call the frame
    const frameType = item.FRAME_TYPE?.toLowerCase() || "";
    const CALIBRATION_FRAMES = ["dark", "bias", "flat"];

    const isCalibration = CALIBRATION_FRAMES.some((type) =>
      frameType.includes(type)
    );

    const cardKey = isCalibration
      ? `calibration-${night}`
      : // each unique OBJECT + DATE combination gets its own card
      `${item.OBJECT}-${night}-${item.OBSERVER}`; //we could add item.OBSERVER to split it more

    if (!groupedCards[cardKey]) {
      groupedCards[cardKey] = {
        _id: cardKey,
        object: isCalibration ? "Calibration" : item.OBJECT || "-",
        date: night,
        isCalibration,
        ra: isCalibration ? null : item.RA || "-",
        dec: isCalibration ? null : item.DEC || "-",
        observer: item.OBSERVER || "-",
        filters: {},
        frames: {},
      };
    }

    const filterName = isCalibration
      ? item.FRAME_TYPE || "Unknown" // group by frame type instead of filter
      : item.FILTER || "Unknown";
    if (!groupedCards[cardKey].filters[filterName]) {
      groupedCards[cardKey].filters[filterName] = {
        name: filterName,
        frames: [],
      };
    }

    const frameKey = item.FRAME_TYPE || "Unknown";
    if (!groupedCards[cardKey].frames[frameKey]) {
      groupedCards[cardKey].frames[frameKey] = { name: frameKey, frames: [] };
    }

    const frameData = {
      _id: item._id,
      observer: item.OBSERVER || "-",
      time: item.FN_TIME || item.UT || "-",
      exptime: item.EXPTIME || "-",
      frameType: item.FRAME_TYPE || "-",
    };

    groupedCards[cardKey].filters[filterName].frames.push(frameData);
    groupedCards[cardKey].frames[frameKey].frames.push(frameData);
  });

  return (
    Object.values(groupedCards)
      .map((card) => ({
        ...card,
        filters: Object.values(card.filters),
        frames: Object.values(card.frames),
      }))
      // Sorting the array based on the 'date' property
      .sort((a, b) => new Date(b.date) - new Date(a.date))
  );
}

// Dropdown for each filter
function FilterDropdown({ filter, isCalibration, zipMeta }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.filterBlock}>
      <button
        type="button"
        className={styles.filterHeader}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={styles.filterTitle}>
          {filter.name} {isCalibration ? "Frames" : "Filter"} (
          {filter.frames.length} frames)
        </span>

        <span className={styles.chevron}>{isOpen ? "▲" : "▼"}</span>
      </button>

      {isOpen && (
        <div className={styles.fileList}>
          <div className={styles.filterActions}>
            {/* <button type="button" className={styles.smallButton}>
              ⬇ All
            </button> */}
            {/* I need ot get filedownload to access the data */}
            <FileDownload frames={filter.frames} label={"⬇ Download Set"} variant='filter' zipMeta={{ ...zipMeta, subset: filter.name }} />

          </div>

          {filter.frames.map((frame) => (
            <div key={frame._id} className={styles.fileRow}>
              <span>
                {frame.time} — {frame.exptime}s
              </span>

              <a
                href={`/api/download/${frame._id}`}
                className={styles.smallButton}
              >
                ⬇
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Each individual card
function ObservationCard({ obs }) {
  // Due to time, we are depending on the frame to be seperated
  const displayTitle = obs.isCalibration ? `Calibration Frames` : obs.object;

  return (
    <div className={styles.card}>
      <div className={styles.cardHeader}>
        <div className={styles.cardTop}>
          <h2 className={styles.cardTitle}>{displayTitle}</h2>
          <span className={styles.cardDate}>{obs.date}</span>
        </div>

        {obs.ra && obs.dec && (
          <div className={styles.cardCoords}>
            RA: {obs.ra} &nbsp; DEC: {obs.dec}
          </div>
        )}
        <div className={styles.cardObserver}>Observer: {obs.observer}</div>
      </div>

      <div className={styles.cardDivider} />

      <div className={styles.cardBody}>
        {/* <button type="button" className={styles.downloadButton}>
          Download Session Data
        </button> */}
        {/* issue revolves around trying to get ALL of the files to get downloaded
        need to fetch all the things and not get confused */}
        <FileDownload frames={obs.filters.flatMap(filter => filter.frames)} label={"Download Session Data"} variant='card' zipMeta={{ object: obs.object, date: obs.date, observer: obs.observer, subset: null }} />

        <div className={styles.filterList}>
          {obs.filters.map((filter) => (
            <FilterDropdown
              key={filter.name}
              filter={filter}
              isCalibration={obs.isCalibration}
              zipMeta={{ object: obs.object, date: obs.date, observer: obs.observer }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// API call to backend
export default function ObservationList() {
  const [observations, setObservations] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("observations");

  // limits the number of cards
  const [page, setPage] = useState(0);
  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = page * ITEMS_PER_PAGE;
  const visiblePage = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  const nextPage = () => {
    setPage((page + 1) % totalPages);
  };

  const prevPage = () => {
    setPage((page - 1 + totalPages) % totalPages);
  };
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  useEffect(() => {
    async function getData() {
      try {
        const response = await fetch("/api/observations");

        if (!response.ok) {
          console.error(`An error occurred: ${response.statusText}`);
          return;
        }

        const data = await response.json();
        const groupedData = groupObservations(data);
        setObservations(groupedData);
        setFiltered(groupedData.filter((obs) => !obs.isCalibration));
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    }

    getData();
  }, []);
  // loading
  if (loading) {
    return (
      <div className={styles.loading}>
        Loading
        {/* claude helped me with the dots */}
        <span className={styles.dot}>.</span>
        <span className={styles.dot}>.</span>
        <span className={styles.dot}>.</span>
      </div>
    );
  }
  // alert for tab change
  function handleTabChange(tab) {
    setActiveTab(tab);
    setPage(0); //sets the page back to 0 since they both share the state
    if (tab === "observations") {
      setFiltered(observations.filter((obs) => !obs.isCalibration));
    } else {
      setFiltered(observations.filter((obs) => obs.isCalibration));
    }
  }

  // What is shown
  // I only want to see non-calibration observations. Update: I made it where you can filter out either
  console.log(filtered);

  return (
    <div className={styles.observationWrapper}>
      <div className={styles.spacer} />
      {/* Location of the Observatory information */}
      <div className={styles.locationWrapper}>
        <div className={styles.site}>Observatory site info:</div>
        <a
          className={styles.location}
          href="https://www.google.com/maps/place/38%C2%B033'57.0%22N+122%C2%B041'14.0%22W/@38.5658375,-122.6897971,820m/data=!3m2!1e3!4b1!4m4!3m3!8m2!3d38.5658333!4d-122.6872222?entry=ttu&g_ep=EgoyMDI2MDUwNi4wIKXMDSoASAFQAw%3D%3D"
          target="_blank"
          rel="noopener noreferrer"
        >
          Pepperwood Preserve, Santa Rosa, CA
        </a>{" "}
        <div className={styles.geoCoordinates}>
          Lat: 38 33 57°N, Lon: -122 41 14°W
        </div>
        <div className={styles.elevation}> Elevation: 1500 feet</div>
      </div>
      {/* Tabs */}
      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${activeTab === "observations" ? styles.tabActive : ""
            }`}
          onClick={() => handleTabChange("observations")}
        >
          Observations
        </button>
        <button
          className={`${styles.tab} ${activeTab === "calibration" ? styles.tabActive : ""
            }`}
          onClick={() => handleTabChange("calibration")}
        >
          Calibration
        </button>
      </div>

      {/* Search bar */}
      <SearchBar
        observations={observations.filter((obs) =>
          activeTab === "observations" ? !obs.isCalibration : obs.isCalibration
        )}
        onFilter={(results) => {
          setFiltered(results);
          setPage(0);       // ← reset to page 1 on every new search
        }}
      />
      {/* fix this by making another */}
      {/* <div className={styles.spacer}/> */}
      {/* page click */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />

      <div className={styles.grid}>
        {visiblePage.map((obs) => (
          <ObservationCard key={obs._id} obs={obs} />
        ))}
      </div>
    </div>
  );
}