const ONESIGNAL_APP_ID = "bb81bc47-839a-49ef-91a8-162dd9cc69f8";
const ONE_SIGNAL_API_KEY = "os_v2_app_xoa3yr4dtje67enicyw5ttdj7b3z5rbsn4rejsn3oj7icyjyevxcwrd2fxzbdxolktmyyxrzxw3bsya7azlrqdsucd5uctdl4yfhxdi";

async function sendPushNotification(rawMaterials) {
    const url = 'https://api.onesignal.com/notifications?c=push';
    const options = {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            'Content-Type': 'application/json',
            'Authorization': `Key ${ONE_SIGNAL_API_KEY}`
        },
        body: JSON.stringify({
            app_id: ONESIGNAL_APP_ID,
            included_segments: ["All"],
            "android_channel_id": "8604d26a-6455-4420-acd1-58b97ecadc5f",
            headings: {
                "en": "Hammadde Talep İsteği"
            },
            contents: {
                "en": "Hammadde talep isteğinde bulunduldu, görüntülemek için tıklayınız."
            },
            data: {
                "raw_materials": rawMaterials
            }
        })
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return data;
}


export default {
    sendPushNotification
}