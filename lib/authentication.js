/*
 * Copyright 2013 The MITRE Corporation, All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this work except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * author Dave Bryson
 *
 */
     
var protocol = require('./protocol'),
    Q = require('q'),
    users = require('./users');
    session = require('./session');

/**
 * Authentication Object
 * @params {Function} authentication function 
 * should be in the form function(obj, callback)
 */
function Authentication(strategy) {
    var caller = strategy || users.authenticateUser;
    if( typeof caller !== 'function' )
        throw new Error("Strategy must be a Function with a Node type callback");
    this.strategy = Q.denodeify(caller);
}

function existingSession(){

}

function newSession() {

}


/**
 * This is called automatically in the proxy
 * Both of these should return {user: user, session: sesson};
 */
Authentication.prototype.authenticate = function(requestObj) {
    // the user sent a session token, try to authenticate it
    if (requestObj.sessionToken)
        return session.get(requestObj)
            .then(users.findUser);

    // the user should have sent a password, try to authenticate it and create a new session
    return this.strategy(requestObj)
        .then(users.findUser)
        .then(session.create);
}


exports.Authentication = Authentication;





