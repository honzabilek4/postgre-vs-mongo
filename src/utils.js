
const measure = async (exec) => {
    const start = process.hrtime.bigint();
    await exec();
    const end = process.hrtime.bigint();
    const executionTime = end - start;
    console.log(`Execution time (hr): ${executionTime}ns`);
    return executionTime.toString();
}

module.exports = {
    measure,
};