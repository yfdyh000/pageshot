const { Cu } = require('chrome');
const ss = require("sdk/simple-storage");
const { prefs } = require("sdk/simple-prefs");
const { uuid } = require('sdk/util/uuid');
const { Request } = require("sdk/request");
const { watchFunction, watchPromise } = require("./errors");
const { URL } = require('sdk/url');
const { FxAccountsOAuthClient } = Cu.import("resource://gre/modules/FxAccountsOAuthClient.jsm", {});
const { FxAccountsProfileClient } = Cu.import("resource://gre/modules/FxAccountsProfileClient.jsm", {});
const { deviceInfo } = require('./deviceinfo');
const { hasCookieForBackend } = require("./get-cookies");

let initialized = false;
let sentryPublicDSN = "https://d58fc53f92cd47bba7266ad6444514d8@sentry.prod.mozaws.net/74";

function getDeviceIdInfo() {
  let info = prefs.deviceIdInfo || "null";
  try {
    return JSON.parse(info) || {};
  } catch (e) {
    console.error("Error: could not parse deviceIdInfo:", info);
    return {};
  }
}

exports.getDeviceIdInfo = getDeviceIdInfo;

function setDeviceIdInfo(info) {
  prefs.deviceIdInfo = JSON.stringify(info);
}


exports.getSentryPublicDSN = function() {
  return sentryPublicDSN;
};

exports.deleteEverything = function () {
  let backend = require("./main").getBackend();
  setDeviceIdInfo(null);
  require("./shotstore").deleteEverything();
  // Once we have deleted everything associated with the old account,
  // we need to re-initialize to give us a new random deviceId, otherwise
  // we get errors once the shot panel is accessed.
  exports.initialize(backend);
};

exports.isInitialized = function () {
  return initialized && hasCookieForBackend(require("./main").getBackend());
};

let cachedBackend, cachedReason; // eslint-disable-line no-unused-vars

exports.initialize = function (backend, reason) {
  // This lets us retry initialize() with no parameters later if necessary:
  cachedBackend = backend = backend || cachedBackend;
  cachedReason = reason = reason || cachedReason;
  let deviceIdInfo = getDeviceIdInfo();
  return new Promise((resolve, reject) => {
    if (! (deviceIdInfo && deviceIdInfo.deviceId && deviceIdInfo.secret)) {
      let newInfo = {
        deviceId: "anon" + makeUuid() + "",
        secret: makeUuid()+"",
        reason,
        deviceInfo: JSON.stringify(deviceInfo())
      };
      console.info("Generating new device authentication ID", newInfo.deviceId);
      watchPromise(saveLogin(backend, newInfo).then(function () {
        setDeviceIdInfo(newInfo);
        console.info("Successfully saved ID");
        resolve();
      })).catch((error) => {
        reject(error);
      });
    } else {
      let loginUrl = backend + "/api/login";
      Request({
        url: loginUrl,
        contentType: "application/x-www-form-urlencoded",
        content: {
          deviceId: deviceIdInfo.deviceId,
          secret: deviceIdInfo.secret,
          reason,
          deviceInfo: JSON.stringify(deviceInfo())
        },
        onComplete: watchFunction(function (response) {
          if (response.status == 404) {
            // Need to save login anyway...
            console.info(`Login to ${loginUrl} failed with 404, trying to register`);
            watchPromise(saveLogin(backend, deviceIdInfo)).then(
              () => {
                resolve();
              },
              (error) => {
                reject(error);
              });
            return;
          } else if (response.status >= 300) {
            let error = new Error(`Could not log in: ${response.status} ${response.statusText}`);
            error.popupMessage = "LOGIN_ERROR";
            console.error("Error logging in:", response.status, response.statusText, response.text);
            reject(error);
            return;
          } else if (response.status === 0) {
            let error = new Error("Could not log in, server unavailable");
            error.popupMessage = "LOGIN_CONNECTION_ERROR";
            reject(error);
            return;
          }
          initialized = true;
          console.info("logged in with cookie:", !!response.headers["Set-Cookie"]);
          try {
            sentryPublicDSN = response.json.sentryPublicDSN;
            console.info("got sentry DSN response from server");
          } catch (e) {
            console.error("Error looking for the sentry DSN", e);
          }
          // The only other thing we do is preload the cookies
          resolve();
        })
      }).post();
    }
  });
};

function saveLogin(backend, info) {
  let registerUrl = backend + "/api/register";
  return new Promise(function (resolve, reject) {
    Request({
      url: registerUrl,
      contentType: "application/x-www-form-urlencoded",
      content: info,
      onComplete: function (response) {
        if (response.status == 200) {
          console.info("Registered login with cookie:", !!response.headers["Set-Cookie"]);
          initialized = true;
          resolve();
        } else {
          console.error("Error registering:", response.status, response.statusText, response.text);
          reject(new Error("Bad response: " + response.status + " " + response.statusText));
        }
      }
    }).post();
  });
}

function makeUuid() {
  let s = uuid() + "";
  return s.replace(/\{/g, "").replace(/\}/g, "");
}

// Serializes profile updates to ensure that concurrent writes don't clobber
// one another (e.g., if a user updates her avatar, then immediately changes
// her nickname).
let pendingProfileUpdates = Promise.resolve();
function enqueueProfileUpdate(func) {
  let result = pendingProfileUpdates.then(func);
  // Swallow rejections to avoid deadlocking queued updates. Since we return
  // the promise, callers can still handle rejections.
  pendingProfileUpdates = result.catch(() => {});
  return result;
}

exports.setDefaultProfileInfo = function (attrs) {
  return enqueueProfileUpdate(() => {
    if (! attrs) {
      throw new Error("Missing default profile information");
    }
    let info = ss.storage.profileInfo || {};
    for (let attr of Object.keys(attrs)) {
      // Only update the attribute if the user hasn't already set a value.
      if (! info[attr]) {
        info[attr] = attrs[attr];
      }
    }
    ss.storage.profileInfo = info;
    return info;
  });
};

function updateLocalProfileInfo(attrs) {
  let info = Object.assign(ss.storage.profileInfo || {}, attrs);
  ss.storage.profileInfo = info;
  return info;
}

exports.getProfileInfo = function () {
  return enqueueProfileUpdate(() => {
    return ss.storage.profileInfo;
  });
};

exports.updateProfile = function (backend, info) {
  return enqueueProfileUpdate(() => {
    if (! info) {
      throw new Error("Missing updated profile information");
    }
    let updateUrl = backend + "/api/update";
    return new Promise((resolve, reject) => {
      Request({
        url: updateUrl,
        contentType: "application/json",
        content: JSON.stringify(info),
        onComplete: function (response) {
          if (response.status >= 200 && response.status < 300) {
            // Update stored profile info.
            let newInfo = updateLocalProfileInfo(info);
            resolve(newInfo);
          } else {
            reject(response.json);
          }
        }
      }).post();
    });
  });
};

exports.OAuthHandler = class OAuthHandler {
  constructor(backend) {
    this.backend = backend;
    this.withParams = null;
    this.withProfile = new Promise((resolve, reject) => {
      this.profileDeferred = { resolve, reject };
    });
  }

  getProfileInfo() {
    return this.withProfile.then(client => {
      return client.fetchProfile();
    });
  }

  getOAuthParams() {
    if (this.withParams) {
      return this.withParams;
    }
    this.withParams = new Promise((resolve, reject) => {
      let url = new URL("/api/fxa-oauth/params", this.backend);
      Request({
        url,
        onComplete: response => {
          let { json } = response;
          if (response.status >= 200 && response.status < 300) {
            resolve(json);
            return;
          }
          let err = new Error("Error fetching OAuth params");
          err.status = response.status;
          err.json = json;
          reject(err);
        }
      }).get();
    });
    return this.withParams;
  }

  tradeCode(tokenData) {
    return new Promise((resolve, reject) => {
      let url = new URL("/api/fxa-oauth/token", this.backend);
      Request({
        url,
        content: tokenData,
        onComplete: response => {
          let { json } = response;
          if (response.status >= 200 && response.status < 300) {
            resolve(json);
            return;
          }
          let err = new Error("Error trading OAuth code");
          err.status = response.status;
          err.json = json;
          reject(err);
        }
      }).post();
    });
  }

  logInWithParams(parameters) {
    return new Promise((resolve, reject) => {
      let client = new FxAccountsOAuthClient({ parameters });
      client.onComplete = resolve;
      client.onError = reject;
      client.launchWebFlow();
    }).then(tokenData => {
      return this.tradeCode(tokenData);
    }).then(response => {
      this.profileDeferred.resolve(new FxAccountsProfileClient({
        serverURL: parameters.profile_uri,
        token: response.access_token
      }));
      return response;
    });
  }
};
