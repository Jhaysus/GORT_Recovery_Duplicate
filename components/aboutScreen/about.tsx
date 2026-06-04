import Link from 'next/link';
import styles from './about.module.css';

export default function AboutPage() {
    return (
        <div className={styles.wrapper}>
            <h1 className={styles.title}>About the GORT Archive</h1>

            <p>
                The GORT Archive is a comprehensive repository of astronomical observation records
                collected by the GORT telescope. It provides access to a wide range of data,
                including metadata such as object name, observation date, exposure time, filter,
                observer, coordinates, and frame type. Users can search for specific observations
                and download FITS files for further analysis.
            </p>

            <p>
                GORT (Gamma-ray Optical Robotic Telescope) is a 14" Celestron Schmidt-Cassegrain
                telescope mounted on a computer-controlled tracking Paramount ME, inside a 12-foot
                Astrohaven clamshell dome. GORT's instruments include an Optec 5-port filter wheel
                with five positions (clear, and BVRI), an Optec focuser, and an Apogee Alta U47
                rear-illuminated 1024×1024 monochrome CCD camera. To control dome open and closure
                operations based on weather, GORT uses a Boltwood Cloud Sensor II and a Davis
                Vantage Vue weather station. GORT software includes ACP for observatory control,
                Maxim DL for camera and filter control, SkyX for mount control, and FocusMax II
                for focuser control.
            </p>

            <p>
                All images taken with GORT are automatically archived on SSU servers. GORT was
                built in 2004 with funding from several NASA high-energy space observatory
                Education and Public Outreach (E/PO) programs, including the Fermi Gamma-ray
                Space Telescope (formerly GLAST), Swift, and XMM-Newton. It is located at the
                Pepperwood Preserve, outside northeast Santa Rosa, CA at an elevation of about
                1,500 feet.
            </p>

            <p>
                Through 2015, GORT users — primarily teens and young adults — supported mission
                E/PO objectives including multi-year optical observations for active galactic
                nuclei routinely monitored by Fermi. GORT is also capable of automatically
                following up gamma-ray bursts (GRBs) observed with Swift and other satellites
                using the Gamma-ray Coordinates Network. GORT afterglow detections were included
                in IAU circulars for eight GRBs, including one event where GORT-detected data
                were the first reported. Raw GORT data are archived on SSU servers, and reduced
                lightcurves are archived through the AAVSO (American Association of Variable Star
                Observers).
            </p>
            {/* <br/> */}
            <Link href="https://afh.sonoma.edu/gort-4/" className={styles.linkButton}>
                Learn More About GORT
            </Link>
        </div>
    );
}