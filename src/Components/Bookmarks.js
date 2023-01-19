import react, { useEffect } from 'react';
import styles from './Bookmarks.module.css';
import {
    DraggableItem,
    DraggableContainer,
} from '@wuweiweiwu/react-shopify-draggable';
import { useState } from 'react';
import BookmarkItem from './BookmarkItem';
import localStorage from 'local-storage';

function Bookmarks({ addModal, setAddModal }) {
    const [firstTime, setFirstTime] = useState(true);

    // get local storage
    let defaultBookmarks = [];
    const localBookmarks = localStorage.get('bookmarks');
    if (localBookmarks && firstTime) {
        defaultBookmarks = localBookmarks;
    }
    const [bookmarksArr, setBookmarksArr] = useState(defaultBookmarks);
    const [arr, setArr] = useState(defaultBookmarks);

    useEffect(() => {
        if (firstTime) {
            setFirstTime(false);
        }
    }, [])

    useEffect(() => {
        setArr(() => bookmarksArr);
    }, [bookmarksArr])

    // Adds bookmark
    const addBookmark = async (e) => {
        e.preventDefault();
        let image = `https://www.google.com/s2/favicons?domain=${websiteUrl}&sz=256`;
        if (image.includes('mail.google.com')) {
            image = `https://www.google.com/s2/favicons?domain=${websiteUrl}`
        }
        let newItem = {
            title: websiteName,
            url: websiteUrl,
            image: image,
        }

        // https://www.google.com/s2/favicons?domain=

        let newBookmarks = [...bookmarksArr];

        if (bookmarksArr.length > 7) {
            setAddModal(false);
            return;
        } else {
            newBookmarks.push(newItem);
            setBookmarksArr(newBookmarks);
            setAddModal(false);
            setWebsiteName('');
            setWebsiteUrl('');
            // Update local storage
            localStorage.set('bookmarks', newBookmarks);
        }
    }

    // Deletes bookmark
    const deleteBookmark = (deleteIndex) => {
        let newArr = [];
        bookmarksArr.forEach((item, index) => {
            if (index !== deleteIndex) {
                newArr.push(item);
            }
        });
        setBookmarksArr(newArr);
        // Update local storage
        localStorage.set('bookmarks', newArr);
    }

    const [websiteName, setWebsiteName] = useState('');
    const [websiteUrl, setWebsiteUrl] = useState('');

    const [baseIndex, setBaseIndex] = useState(0);

    const swapElements = (index) => {
        let index1 = index;
        let index2 = baseIndex;

        setBookmarksArr((prev) => {
            let newArr = [...prev];

            newArr[index1] = prev[index2];
            newArr[index2] = prev[index1];

            localStorage.set('bookmarks', newArr);
            return newArr;
        });
    }

    const [isDragging, setIsDragging] = useState(false);

    return (
        <>
            <div
                as="div"
                type="sortable"
                className={styles.container}
            >
                {
                    bookmarksArr.map((item, index) => (
                        <BookmarkItem setIsDragging={setIsDragging} isDragging={isDragging} swapElements={swapElements} setBaseIndex={setBaseIndex} item={item} index={index} deleteBookmark={deleteBookmark} key={index} />
                    ))
                }
                {
                    bookmarksArr.length > 7 ? <></> :
                        <>
                            <div className={styles.addNew} title='Add Bookmark' onClick={() => setAddModal((prev) => !prev)}>
                                <div className={styles.addCircle}>
                                    <div className={styles.addText}>+</div>
                                </div>
                                <div className={styles.addLabel}>Add Bookmark</div>
                            </div>
                            {
                                addModal ? <div className={styles.addModal}>
                                    <form onSubmit={addBookmark} className={styles.form}>
                                        <div className={styles.formHeader}>Add a shortcut</div>
                                        <div className={styles.nameLabel}>
                                            Name
                                            <input required="required" className={styles.nameInput} value={websiteName} type='text' onChange={(e) => setWebsiteName(e.target.value)} />
                                        </div>
                                        <div className={styles.urlLabel}>
                                            URL
                                            <input required="required" className={styles.urlInput} value={websiteUrl} type='text' onChange={(e) => setWebsiteUrl(e.target.value)} />
                                        </div>
                                        <div className={styles.buttons}>
                                            <button className={styles.addButton} type='submit' >Add</button>
                                            <button className={styles.cancelButton} type='button' onClick={() => setAddModal(false)}>Cancel</button>
                                        </div>
                                    </form>
                                </div> : <></>
                            }
                        </>
                }
            </div>
        </>
    )
}

export default Bookmarks;