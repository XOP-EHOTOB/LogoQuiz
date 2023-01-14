let securityKey = require('../security')
let { app, urlencoded } = require('../app')
let User = require('../../data/User')
let lvls = require('../../data/logo.json')

app.post('/api/restart', async function (req, res) {
    if (securityKey(req) === false) return res.status(401).json({ message: 'Ошибка доступа!' }) 
    let body = urlencoded(req)

    try {
        let user = await User.findOne({ id: +body.viewer_id})
        if (!user) return res.status(401).json({ message: 'Ошибка доступа!' })
    
            user.science = 0
            user.science_use = 0
            user.help = 0
            user.progress = []
            user.lvl = 1
            user.help_limit = 0
            user.reload = true

            await user.save()
    
        res.status(200).json({ user })
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Ошибка сервера!' }) 
    }
});

app.post('/api/get_user', async function (req, res) {
    if (securityKey(req) === false) return res.status(401).json({ message: 'Ошибка доступа!' }) 
    let body = urlencoded(req)

    try {
        let user = await User.findOne({ id: +body.viewer_id})
        if (!user) {
            user = new User({
                id: +body.viewer_id
            })
    
            await user.save()
        }
    
        res.status(200).json({ user })
    } catch (e) {
        console.log(e);
        res.status(500).json({ message: 'Ошибка сервера!' }) 
    }
});

app.post('/api/set_settings', async function (req, res) {
    if (securityKey(req) === false) return res.status(401).json({ message: 'Ошибка доступа!' }) 
    let body = urlencoded(req)

    let user = await User.findOne({ id: +body.viewer_id})
    if (!user) return res.status(401).json({ message: 'Ошибка доступа!' })
    
    if (req.body.id != 'vibration' && req.body.id != 'sound') return res.status(401).json({ message: 'Ошибка доступа!' })

    user[req.body.id] = req.body.status
    await user.save()

    res.status(200).json({ user })
});


app.post('/api/get_friends', async function (req, res) {
    if (securityKey(req) === false) return res.status(401).json({ message: 'Ошибка доступа!' }) 
    let body = urlencoded(req)

    let user = await User.findOne({ id: +body.viewer_id})
    if (!user) return res.status(401).json({ message: 'Ошибка доступа!' })
    
    let friends = []

    let ids = []
    req.body.friends.map(x => {
        ids.push(x.id)
    })

    let friend = await User.find({id: { $in: ids} })
    
    friend.map(x => {
            let stars = 0

            x.progress.map(x => {
                let LVL = lvls.find(s => s.id === x)
                stars += LVL.stars
            })

            friends.push({
                id: x.id,
                stars: x.stars,
                science: x.science,
                science_use: x.science_use,
                progress: x.progress.length,
                lvl: x.lvl,
                date: x.date,
                stars
            })
    })

    res.status(200).json({ friends })
});