let securityKey = require('../security')
let { app, urlencoded } = require('../app')
let User = require('../../data/User')
let Shop = require('../../data/Shop')
let lvls = require('../../data/logo.json')
const prequest = require('prequest')
const md5 = require('md5')
// 20 50 80 100 140 180 .230 .280 .330 .400 .450 .500 .550 600
const LVL = [20, 30, 30, 20, 40, 40, 50, 50, 50, 70, 50, 50, 50, 50]
let LVLS = {'15': 2, '40': 3, '65': 4, '82': 5, '120': 6, '155': 7, '200': 8, '245': 9, '295': 10, '355': 11, '400': 12, '445': 13, '495': 14, '530': 15 }
const WORDS = 'абвгдеёжзийклмнопрстуфхцшщъыьэюя'
const WORDS2 = 'qwertyuiopasdfghjklzxcvbnm'

app.post('/api/get_games', async function (req, res) {
    if (securityKey(req) === false) return res.status(401).json({ message: 'Ошибка доступа!' }) 
    let body = urlencoded(req)
 
        let user = await User.findOne({ id: +body.viewer_id})
        if (!user) return res.status(401).json({ message: 'Ошибка доступа!' }) 

        let _progress = []

        let lvl = 0
        let progress = []

        lvls.map(x => {
            if (user.progress.find(s => s === x.id)) {
                progress.push(x)
            } else {
                progress.push({
                    id: x.id,
                    stars: x.stars
                })
            }

            if (progress.length === LVL[lvl]) {
                _progress.push(progress)
                lvl ++
                progress = []
            }
        })

        res.status(200).json({ progress: _progress })
});

app.post('/api/get_game', async function (req, res) {
    if (securityKey(req) === false) return res.status(401).json({ message: 'Ошибка доступа!' }) 
    let body = urlencoded(req)

    let user = await User.findOne({ id: +body.viewer_id})
    if (!user) return res.status(401).json({ message: 'Ошибка доступа!' }) 

    let lvl = lvls.find(x => x.id === req.body.id)
    if (!lvl) return res.status(401).json({ message: 'Ошибка доступа!' })

    let words = []
    let string = []

    lvl.name.split('').map(x => {
        if (x === ' ') {
            string.push(' ')
        } else if (x === '-') {
            string.push('-')
        } else {
            string.push('0')
            words.push(x)
        }

    })

    if (lvl.lang === 'ru') {
        for (let i = 0; i < 5; i++) {
            words.push(WORDS[Math.round(Math.random() * (WORDS.length - 1))])
        }
    } else {
        for (let i = 0; i < 5; i++) {
            words.push(WORDS2[Math.round(Math.random() * (WORDS2.length - 1))])
        }
    }

    res.status(200).json({ string, words: words.sort(()=> Math.random()-0.5) })
})

app.post('/api/get_result', async function (req, res) {
    let prizes = []
    if (securityKey(req) === false) return res.status(401).json({ message: 'Ошибка доступа!' }) 
    let body = urlencoded(req)

    let user = await User.findOne({ id: +body.viewer_id})
    if (!user) return res.status(401).json({ message: 'Ошибка доступа!' }) 

    let lvl = lvls.find(x => x.id === req.body.id)
    if (!lvl) return res.status(401).json({ message: 'Ошибка доступа!' })
    if (user.progress.find(x => x === lvl.id)) return res.status(401).json({ message: 'Ошибка доступа!' })
    if (lvl.name.toLowerCase() === req.body.name.toLowerCase()) {
        user.progress.push(req.body.id)
        user.markModified('progress');

        if (!user.help.find(x => x.type === 'full' && x.id === req.body.id)) {
            user.science += 1
        }
        
        if (LVLS[`${user.progress.length}`]) {
            user.lvl = LVLS[`${user.progress.length}`]
            prizes.push({
                message: `Вы достигли уровня: ${user.lvl}! Для вас доступны новые задания`
            })

            try {
                let req = await prequest({
                    method: 'POST',
                    url: `https://api.vk.com/method/secure.addAppEvent?user_id=${user.id}&activity_id=1&value=${user.lvl}&access_token=${process.env.SERVICE_KEY}&v=5.131`,
                    body: {
                        user_id: user.id,
                        activity_id: 1,
                        value: user.lvl,
                        access_token: process.env.SERVICE_KEY
                    },
                })

                console.log(req);
            } catch (e) {
                console.log(e);
            }
        }
        await user.save()

        let _progress = []

        let lvlx = 0
        let progress = []

        lvls.map(x => {
            if (user.progress.find(s => s === x.id)) {
                progress.push(x)
            } else {
                progress.push({
                    id: x.id,
                    stars: x.stars
                })
            }

            if (progress.length === LVL[lvlx]) {
                _progress.push(progress)
                lvlx++
                progress = []
            }
        })

        console.log(user.id, req.body.id);

        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
        
            const getPrize = async () => {
                let hash = md5(`${req.body.id}-${user.id}-CAIUECNA`)
                if (req.body.hash === hash) {
                await prequest({
                    method: 'POST',
                    url: 'https://footballcoin.ru:777/api/quiz_bonus',
                    body: {
                        logo: true,
                        ip,
                        lvl: req.body.id,
                        id: user.id
                    },
                })
                }
        }
        
        
        if (!user.reload) {
            getPrize()
        }
        
        
        res.status(200).json({ user, progress: _progress, img: lvl.img, prizes })
    } else {
        res.status(200).json({ error: 'Ответ не верный!' }) 
    }
})

app.post('/api/get_help', async function (req, res) {
    if (securityKey(req) === false) return res.status(401).json({ message: 'Ошибка доступа!' }) 
    let body = urlencoded(req)

    let user = await User.findOne({ id: +body.viewer_id})
    if (!user) return res.status(401).json({ message: 'Ошибка доступа!' }) 

    let lvl = lvls.find(x => x.id === req.body.id)
    if (!lvl) return res.status(401).json({ message: 'Ошибка доступа!' })
    if (user.progress.find(x => x === lvl.id)) return res.status(401).json({ message: 'Ошибка доступа!' })

    if (req.body.help === 'info') {

    }
});

app.post('/api/get_info', async function (req, res) {
    if (securityKey(req) === false) return res.status(401).json({ message: 'Ошибка доступа!' }) 
    let body = urlencoded(req)

    let user = await User.findOne({ id: +body.viewer_id})
    if (!user) return res.status(401).json({ message: 'Ошибка доступа!' }) 

    let stars = 0
    let all_stars = 0

    user.progress.map(x => {
        let LVL = lvls.find(s => s.id === x)
        stars += LVL.stars
    })

    lvls.map(x => {
        all_stars += x.stars
    })

    res.status(200).json({ user, items: lvls.length, stars, all_stars })
})

app.post('/api/help', async function (req, res) {
    if (securityKey(req) === false) return res.status(401).json({ message: 'Ошибка доступа!' }) 
    let body = urlencoded(req)

    let user = await User.findOne({ id: +body.viewer_id})
    if (!user) return res.status(401).json({ message: 'Ошибка доступа!' }) 

    if (req.body.type === 'full') {
        if (user.help.find(x => x.id === req.body.id && x.type === req.body.type)) return res.status(200).json({ error: 'Вы уже получили подсказку!' }) 
        if (user.science < 10) return res.status(200).json({ code: 188, error: 'Недостаточно подсказок!' }) 
        user.science -= 10
        user.science_use += 10
        user.help.push({
            id: req.body.id,
            type: req.body.type,
            result: lvls.find(x => x.id === req.body.id).name
        })
        user.markModified('help');
        await user.save()
        return res.status(200).json({ user }) 
    }

    if (req.body.type === 'excess') {
        if (user.help.find(x => x.id === req.body.id && x.type === req.body.type)) return res.status(200).json({ error: 'Вы уже получили подсказку!' }) 
        if (user.science < 5) return res.status(200).json({ code: 188, error: 'Недостаточно подсказок!' }) 

        user.science -= 5
        user.science_use += 5

        let words = []
        let string = []

        let lvl = lvls.find(x => x.id === req.body.id)

        lvl.name.split('').map(x => {
            if (x === ' ') {
                string.push(' ')
            } else if (x === '-') {
                string.push('-')
            } else {
                string.push('0')
                words.push(x)
            }
        })

        user.help.push({
            id: req.body.id,
            type: req.body.type,
            result: words.sort(()=> Math.random()-0.5)
        })

        user.markModified('help');
        await user.save()

            return res.status(200).json({ user }) 
        }
});

app.post('/api/get_free_science', async function (req, res) {
    if (securityKey(req) === false) return res.status(401).json({ message: 'Ошибка доступа!' }) 
    let body = urlencoded(req)

    let user = await User.findOne({ id: +body.viewer_id})
    if (!user) return res.status(401).json({ message: 'Ошибка доступа!' }) 

    if (user.science > 100) return res.status(200).json({ error: 'У вас слишом много подсказок!' }) 

    user.science += 1
    await user.save()

    return res.status(200).json({ user }) 
});

app.post('/api/get_free_science_subscribe', async function (req, res) {
    if (securityKey(req) === false) return res.status(401).json({ message: 'Ошибка доступа!' }) 
    let body = urlencoded(req)

    let user = await User.findOne({ id: +body.viewer_id})
    if (!user) return res.status(401).json({ message: 'Ошибка доступа!' }) 

    if (user.sub) return res.status(200).json({ error: 'Вы уже получили подарок!' }) 

    user.sub = true
    user.science += 20
    await user.save()

    return res.status(200).json({ user }) 
});

app.post('/api/get_free_science_post', async function (req, res) {
    if (securityKey(req) === false) return res.status(401).json({ message: 'Ошибка доступа!' }) 
    let body = urlencoded(req)

    let user = await User.findOne({ id: +body.viewer_id})
    if (!user) return res.status(401).json({ message: 'Ошибка доступа!' }) 

    if (user.post) return res.status(200).json({ error: 'Вы уже получили подарок!' }) 

    user.post = true
    user.science += 20
    await user.save()

    return res.status(200).json({ user }) 
});

app.post('/logo/shop', async function (req, res) {
    if (req.body.status === 'chargeable') {
        console.log(req.body);
        let check = await Shop.findOne({ order_id: req.body.order_id, stars: true })
        if (check) return res.status(200).json({ok: true, status: true})

        let user = await User.findOne({ id: +req.body.user_id})
        if (!user) return res.status(200).json({
            error: {
                "error_code":401, 
                "error_msg":"Пользователь не найден",
                "critical":1
            }
        })

        check = new Shop({
            order_id: req.body.order_id,
            status: true
        })
        await check.save()

        user.science += +req.body.item_id
        user.don = true
        await user.save()

        res.status(200).json({ok: true})
    } else if (req.body.status === 'refunded') {
        let user = await User.findOne({ id: +req.body.user_id})
        if (!user) return res.status(200).json({
            error: {
                "error_code":401, 
                "error_msg":"Пользователь не найден",
                "critical":1
            }
        })

        let check = await Shop.findOne({ order_id: req.body.order_id, stars: true })
        if (!check) return res.status(200).json({ok: true, status: true})

        check.status = false
        await check.save()
        
        user.science -= +req.body.item_id
        user.don = false
        await user.save()

        res.status(200).json({ok: true})
    } else {
        res.status(200).json({
            error: {
                "error_code":23, 
                "error_msg":"Ошибка сервера",
                "critical":1
            }
        })
    }
});