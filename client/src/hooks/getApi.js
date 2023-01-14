import bridge from '@vkontakte/vk-bridge'

const getToken = async () => {
    return await bridge.send('VKWebAppGetAuthToken', {
        app_id: 51411277,
        scope: '',
    }) 
}
const getPhotos = async (ids) => {
    const token = await getToken()

    const photos = await bridge.sendPromise('VKWebAppCallAPIMethod', {
        method: 'users.get',
        request_id: '324nnefj',

        params: {
            v: '5.95',
            user_ids: ids,
            fields: 'photo_200',
            access_token: token.access_token,
        },
    })

    return photos
}

export { getPhotos, getToken } 