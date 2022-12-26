import { useState } from 'react';
import styles from './Bookmarks.module.css';

function BookmarkItem({ item, index, deleteBookmark, setBaseIndex, swapElements, setIsDragging, isDragging }) {
    const [isHovering, setIsHovering] = useState(false);

    const [dragHovering, setDragHovering] = useState(false);
    const [draggingCurrentItem, setDraggingCurrentItem] = useState(false);

    let readyURl = item.url;
    readyURl = item.url.includes('https://') ? item.url : item.url.includes('http://') ? item.url : `https://${item.url}`;

    return (
        <a href={readyURl} className={`
        ${styles.containerItem} 
        ${draggingCurrentItem ? styles.draggingCurrent : styles.nothing}
        ${isDragging ? styles.dragging : styles.nothing}
        ${dragHovering ? styles.beingDraggedOver : styles.nothing}
        `
        }
            // Start dragging    
            onDragStart={() => {
                setBaseIndex(index);
                setDraggingCurrentItem(true);
                setIsDragging(true);
            }}
            onDragEnd={() => {
                setDraggingCurrentItem(false);
                setIsDragging(false);
            }}

            // When this item is being dragged over
            onDragEnter={() => setDragHovering(() => true)}
            onDragLeave={() => setDragHovering(() => false)}

            // When item is being dragged over another item
            onDragOver={(e) => {
                e.preventDefault();
                setDragHovering(() => true);
            }}

            // When Item is dropped
            onDrop={() => {
                swapElements(index);
                setDragHovering(() => false);
            }}

            draggable
            onMouseOver={() => setIsHovering(() => true)}
            onMouseLeave={() => setIsHovering(() => false)}
        >
            {
                isHovering && !isDragging ? <div className={styles.delete} onClick={(e) => {
                    e.preventDefault();
                    deleteBookmark(index);
                }}>
                    <div className={styles.deleteText}>✕</div>
                </div> : <div className={styles.transparentDelete}>
                    <div className={styles.deleteText}>✕</div>
                </div>
            }
            <div className={styles.bookmark}>
                <img src={item.image} className={styles.icon} />
            </div>
            <div className={styles.text}>{item.title}</div>
        </a>
    )
}

export default BookmarkItem;