// Handling errors in async functions in Express.js 
// this means that if an error occurs in the async function, 
// it will be caught and passed to the next middleware (error handler) automatically. 
// This is useful for keeping your code clean and avoiding repetitive try-catch blocks.
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
module.exports = asyncHandler;