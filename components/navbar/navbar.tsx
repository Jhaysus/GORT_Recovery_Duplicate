"use client";
import {useState} from 'react';
import styles from "./navbar.module.css";

export default function NavBar() {
    //for the button
    const [state, setState] = useState("");
    const [isOpen, setIsOpen] = useState(false);

    function toggleMenu(){
        setIsOpen(!isOpen);
    }

    return (
        <div className={styles.Navbar}>
            <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&icon_names=menu" />
            <div className={styles.navbarLeft}>
                {/* Fixed: href should be "/" not "\" */}
                <a href="/home" className={styles.logo}>
                    GORT ARCHIVE
                </a>
            </div>
            <div className={styles.navbarRight}>
                {/* Navigation links */}
                {/* Two options once you click: showMenu displays the list, showNone hides it */}
                <ul className={isOpen ? styles.showMenu : styles.showNone}>
                    <li><a href="/" className={styles.button}>Home</a></li>
                    <li><a href="/archive" className={styles.button}>Archive</a></li>
                    <li><a href="/about" className={styles.button}>About</a></li>
                </ul>
            </div>

            {/* Displays the menu icon — clicking toggles the menu open/closed */}
            <div className={styles.menuIcon} onClick={toggleMenu}>
                <span className="material-symbols-outlined"> menu </span>
            </div>

        </div>
    );
}