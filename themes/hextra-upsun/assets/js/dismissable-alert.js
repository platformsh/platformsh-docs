(() => {
    'use strict';

    // Check if alert has been closed, and set data-global-alert to closed
    // Object.keys(localStorage).forEach(function (key) {
    //     if (/^global-alert-/.test(key)) {
    //         document.documentElement.setAttribute('data-global-alert', 'closed');
    //     }
    // });

    // Enable alert closing, on DOMContentLoaded
    window.addEventListener('DOMContentLoaded', () => {
        var announcement = document.getElementById('announcement');
        // console.log("page has been loaded");

        if (announcement !== null) {
            var id = announcement.dataset.id;

            if (Object.keys(localStorage).includes(id)) {
                console.log("Announcement closed.");
                // announcement.classList.add("announcement-container-show");
            } else {
                // console.log("No. Adding display class.");
                // localStorage.setItem(id, 'closed');
                announcement.classList.add("announcement-container-show");
                // hx-block
            }

            // console.log(id);
            // console.log(localStorage);

            Object.keys(localStorage).forEach(function (key) {
                // console.log(key);
                if (/^global-alert-/.test(key)) {
                    if (key !== id) {
                        localStorage.removeItem(key);
                        // document.documentElement.removeAttribute('data-global-alert');
                    }
                }
            });
        }

        // if (announcement !== null) {
        //     var id = announcement.dataset.id;
        //     console.log(id);
        //     console.log(localStorage);
        //     // localStorage.setItem(id, 'closed');
        //     Object.keys(localStorage).forEach(function (key) {
        //         console.log(key);
        //         if (/^global-alert-/.test(key)) {
        //             if (key !== id) {
        //                 localStorage.removeItem(key);
        //                 document.documentElement.removeAttribute('data-global-alert');
        //             }
        //         }
        //     });

        //     announcement.addEventListener('closed.bs.alert', () => {
        //         localStorage.setItem(id, 'closed');
        //     });
        // }
    });
})();



function closeAnnouncement() {
    console.log("Close it already!");
    var announcement = document.getElementById('announcement');
    // console.log(announcement);
    if (announcement !== null) {
        var id = announcement.dataset.id;
        // console.log(id);
        // console.log(localStorage);
        localStorage.setItem(id, 'closed');
        // console.log(localStorage);
        // announcement.setAttribute('data-global-alert', 'closed');
        // announcement.classList.add("hx-hidden");

        console.log(Object.keys(localStorage));

        if (Object.keys(localStorage).includes(id)) {
            // console.log("id has been set to close");
            announcement.classList.remove("announcement-container-show");
        } else {
            console.log("Announcement shown.");
        }

    }


    // Object.keys(localStorage).forEach(function (key) {
    //     if (/^global-alert-/.test(key)) {
    //         // document.documentElement.setAttribute('data-global-alert', 'closed');
    //         console.log("id has been set to close");
    //     } else {
    //         console.log("announcement has not yet been closed");
    //     }
    // });
}