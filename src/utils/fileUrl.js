const fileUrl = ({ destination, filename }) => {
    const index = destination.indexOf('assets');
    const cutedAsset = destination.substring(index)

    return `static/${cutedAsset}/${filename}`
}

module.exports = fileUrl