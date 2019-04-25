
const measure = (exec) => {
    const start = process.hrtime.bigint();
    exec();
    const end = process.hrtime.bigint();
    const executionTime = (end - start); //convert to ms
    console.log('Execution time (hr): %sns', executionTime);
    return executionTime.toString();
}

module.exports = {
    measure,
};