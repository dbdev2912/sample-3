const id = () => {
    return 'id' + (new Date()).getTime();
}

module.exports = {
    autoID: id
}