
module.exports = errorHandler;

function errorHandler(err, req, res, next) {

    if (err.name === 'UnauthorizedError') {
        // jwt authentication error
        return res.status(401).json({ status: "error", message: err });
    }

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
        console.log(err, "object")
        // custom application error
        return res.status(400).json({ status: "error", message: "Something went wrong" });
    }

    if (err.name === 'ValidationError') {
        // mongoose validation error
        return res.status(400).json({ status: "error", message: err.message });
    }


    // default to 500 server error
    return res.status(500).json({ status: "error", message: err.message });
}