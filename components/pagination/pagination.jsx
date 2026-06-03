"use client";
import styles from "../pagination/pagination.module.css";

export default function Pagination({ currentPage, totalPages, onPageChange }) {
    if( totalPages <= 1 ) return null;
    

    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    
    return (
        <div className={styles.pagination_container}>
            {/* create buttons */}
            < button className={styles.page_button}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 0}>
                &lt; Back
            </button>
            {/* create the page numbers */}
            <div className={styles.pageNumbers}>
                {pageNumbers.map(number => (
                    <button
                        key={number}
                        // Subtract 1 because 'currentPage' is 0-indexed, but 'number' starts at 1
                        className={`${styles.number_button} ${currentPage === number - 1 ? styles.active : ''}`}
                        onClick={() => onPageChange(number-1)}
                    >
                        {number}
                    </button>
                ))}
            </div>

            {/* create next button */}
            <button className={styles.page_button}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages - 1}>
                Next &gt;
            </button>

        </div>
    )

  
}
