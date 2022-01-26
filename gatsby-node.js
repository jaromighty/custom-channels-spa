const axios = require('axios');

const SONG_NODE_TYPE = `Song`;
const CURRENT_SONG_NODE_TYPE = `CurrentSong`;

exports.sourceNodes = async ({
    actions,
    createContentDigest,
    createNodeId,
    getNodesByType,
}) => {
    const { createNode } = actions
    const fetchCurrent = () => axios.get('https://lambda.customchannels.rocks/nowplaying?url=http://stream.customchannels.net/dev_test_96.mp3');
    const current = await fetchCurrent();
    let currentSong = current.data;

    createNode({
        currentSong,
        id: createNodeId(`${CURRENT_SONG_NODE_TYPE}-1`),
        parent: null,
        children: [],
        internal: {
            type: CURRENT_SONG_NODE_TYPE,
            content: JSON.stringify(currentSong),
            contentDigest: createContentDigest(currentSong)
        }
    });

    const fetchRecentlyPlayed = () => axios.get('https://ensemble.customchannels.net/api/channels/222/recent');
    const res = await fetchRecentlyPlayed();

    // loop through data and create Gatsby nodes
    res.data.data.forEach(song =>
        createNode({
            ...song,
            id: createNodeId(`${SONG_NODE_TYPE}-${song.id}`),
            parent: null,
            children: [],
            internal: {
                type: SONG_NODE_TYPE,
                content: JSON.stringify(song),
                contentDigest: createContentDigest(song),
            },
        })
    )
    return
}