"use client";
import { useState } from "react";
import styles from "./search.module.css";

const FIELDS = ["Object", "RA", "DEC", "Date", "Observer", "Filter", "Frame type"];

export default function SearchBar({ observations, onFilter }) {
  const [rows, setRows] = useState([{ id: 1, field: "object", value: "" }]);
  // add row
  function addRow() {
    setRows((prev) => [...prev, { id: Date.now(), field: "object", value: "" }]);
  }
  //removes row
  function removeRow(id) {
    setRows((prev) => prev.filter((r) => r.id !== id));
  }

  function updateRow(id, key, value) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, [key]: value } : r)));
  }

  // Normalizes any common date format to yyyy-mm-dd for comparison
  function normalizeDate(input) {
    const s = input.trim();

    // Match digits-only groups separated by - or /
    const match = s.match(
      /^(\d{1,4})([-\/])(\d{1,2})\2(\d{1,4})$/
    );
    if (!match) return null;

    const [, a, , b, c] = match;

    // yyyy-mm-dd or yyyy/mm/dd
    if (a.length === 4) return `${a}-${b.padStart(2, "0")}-${c.padStart(2, "0")}`;

    // dd-mm-yyyy or mm-dd-yyyy — ambiguous, so accept both by returning two candidates
    if (c.length === 4) {
      return [
        `${c}-${a.padStart(2, "0")}-${b.padStart(2, "0")}`, // treat a as month
        `${c}-${b.padStart(2, "0")}-${a.padStart(2, "0")}`, // treat a as day
      ];
    }

    return null;
  }

  function handleSearch() {
    const filtered = observations.filter((obs) =>
      rows.every(({ field, value }) => {
        if (!value.trim()) return true;
        const v = value.toLowerCase();

        if (field === "Filter") {
          return obs.filters?.some((f) => f.name.toLowerCase() === v);
        }

        // Special date handling
        if (field === "Date") {
          const normalized = normalizeDate(value);
          if (normalized) {
            const candidates = Array.isArray(normalized) ? normalized : [normalized];
            return candidates.some((candidate) =>
              obs.date?.toLowerCase().includes(candidate)
            );
          }
          // Fallback: plain substring match (e.g. partial year "2024")
          return obs.date?.toLowerCase().includes(v);
        }

        const fieldMap = {
          object: obs.object,
          RA: obs.ra,
          DEC: obs.dec,
          Date: obs.date,
          Observer: obs.observer,
          "Frame type": obs.frames?.map((f) => f.name).join(" "),
        };
        return fieldMap[field]?.toLowerCase().includes(v);
      })
    );
    onFilter(filtered);
  }

  return (
    <div className={styles.searchWrapper}>
      {rows.map((row) => (
        <div key={row.id} className={styles.row}>
          <select
            className={styles.fieldSelect}
            value={row.field}
            onChange={(e) => updateRow(row.id, "field", e.target.value)}
          >
            {FIELDS.map((f) => <option key={f} value={f}>{f}</option>)}
          </select>
          <input
            className={styles.searchInput}
            type="text"
            placeholder={
              row.field === "Date" ? "Search date (mm/dd/yyyy)..." :
                row.field === "RA" ? "Search RA (hh mm ss)..." :
                  row.field === "DEC" ? "Search DEC (±dd mm ss)..." :
                    `Search ${row.field}...`
            }
            value={row.value}
            onChange={(e) => updateRow(row.id, "value", e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          {rows.length > 1 && (
            <button className={styles.removeBtn} onClick={() => removeRow(row.id)}>×</button>
          )}

        </div>

      ))}
      <button className={styles.addBtn} onClick={addRow} disabled={rows.length >= 7}>+</button>
      <button className={styles.searchBtn} onClick={handleSearch}>Search</button>
    </div>
  );
}