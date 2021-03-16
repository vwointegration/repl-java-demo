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

function trackCampaign(destroyFeedback) {
    if (history.pushState) {
        let track = {};
        track["userId"] = document.getElementById('user-id').value;
        track["camapignKey"] = document.getElementById('campaign-key').value;
        track["goalIdentifier"] = document.getElementById('goal-identifier').value;

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
                    console.log(track)
                }
            },
        })
    }
}

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

    // $('#user-id').on('keyup', ev => {
    //     $('#activate-code').html(`vwoInstance.activate(campaignKey, '${ev.target.value}');`);
    // })
    // $('#campaign-key').on('keyup', ev => {
    //     $('#activate-code').html(`vwoInstance.activate('${ev.target.value}, 'userId');`);
    // })

    if (document.getElementById('user-id')) {
        document.getElementById('user-id').value = getUserId();
    }

    window.fetchSettings = function fetchSettings(destroyFeedback) {
        let settings = {}
        settings["accountId"] = document.getElementById('account-id').value;
        settings["apiKey"] = document.getElementById('sdk-key').value;

        $.ajax({
            type: "POST",
            contentType: "application/json",
            url: "/get/settings",
            data: JSON.stringify(settings),
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: function (data) {
                document.getElementById('sdk-settings').innerHTML = util.prettyPrint(data, null, 2);
                destroyFeedback(true);
            },
            error: function (data) {
                document.getElementById('sdk-settings').innerHTML = util.prettyPrint(data, null, 2);
                destroyFeedback(true);
            }
        })
    }

    window.initVWOSDK = function (destroyFeedback) {
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/launch",
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: function (data) {
                console.log("init data is ", data);
                const capList = data.capList || [];
                let html = '';

                (capList || []).forEach(function(cap) {
                    let starsHtml = '';

                    for (let j = 0; j < cap.stars; j++) {
                        starsHtml += `<span class="material-icons add-to-cart">star_rate</span>`;
                    }
                    html += `<div class="product-item product-item" onclick="trackCampaign();">
              <img src="${cap.src}">
              <div class="product-name">${cap.name}</div>
              <div class="product-price-box">
                ${starsHtml}
                <strong class="product-price">${cap.price}</strong>
              </div>
            </div>`
                });

                document.getElementById('product-list111').innerHTML = html;

                destroyFeedback(true);
            }
        })
    }

    // window.trackCamp

    window.activateCampaign = function activateCampaign(destroyFeedback) {
        if (history.pushState) {
            let userId = document.getElementById('user-id').value;
            let campaignKey = document.getElementById('campaign-key').value;

            // let newurl = window.location.protocol + '//' + window.location.host + window.location.pathname + `?userId=${userId}`;

            // window.history.pushState({path:newurl},'',newurl);
            let activate = {}
            activate["campaignKey"] = campaignKey
            activate["userId"] = userId

            $.ajax({
                type: "POST",
                contentType: "application/json",
                url: "/activate",
                data: JSON.stringify(activate),
                dataType: 'json',
                cache: false,
                timeout: 600000,
                success: function (data) {
                    {
                        console.log(data);
                        let variation = data.variationName;
                        let html = '';
                        let productRecommendations = data.recommendations || [];
                        (productRecommendations || []).forEach(function(recommendation) {
                            let starsHtml = '';

                            for (let j = 0; j < recommendation.stars; j++) {
                                starsHtml += `<span class="material-icons add-to-cart">star_rate</span>`;
                            }
                            html += `<div class="product-item product-item--one" data-feedback="trackCampaign">
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
              ${userId + (data.variationName ? ' becomes ' : ' does not become ') + 'part of campaign.'}
              <br />
              Serving
              <strong>${variation || 'Control'}</strong>
              for the User ID:
              <strong>${userId}</strong>
            <div>`);

                        destroyFeedback(true);
                    }
                },
            })
        }
    }
});

