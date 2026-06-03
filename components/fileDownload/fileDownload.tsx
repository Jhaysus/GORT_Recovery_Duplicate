'use client';
import { useState } from 'react';
import styles from '../fileDownload/fileDownload.module.css';

interface Frame {
  _id: string;
  object: string;
  filter: string;
  time: string;
  exptime: number;
}

interface ZipMeta {
  object: string;
  date: string;
  observer: string;
  subset: string | null;
}

interface FileDownloadProps {
  frames: Frame[];
  label?: string;
  variant?: 'card' | 'filter';
  zipMeta?: ZipMeta;
}

export const FileDownload = ({ frames, label, variant, zipMeta }: FileDownloadProps) => {
  const [loading, setLoading] = useState(false);

  async function handleDownload() {
    setLoading(true);
    try {
      const frameIds = frames.map((f) => f._id);

      const response = await fetch('/api/zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: frameIds, zipMeta }),
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const safe = (s: string | null | undefined) =>
        (s ?? 'unknown').replace(/[^a-zA-Z0-9_-]/g, '_');

      const downloadName = zipMeta
        ? `${safe(zipMeta.object)}_${safe(zipMeta.date)}_${safe(zipMeta.observer)}_${zipMeta.subset ? safe(zipMeta.subset) : 'session'}.zip`
        : `gort_export_${Date.now()}.zip`;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = downloadName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      className={variant === 'filter' ? styles.filterDownloadButton : styles.downloadButton}
      onClick={handleDownload}
      disabled={loading}
    >
      {loading ? <span className={styles.spinner} /> : label}
    </button>
  );
};
