
module.exports = errorHandler;

function errorHandler(err, req, res, next) {

    if (err instanceof ReferenceError) {
        console.log(err, "err err err err")
        // custom application error
        return res.status(400).json({ status: "error", message: "ReferenceError" });
    }

    if (err instanceof TypeError) {
        console.log(err, "TypeError")
        // custom application error
        return res.status(400).json({ status: "error", message: "ReferenceError" });
    }

    if (typeof (err) === 'string') {
        // custom application error
        return res.status(400).json({ status: "error", message: err });
    }

    if (typeof (err) === 'object') {
        // custom application error
        return res.status(400).json({ status: "error", message: err });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).json({ status: "error", message: err.message });
    }

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ status: "error", message: 'Invalid Token' });
    }

    // default to 500 server error
    return res.status(500).json({ status: "error", message: err.message });
}