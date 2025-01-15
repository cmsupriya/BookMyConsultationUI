const baseApiURL = "http://localhost:8080/";

export const doRegister = (emailId, password, firstName, lastName, mobile) => {
    let promiseResolveRef = null;
    let promiseRejectRef = null;
    let promise = new Promise((resolve, reject) => {
        promiseResolveRef = resolve;
        promiseRejectRef = reject;
    });
    fetch(baseApiURL + 'users/register', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ emailId, password, firstName, lastName, mobile })
    }).then((response) => {
        if (response.ok) {
            promiseResolveRef({
                json: response.json()
            });
        } else {
            promiseRejectRef({
                reason: "Bad Credentials. Please try again.",
                response: response,
            });
        }
    }).catch((err) => {
        promiseRejectRef({
            reason: "Some error occurred. Please try again.",
            response: err,
        });
    });
    return promise;
};

export const doLogin = (email, password) => {
    let promiseResolveRef = null;
    let promiseRejectRef = null;
    let promise = new Promise((resolve, reject) => {
        promiseResolveRef = resolve;
        promiseRejectRef = reject;
    });
    fetch(baseApiURL + 'auth/login', {
        method: "POST",
        headers: {
            "Authorization": "Basic " + btoa(email + ":" + password),
            "Content-Type": "application/json"
        }
    }).then((response) => {
        response.json().then((json) => {
            if (response.ok) {
                promiseResolveRef({
                    userId: json.id,
                    firstName: json.firstName,
                    lastName: json.lastName,
                    username: json.emailAddress,
                    phoneNumber: json.mobilePhoneNumber,
                    lastLoginTime: json.lastLoginTime,
                    accessToken: json.accessToken,
                    accessTokenTimeout: json.expiresAt,
                    response: response
                });
            } else {
                promiseRejectRef({
                    reason: "Bad Credentials. Please try again.",
                    response: response,
                });
            }
        }).catch((error) => {
            promiseRejectRef({
                reason: "Server error occurred. Please try again.",
                response: error,
            });
        });
    }).catch((err) => {
        promiseRejectRef({
            reason: "Some error occurred. Please try again.",
            response: err,
        });
    });
    return promise;
};

export const doLogout = (accessToken) => {
    let promiseResolveRef = null;
    let promiseRejectRef = null;
    let promise = new Promise((resolve, reject) => {
        promiseResolveRef = resolve;
        promiseRejectRef = reject;
    });
    fetch(baseApiURL + 'auth/logout', {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json"
        }
    }).then((response) => {
        if (response.ok) {
            promiseResolveRef({
                response: response
            });
        } else {
            promiseRejectRef({
                reason: "Bad Credentials. Please try again.",
                response: response,
            });
        }
    }).catch((err) => {
        promiseRejectRef({
            reason: "Some error occurred. Please try again.",
            response: err,
        });
    });
    return promise;
};

export const getDoctors = () => {
    let promiseResolveRef = null;
    let promiseRejectRef = null;
    let promise = new Promise((resolve, reject) => {
        promiseResolveRef = resolve;
        promiseRejectRef = reject;
    });
    fetch(baseApiURL + 'doctors')
        .then((response) => {
            response.json().then((json) => {
                if (response.ok) {
                    promiseResolveRef(
                        json
                    );
                } else {
                    promiseRejectRef({
                        reason: "Error fetching doctor details",
                        response: response,
                    });
                }
            }).catch((error) => {
                promiseRejectRef({
                    reason: "Error fetching doctor details",
                    response: error,
                });
            });
        }).catch((err) => {
            promiseRejectRef({
                reason: "Error fetching doctor details",
                response: err,
            });
        });
    return promise;
};

export const getDoctor = (id) => {
    let promiseResolveRef = null;
    let promiseRejectRef = null;
    let promise = new Promise((resolve, reject) => {
        promiseResolveRef = resolve;
        promiseRejectRef = reject;
    });
    fetch(baseApiURL + 'doctors/' + id)
        .then((response) => {
            response.json().then((json) => {
                if (response.ok) {
                    promiseResolveRef(
                        json
                    );
                } else {
                    promiseRejectRef({
                        reason: "Error fetching doctor details",
                        response: response,
                    });
                }
            }).catch((error) => {
                promiseRejectRef({
                    reason: "Error fetching doctor details",
                    response: error,
                });
            });
        }).catch((err) => {
            promiseRejectRef({
                reason: "Error fetching doctor details",
                response: err,
            });
        });
    return promise;
};

export const getTimeSlots = (doctorId, date) => {
    let promiseResolveRef = null;
    let promiseRejectRef = null;
    let promise = new Promise((resolve, reject) => {
        promiseResolveRef = resolve;
        promiseRejectRef = reject;
    });
    fetch(baseApiURL + 'doctors/' + doctorId + '/timeSlots?date=' + date)
        .then((response) => {
            response.json().then((json) => {
                if (response.ok) {
                    promiseResolveRef(
                        json
                    );
                } else {
                    promiseRejectRef({
                        reason: "Error fetching doctor details",
                        response: response,
                    });
                }
            }).catch((error) => {
                promiseRejectRef({
                    reason: "Error fetching doctor details",
                    response: error,
                });
            });
        }).catch((err) => {
            promiseRejectRef({
                reason: "Error fetching doctor details",
                response: err,
            });
        });
    return promise;
};

export const doBookAppointment = (accessToken, appointment) => {
    let promiseResolveRef = null;
    let promiseRejectRef = null;
    let promise = new Promise((resolve, reject) => {
        promiseResolveRef = resolve;
        promiseRejectRef = reject;
    });
    fetch(baseApiURL + "appointments", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(appointment)
    }).then((response) => {
        if (response.ok) {
            promiseResolveRef({
                json: response.json()
            });
        } else {
            promiseRejectRef({
                reason: "Either the slot is already booked or not available",
                response: response,
            });
        }
    }).catch((err) => {
        promiseRejectRef({
            reason: "Error booking appointments",
            response: err,
        });
    });
    return promise;
}

export const getAppointments = (userId, accessToken) => {
    let promiseResolveRef = null;
    let promiseRejectRef = null;
    let promise = new Promise((resolve, reject) => {
        promiseResolveRef = resolve;
        promiseRejectRef = reject;
    });
    fetch(baseApiURL + "users/" + userId + "/appointments", {
        headers: {
            "Authorization": "Bearer " + accessToken
        }
    })
        .then((response) => {
            response.json().then((json) => {
                if (response.ok) {
                    promiseResolveRef(
                        json
                    );
                } else {
                    promiseRejectRef({
                        reason: "Error fetching appointments",
                        response: response,
                    });
                }
            }).catch((error) => {
                promiseRejectRef({
                    reason: "Error fetching appointments",
                    response: error,
                });
            });
        }).catch((err) => {
            promiseRejectRef({
                reason: "Error fetching appointments",
                response: err,
            });
        });
    return promise;
}

export const doRateAppointment = (accessToken, rating) => {
    let promiseResolveRef = null;
    let promiseRejectRef = null;
    let promise = new Promise((resolve, reject) => {
        promiseResolveRef = resolve;
        promiseRejectRef = reject;
    });
    fetch(baseApiURL + "ratings", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + accessToken,
            "Content-Type": "application/json"
        },
        body: JSON.stringify(rating)
    })
        .then((response) => {
            response.json().then((json) => {
                if (response.ok) {
                    promiseResolveRef(
                        json
                    );
                } else {
                    promiseRejectRef({
                        reason: "Error fetching appointments",
                        response: response,
                    });
                }
            }).catch((error) => {
                promiseRejectRef({
                    reason: "Error fetching appointments",
                    response: error,
                });
            });
        }).catch((err) => {
            promiseRejectRef({
                reason: "Error fetching appointments",
                response: err,
            });
        });
    return promise;
}
