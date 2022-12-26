import React, { useEffect, useState } from 'react';
import Bookmarks from '../Components/Bookmarks';
import Gadgets from '../Components/Gadgets';
import styles from './Home.module.css';
import localStorage from 'local-storage';
import Resizer from "react-image-file-resizer";

import Logo from '../Assets/logo.png';
import SearchImage from '../Assets/search.png';
import wallpaper from '../Assets/background.jpg';
import edit from '../Assets/edit.png';
import gadgetsImage from '../Assets/gadgets.png';

const resizeFile = (file) =>
    new Promise((resolve) => {
        Resizer.imageFileResizer(
            file,
            1080,
            720,
            "JPG",
            100,
            0,
            (uri) => {
                resolve(uri);
            },
            "base64"
        );
    });

function Home() {
    // Get local storage values
    let defaultImage = wallpaper;
    let defaultTheme = 0;
    let defaultEmail = 'https://mail.google.com/mail/u/0/#inbox';

    let localImage = localStorage.get('backgroundImage');
    let localTheme = localStorage.get('theme');
    let localEmail = localStorage.get('email');

    if (localImage) {
        defaultImage = localImage;
    }
    if (localTheme) {
        defaultTheme = parseInt(localTheme);
        let newTheme = `theme${defaultTheme}`;
        document.documentElement.setAttribute('data-theme', newTheme);
    }
    if (localEmail) {
        defaultEmail = localEmail;
    }

    const [backgroundImage, setBackgroundImage] = useState(defaultImage);
    const [themeIndex, setThemeIndex] = useState(defaultTheme);
    const [emailLink, setEmailLink] = useState(defaultEmail);
    const [loading, setLoading] = useState(false);

    const backgroundSet = async (e) => {
        try {
            setLoading(true);
            const image = await resizeFile(e.target.files[0]);
            setLoading(false);
            setBackgroundImage(image);
            // Update localStorage
            localStorage.set('backgroundImage', image);
        } catch (err) {
            console.log(err);
            setLoading(false);
        }
    }

    const changeTheme = () => {
        let newIndex = themeIndex + 1;

        if (themeIndex > 1) {
            newIndex = 0;
        }
        let newTheme = `theme${newIndex}`;
        document.documentElement.setAttribute('data-theme', newTheme);
        setThemeIndex(newIndex);
        // Update local storage
        localStorage.set('theme', newIndex);
    }

    const [editing, setEditing] = useState(false);

    const changeEmail = (e) => {
        let newVal = e.target.value;
        setEditing(false);
        setEmailLink(newVal);
        // Update local storage
        localStorage.set('email', newVal);
    }

    const closeEdit = () => {
        if (editing) {
            setEditing(false);
        }
    }

    const onKeyDownHandler = (e) => {
        if (e.key === 'Enter') {
            changeEmail(e);
        }
    };

    const [searchVal, setSearchVal] = useState('');

    const searchWeb = async () => {
        let URL = `https://duckduckgo.com/?q=${searchVal}`;
        window.location.replace(URL);
    }

    const [gadgetsOpen, setGadgetsOpen] = useState(false);
    const [addModal, setAddModal] = useState(false);
    const [dots, setDots] = useState('');

    useEffect(() => {
        const dotInterval = setInterval(function () {
            setDots((prevDots) => {
                let newDots = prevDots + '.';
                if (newDots.length > 3) {
                    newDots = '';
                }
                return newDots
            })
            if (!loading) clearInterval(dotInterval);
        }, 750);
    }, [loading])

    const [hoveringSearch, setHoveringSearch] = useState(false);

    return (
        <div className={styles.home} style={{ backgroundImage: `url(${backgroundImage})` }}>
            {
                loading ? <div className={styles.loading}>
                    <div className={styles.upload}>Uploading Image{dots}</div>
                </div> : <></>
            }
            <div className={styles.overlay} onClick={() => {
                closeEdit();
                setGadgetsOpen(false);
            }} />
            <div className={styles.gmails}>
                {
                    editing
                        ? <>
                            <input className={styles.editEmail} autoFocus={true} onKeyDown={onKeyDownHandler} type='text' placeholder='Enter a URL' onSubmit={changeEmail} />
                            <div className={styles.check} onClick={changeEmail}>✔</div>
                        </>
                        : <>
                            <a href={emailLink} className={styles.header} title='Gmail'>Gmail</a>
                            <img src={edit} onClick={() => setEditing(true)} className={styles.edit} title='Edit' />
                        </>
                }


                <div className={styles.gadgetsContainer}>
                    <div onClick={() => setGadgetsOpen((prev) => !prev)} className={gadgetsOpen ? styles.gadgetsImgContainerOpen : styles.gadgetsImgContainer}>
                        <img src={gadgetsImage} className={styles.gadgetsImg} title='Gadgets' />
                    </div>
                    {
                        gadgetsOpen ? <Gadgets /> : <></>
                    }
                </div>

            </div>

            <div className={styles.center} onClick={() => {
                closeEdit();
                setGadgetsOpen(false);
            }} >
                <img src={Logo} className={styles.logo} />
                <div className={styles.searchContainer} onMouseOver={() => setHoveringSearch(true)} onMouseOut={() => setHoveringSearch(false)}>
                    <input
                        type="search"
                        placeholder='Search DuckDuckGo or enter a URL'
                        className={styles.search}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                searchWeb();
                            }
                        }}
                        onChange={(e) => setSearchVal(() => e.target.value)}
                    />
                    <div className={`${styles.imageBox} ${hoveringSearch ? styles.imageBoxHovering : styles.nothing}`} title='search' onClick={searchWeb}>
                        <img src={SearchImage} className={styles.searchImage} />
                    </div>
                </div>
                <hr className={styles.hr} />
                <Bookmarks addModal={addModal} setAddModal={setAddModal} />
            </div>

            <div className={styles.footer} onClick={() => {
                closeEdit();
                setGadgetsOpen(false);
            }} >
                <div className={styles.themeChange} title="Change theme" onClick={changeTheme}>Theme</div>
                <label className={styles.fileText}>
                    Background Image
                    <input type='file' accept="image/*" title='Change background image' className={styles.inputFile} onChange={backgroundSet} />
                </label>
            </div>
            {
                addModal ? <div className={styles.addModalOverlay} onClick={() => setAddModal(false)} /> : <></>
            }
        </div>
    )
}

export default Home;