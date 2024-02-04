var FCM = require('fcm-node');
var serverKey = 'AAAAjB1Kl40:APA91bEvW7ZlZjdNnsStnppI51vcmBKrklrop_ScUf2LQ98Ub46fv2knO70qdysK5VYdtJynMU8c2mcRH8AD7tApkvkC3-4fz3HAWYsGgwXea40WHJcuBenVUoHSSCti6ZW9zAziGFXx'; //put your server key here
var fcm = new FCM(serverKey);

const SendPushNotificationToMultiple = (tokens, title, body, imageUrl, websiteURL) => {
    var message = {
        registration_ids: tokens,
        notification: {
            title: title,
            body: body,
            icon: imageUrl,
            data: {
                url: websiteURL,
            }
        },
    };
    fcm.send(message, function (err, response) {
        if (err) {
            console.error("Error sending notification:", err);
        } else {
            if (response.failure > 0) {
                console.error("Failed to send notification to some devices:", response.results);
            } else {
                console.log("Successfully sent notifications to all devices.");
            }
        }
    });

};

module.exports = { SendPushNotificationToMultiple };

