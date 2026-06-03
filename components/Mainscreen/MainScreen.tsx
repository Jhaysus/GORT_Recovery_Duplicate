'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './MainScreen.module.css';

export default function MainScreen() {
    const pathname = usePathname();
    const isActive = pathname === '/archive';

    return (
        <>
            <div className={styles.imageWrapper}>
                <h1 className={styles.title}>
                    GORT OBSERVATIONAL ARCHIVE
                </h1>
                <div className={styles.textGroup}>
                    <p className={styles.description}>
                        The GORT Archive provides access to astronomical observation records
                        and downloadable FITS files. Each archive entry includes metadata such
                        as object name, observation date, exposure time, filter, observer,
                        coordinates, and frame type.
                    </p>
                    <Link
                        href="/archive"
                        className={`${styles.linkButton} ${isActive ? styles.linkButtonActive : ''}`}
                    >
                        Enter Archive
                    </Link>
                </div>
            </div>

            <div className={styles.screenWrapper}>

                {/* How to use section */}
                <section className={styles.howToSection}>
                    <h2 className={styles.howToTitle}>
                        How to use the archive search
                    </h2>
                    <ol className={styles.howToList}>
                        <li>Go to the archive page.</li>
                        <li>Select the metadata field you want to search.</li>
                        <li>Type your search value into the search box.</li>
                        <li>Add more search rows if you want to narrow the results.</li>
                        <li>Use the download button on an observation card to download the FITS file.</li>
                    </ol>
                </section>

                {/* Search by cards */}
                <section className={styles.cardGrid}>
                    <div className={styles.infoCard}>
                        <h2 className={styles.cardTitle}>Search by Object</h2>
                        <p className={styles.cardText}>
                            Use the object field to find observations of a specific target,
                            such as <strong>M 101</strong>, <strong>NGC 7331</strong>, or{' '}
                            <strong>DRACO DWARF</strong>.
                        </p>
                    </div>
                    <div className={styles.infoCard}>
                        <h2 className={styles.cardTitle}>Search by Filter</h2>
                        <p className={styles.cardText}>
                            Filter observations by photometric filter, such as{' '}
                            <strong>B</strong>, <strong>V</strong>, <strong>R</strong>, or{' '}
                            <strong>Clear</strong>.
                        </p>
                    </div>
                    <div className={styles.infoCard}>
                        <h2 className={styles.cardTitle}>Search by Date</h2>
                        <p className={styles.cardText}>
                            Use the date field to locate observations from a specific night or
                            observing run.
                        </p>
                    </div>
                    <div className={styles.infoCard}>
                        <h2 className={styles.cardTitle}>Search by Frame Type</h2>
                        <p className={styles.cardText}>
                            Separate science frames from calibration frames by searching for
                            values like <strong>LIGHT</strong>, <strong>DARK</strong>,{' '}
                            <strong>BIAS</strong>, or <strong>FLAT</strong>.
                        </p>
                    </div>
                    <div className={styles.infoCard}>
                        <h2 className={styles.cardTitle}>Search by RA</h2>
                        <p className={styles.cardText}>
                            Search by Right Ascension to find observations at a specific
                            point in the sky, such as <strong>14 03 12.6</strong> or{' '}
                            <strong>23 45 00.0</strong>. Values are in hours, minutes, and seconds.
                        </p>
                    </div>
                    <div className={styles.infoCard}>
                        <h2 className={styles.cardTitle}>Search by DEC</h2>
                        <p className={styles.cardText}>
                            Search by Declination to locate observations at a specific
                            celestial latitude, such as <strong>+54 20 57</strong> or{' '}
                            <strong>-29 00 28</strong>. Values are in degrees, arcminutes, and arcseconds.
                        </p>
                    </div>
                    <div className={styles.infoCard}>
                        <h2 className={styles.cardTitle}>Search by Observer</h2>
                        <p className={styles.cardText}>
                            Filter observations by the observer who recorded them, such as{' '}
                            <strong>Wren</strong>, <strong>Autumn</strong>, or{' '}
                            <strong>GORT</strong>. Useful for tracking contributions from
                            a specific team member or automated session.
                        </p>
                    </div>
                    
                </section>

                {/* Two categories section */}
                <section className={styles.tabInfoSection}>
                    <h2 className={styles.howToTitle}>Two Categories</h2>
                    <p className={styles.cardText}>
                        The archive is organized into two tabs: <strong>Observation</strong> and <strong>Calibration</strong>.
                    </p>
                    <div className={styles.tabInfoGrid}>
                        <div className={styles.infoCard}>
                            <h2 className={styles.cardTitle}>Observation</h2>
                            <p className={styles.cardText}>
                                Contains all raw science frames captured during an observing session.
                                These are the primary data files used for analysis and research.
                            </p>
                        </div>
                        <div className={styles.infoCard}>
                            <h2 className={styles.cardTitle}>Calibration</h2>
                            <p className={styles.cardText}>
                                Contains frames used to correct and calibrate raw data. Includes:
                            </p>
                            <ul className={styles.calibrationList}>
                                <li><strong>Dark</strong> — captures thermal noise from the sensor</li>
                                <li><strong>Flat</strong> — corrects for uneven illumination across the field</li>
                                <li><strong>Bias</strong> — measures the baseline readout signal of the detector</li>
                            </ul>
                        </div>
                    </div>
                </section>

            </div>
        </>
    );
}
