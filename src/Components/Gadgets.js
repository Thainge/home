import react, { useEffect, useRef, useState } from 'react';
import styles from './Gadgets.module.css';
import { Sortable } from '@shopify/draggable';
import localStorage from 'local-storage';

const maps = require('../Assets/maps.png');
const youtube = require('../Assets/youtube.png');
const store = require('../Assets/store.png');
const mail = require('../Assets/mail.png');
const contact = require('../Assets/contact.png');
const drive = require('../Assets/drive.png');
const calendar = require('../Assets/calendar.png');
const translate = require('../Assets/translate.png');
const photos = require('../Assets/photos.png');
const voice = require('../Assets/voice.png');
const chat = require('../Assets/chat.png');
const docs = require('../Assets/docs.png');
const sheets = require('../Assets/sheets.png');
const presentation = require('../Assets/presentation.png');

const defaultGadgets = [
    {
        title: 'Maps',
        link: 'https://www.google.com/maps/@35.1941278,-78.8722335,15z?hl=en&authuser=0',
        image: maps
    },
    {
        title: 'Youtube',
        link: 'https://www.youtube.com/',
        image: youtube
    },
    {
        title: 'Play',
        link: 'https://play.google.com/store/games?hl=en&pli=1',
        image: store
    },
    {
        title: 'Gmail',
        link: 'https://mail.google.com/mail/u/0/#inbox',
        image: mail
    },
    {
        title: 'Contacts',
        link: 'https://contacts.google.com/?hl=en',
        image: contact
    },
    {
        title: 'Drive',
        link: 'https://drive.google.com/drive/u/0/my-drive',
        image: drive
    },
    {
        title: 'Calendar',
        link: 'https://calendar.google.com/calendar/u/0/r?pli=1',
        image: calendar
    },
    {
        title: 'Translate',
        link: 'https://translate.google.com/?hl=en',
        image: translate
    },
    {
        title: 'Photos',
        link: 'https://photos.google.com/?pageId=none&pli=1',
        image: photos
    },
    {
        title: 'Voice',
        link: 'https://voice.google.com/u/0/calls',
        image: voice
    },
    {
        title: 'Chat',
        link: 'https://mail.google.com/chat/u/0/#chat/welcome',
        image: chat
    },
    {
        title: 'Docs',
        link: 'https://docs.google.com/document/u/0/',
        image: docs
    },
    {
        title: 'Sheets',
        link: 'https://docs.google.com/spreadsheets/u/0/',
        image: sheets
    },
    {
        title: 'Slides',
        link: 'https://docs.google.com/presentation/u/0/',
        image: presentation
    },
]

function Gadgets() {
    const $container = useRef();
    const [firstTime, setFirstTime] = useState(true);

    // Get local storage values
    let gadgetsArr = defaultGadgets;

    const localGadgets = localStorage.get('gadgets');
    if (localGadgets && firstTime) {
        gadgetsArr = localGadgets;
    }

    const [gadgetsDom] = useState(gadgetsArr);
    const [arr, setArr] = useState(gadgetsArr)

    useEffect(() => {
        if (firstTime) {
            setFirstTime(false);
        }
    }, [])

    useEffect(() => {
        // did mount
        const sort = new Sortable($container.current, {
            draggable: `.${styles.container}`,
        });

        sort.on('sortable:stop', (sortableEvent) => {
            setArr((prev) => {
                let newArr = [...prev];
                let newIndex = sortableEvent.data.newIndex;
                let oldIndex = sortableEvent.data.oldIndex;

                let newItem = newArr[oldIndex];

                // Remove at old index
                newArr.splice(oldIndex, 1)

                // Insert at new index
                newArr.splice(newIndex, 0, newItem);

                // Update Local Storage
                localStorage.set('gadgets', newArr);
                return newArr;
            });
        });

        return () => {
            // did unmount
            sort.destroy();
        };
    }, []);

    return (
        <div className={styles.gadgetsBox}>
            <div className={styles.scroll} ref={$container}>
                {
                    gadgetsDom.map((item, index) => (
                        <a className={styles.container} href={item.link} key={index}>
                            <img src={item.image} className={styles.logo} />
                            <div className={styles.title}>{item.title}</div>
                        </a>
                    ))
                }
            </div>
        </div>
    )
}

export default Gadgets;