var Flow;

(function (exports) {
    if (typeof module !== "undefined" && module.exports) {
        module.exports = exports; // CommonJS
    } else if (typeof define === "function") {
        define(exports); // AMD
    } else {
        Flow = exports; // <script>
    }
}((function () {
    function Flow() {
        this.name = "flow.js";
        this.version = "1.0.0";
        this.stack = [];
        this.count = 0;
    }

    Flow.prototype.par = function (callback, n) {
        var current = this.stack.length - 1;

        if (current < 1 || typeof this.stack[current] === 'function') {
            this.stack.push([callback]);
        } else {
            this.stack[current].push(callback);
        }
    };

    Flow.prototype.seq = function (callback) {
        this.stack.push(callback);
    };

    Flow.prototype.call = function (flow, callback) {
        callback(function () {
            flow.next();
        });
    };

    Flow.prototype.next = function () {
        this.count--;

        if (this.count < 1) {
            var callbacks = this.stack.shift();

            if (callbacks) {
                if (typeof callbacks === 'function') {
                    this.call(this, callbacks);
                } else {
                    this.count = callbacks.length;

                    for (var i = 0; i < callbacks.length; i++) {
                        this.call(this, callbacks[i]);
                    }
                }
            }
        }
    };

    return Flow;

}())));
