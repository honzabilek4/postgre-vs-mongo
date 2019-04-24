
const measure = (exec) => {
    const start = process.hrtime.bigint();
    exec();
    const end = process.hrtime.bigint();
    const executionTime = (end - start)/1000n; //convert to ms
    console.log('Execution time (hr): %sµs', executionTime);
    return executionTime;
}

module.exports = {
    measure,
};