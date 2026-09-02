/*
    Copyright 2026 0KIMS association.

    This file is part of ffjavascript.

    ffjavascript is a free software: you can redistribute it and/or
    modify it under the terms of the GNU General Public License as published by the
    Free Software Foundation, either version 3 of the License, or (at your option)
    any later version.

    ffjavascript is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY
    or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License for
    more details.

    You should have received a copy of the GNU General Public License along with
    ffjavascript. If not, see <https://www.gnu.org/licenses/>.
*/

// Node implementation of the browser Worker API surface threadman uses,
// replacing the third-party web-worker package -- the last non-iden3
// runtime dependency in the stack. Only what threadman consumes is
// implemented:
//   new Worker(<base64 data: URL of a classic script referencing `self`>)
//   addEventListener/removeEventListener("message" | "error")  ({data} events)
//   postMessage(value, transferList)
//   terminate()
//   unref()
//
// The worker runs as an eval-mode worker_threads Worker with an explicit
// empty execArgv: unlike web-worker (which re-runs its own module file as
// the thread entry and inherits the parent's execArgv), a hostile or exotic
// parent flag set (e.g. `node --input-type=module -e`) cannot break worker
// bootstrap or alter worker semantics.

import { Worker as NodeThread } from "worker_threads";

// Browser-like `self` for the classic worker script: the script assigns
// self.onmessage and calls self.postMessage(res, transferList).
const BOOTSTRAP = `
const { parentPort } = require("worker_threads");
const self = {
    onmessage: null,
    postMessage(msg, transferList) { parentPort.postMessage(msg, transferList); },
};
parentPort.on("message", (data) => {
    if (typeof self.onmessage === "function") self.onmessage({ data });
});
`;

export default class Worker {
    constructor(url) {
        const m = /^data:.*?;base64,(.*)$/.exec(String(url));
        if (!m) {
            throw new Error("nodeworker: only base64 data: URLs are supported");
        }
        const script = Buffer.from(m[1], "base64").toString("utf8");
        this._worker = new NodeThread(BOOTSTRAP + script, { eval: true, execArgv: [] });
        this._wrapped = new Map(); // original listener -> [event, wrapper]
    }

    addEventListener(type, fn) {
        let wrapper;
        if (type === "message") {
            wrapper = (data) => fn({ data });
            this._worker.on("message", wrapper);
        } else if (type === "error") {
            wrapper = (err) => fn(err);
            this._worker.on("error", wrapper);
        } else {
            return;
        }
        this._wrapped.set(fn, [type, wrapper]);
    }

    removeEventListener(type, fn) {
        const entry = this._wrapped.get(fn);
        if (!entry || entry[0] !== type) return;
        this._worker.off(type, entry[1]);
        this._wrapped.delete(fn);
    }

    postMessage(msg, transferList) {
        this._worker.postMessage(msg, transferList);
    }

    terminate() {
        return this._worker.terminate();
    }

    unref() {
        this._worker.unref();
    }
}
