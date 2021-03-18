const capList = [{
    name: 'Cap XLV',
    src: '/images/cap.svg',
    price: '$8.25',
    stars: 3
}, {
    name: 'Cap VIII',
    src: '/images/cap1.svg',
    price: '$11.00',
    stars: 5
}, {
    name: 'Cap XC',
    src: '/images/cap3.svg',
    price: '$10.50',
    stars: 2
}, {
    name: 'Cap LV',
    src: '/images/cap2.svg',
    price: '$7.75',
    stars: 4
}, {
    name: 'Cap XLV',
    src: '/images/cap4.svg',
    price: '$12.15',
    stars: 5
}, {
    name: 'Cap XLV',
    src: '/images/cap5.svg',
    price: '$5.55',
    stars: 3
}];

const recommendations =  [{
    name: 'Cap VI',
    src: '/images/cap.svg',
    price: '$10.22',
    stars: 3
}, {
    name: 'Cap XXII',
    src: '/images/cap1.svg',
    price: '$8.98',
    stars: 4
}];

const util = {
    _replacer: function _replacer(match, pIndent, pKey, pVal, pEnd) {
        let key = '<span class=json-key>';
        let val = '<span class=json-value>';
        let str = '<span class=json-string>';
        let r = pIndent || '';

        if (pKey) {
            r = r + key + pKey.replace(/[": ]/g, '') + '</span>: ';
        }
        if (pVal) {
            r = r + (pVal[0] === '"' ? str : val) + pVal + '</span>';
        }

        return r + (pEnd || '');
    },

    prettyPrint: function prettyPrint(obj) {
        var jsonLine = /^( *)("[\w]+": )?("[^"]*"|[\w.+-]*)?([,[{])?$/gm;

        return JSON.stringify(obj, null, 3)
            .replace(/&/g, '&amp;')
            .replace(/\\"/g, '&quot;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(jsonLine, util._replacer);
    }
}

var settingsFile;
var vwoInstance;

$(document).ready(() => {
    var stepper = document.querySelector('.stepper');
    var stepperInstace = new MStepper(stepper, {
        // options
        firstActive: 0 // this is the default
    });

    function getUserId() {
        const urlParams = new URLSearchParams(window.location.search);

        return urlParams.get('userId');
    }

    if (document.getElementById('user-id')) {
        document.getElementById('user-id').value = getUserId();
    }

    window.fetchSettings = function fetchSettings(destroyFeedback) {


        vwoSdk.getSettingsFile(document.getElementById('account-id').value, document.getElementById('sdk-key').value).then(response => {
            console.log("vwo sdk fetch response", response);
            settingsFile = response;
            document.getElementById('sdk-settings').innerHTML = util.prettyPrint(response, null, 2);
            destroyFeedback(true);
        })
        // $.ajax({
        //     type: "POST",
        //     contentType: "application/json",
        //     url: "/get/settings",
        //     data: JSON.stringify(settings),
        //     dataType: 'json',
        //     cache: false,
        //     timeout: 600000,
        //     success: function (data) {
        //         document.getElementById('sdk-settings').innerHTML = util.prettyPrint(data, null, 2);
        //         destroyFeedback(true);
        //     },
        //     error: function (data) {
        //         document.getElementById('sdk-settings').innerHTML = util.prettyPrint(data, null, 2);
        //         destroyFeedback(true);
        //     }
        // })
    }

    window.initVWOSDK = function (destroyFeedback) {
        //launch the VWO from javascript SDK
        vwoInstance = vwoSdk.launch({
            settingsFile: settingsFile
        });
        console.log("VWO launched from JavaScript SDK9")
        if(vwoInstance != null) {
            processInitResponse(capList)
        }

        // launch the VWO from JAVA SDK
        let settings = {}
        settings["accountId"] = document.getElementById('account-id').value;
        settings["apiKey"] = document.getElementById('sdk-key').value;
        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/launch",
            dataType: 'json',
            data: JSON.stringify(settings),
            cache: false,
            timeout: 600000,
            success: function (data) {
                {
                    console.log("VWO launched from JAVA SDK")
                }
            }
        });

        destroyFeedback(true);

    }

    // window.trackCamp
    window.addEventListener('click', (ev) => {
        if (ev.target.parentElement.classList.contains('product-item')) {
            let userId = document.getElementById('user-id').value;
            let campaignKey = document.getElementById('campaign-key').value;
            let goalIdentifier = document.getElementById('goal-identifier').value;

            if (goalIdentifier) {
                let track = {};
                track["userId"] = userId
                track["campaignKey"] = campaignKey
                track["goalIdentifier"] = goalIdentifier

                $.ajax({
                    type: "POST",
                    contentType: "application/json",
                    url: "/track",
                    data: JSON.stringify(track),
                    dataType: 'json',
                    cache: false,
                    timeout: 600000,
                    success: function (data) {
                        {
                            alert(data.msg);
                        }
                    },
                })
            }
        }
    });

    window.activateCampaign = function activateCampaign(destroyFeedback) {
        if (history.pushState) {
            let userId = document.getElementById('user-id').value;
            let campaignKey = document.getElementById('campaign-key').value;

            // let newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + `?userId=${userId}`;

            // window.history.pushState({path:newurl},'',newurl);

            var variationName = vwoInstance.activate(campaignKey, userId);
            if(variationName !== null) {
                console.log(variationName);
                let variation = variationName;
                let html = '';
                let productRecommendations = variationName !== "Control" ? recommendations : [];
                (productRecommendations || []).forEach(function (recommendation) {
                    let starsHtml = '';

                    for (let j = 0; j < recommendation.stars; j++) {
                        starsHtml += `<span class="material-icons add-to-cart">star_rate</span>`;
                    }
                    html += `<div class="product-item product-item--one">
              <img src="${recommendation.src}">
              <div class="product-name">${recommendation.name}</div>
              <div class="product-price-box">
                ${starsHtml}
                <strong class="product-price">${recommendation.price}</strong>
              </div>
            </div>`
                });

                if (productRecommendations.length) {
                    document.getElementById('product-recommendations').classList.remove('hide');
                    document.getElementById('product-list').classList.remove('s12');
                    document.getElementById('product-list').classList.add('s9');
                    document.getElementById('recommendations').innerHTML = html;
                    document.getElementById('product-recommendations').classList.add('s3');
                } else {
                    document.getElementById('product-recommendations').classList.add('hide');
                    document.getElementById('product-list').classList.remove('s9');
                    document.getElementById('product-list').classList.add('s12');
                }


                $('#sdk-result').html(`
            <span class="material-icons info-icon">info</span>
            <div style="margin-left: 50px;">
              <strong>${userId}</strong> ${(variationName ? ' becomes ' : ' does not become ') + `part of the campaign: <strong>${campaignKey}</strong>`}
              <br />
              Serving
              <strong>${variation || 'Control'}</strong>
              for the User ID:
              <strong>${userId}</strong>
            <div>`);

                destroyFeedback(true);
            }
            let activate = {}
            activate["campaignKey"] = campaignKey
            activate["userId"] = userId

            // $.ajax({
            //     type: "POST",
            //     contentType: "application/json",
            //     url: "/activate",
            //     data: JSON.stringify(activate),
            //     dataType: 'json',
            //     cache: false,
            //     timeout: 600000,
            //     success: function (data) {
            //         {
            //
            //         }
            //     },
            // })
        }
    }
});

function processInitResponse(data) {
    console.log("init data is ", data);
    const capList = data || [];
    let html = '';

    (capList || []).forEach(function (cap) {
        let starsHtml = '';

        for (let j = 0; j < cap.stars; j++) {
            starsHtml += `<span class="material-icons add-to-cart">star_rate</span>`;
        }
        html += `<div class="product-item">
              <img src="${cap.src}">
              <div class="product-name">${cap.name}</div>
              <div class="product-price-box">
                ${starsHtml}
                <strong class="product-price">${cap.price}</strong>
              </div>
            </div>`
    });

    document.getElementById('product-list111').innerHTML = html;

}

