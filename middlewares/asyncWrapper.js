const asyncWrapper = (fn) => {
    try {
        return async (req, res, next) => {
            fn(req, res, next).catch(next)
        }
    } catch (error) {
        console.log("asyncWrapper");
        console.log(error);
    }
}
module.exports = asyncWrapper