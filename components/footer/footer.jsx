import React from 'react';
import styles from './footer.module.css';

export default function Footer() {
    return ( 
    
    <div>
        {/* <div className = {styles.blueBar}/> */}
        <div 
        className = {styles.footer}>
            
            <div >
                <a href="https://edeon.sonoma.edu/"><img src = "../guides/edeon-corner.png" style = {{maxWidth: "210px"}}/></a>
                
                <h1 className = {styles.h1}> Contact Us</h1>
                
                <p className = {styles.p}>
                    EdEon is a STEM Learning Center that creates innovative
                    experiences in formal and informal education for
                    secondary and college students.
                </p>
                
                <p className = {styles.p}>
                Visit our page :<a href="https://edeon.sonoma.edu/"> EdEon </a>
                </p>
                
                <p className = {styles.p}>
                     Email: edeon@sonoma.edu
                </p>
            </div>
        </div></div>
    )
}