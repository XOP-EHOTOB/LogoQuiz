import React, { useEffect, useState } from 'react';
import { Panel, Alert } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux'
import { Icon28ChevronLeft } from '@vkontakte/icons';
import { PanelHeader, PanelHeaderButton} from "@vkontakte/vkui";
import request from '../../hooks/useHttp'
import SnackbarItem from '../items/SnackbarItem'
import UserData from '../items/UserData';
import bridge from '@vkontakte/vk-bridge'
import useSound from 'use-sound';

import { Icon20TextLiveCircleFillGreen } from '@vkontakte/icons';
import { Icon20ViewCircleFillRed } from '@vkontakte/icons';

import win_sound from './win.mp3'
import lose_sound from './lose.mp3'
import tap1 from '../../mp3/tap1.mp3'
import tap2 from '../../mp3/tap2.mp3'
import _help from '../../mp3/help.mp3'

const Game = ({ id, go, setPopout }) => {
    const user = useSelector(state => state.user.user)
    const dispatch = useDispatch()
    const [snackbar, setSnackbar] = useState(null)
    const [words, setWords] = useState([])
    const [string, setString] = useState([])
    const [ body, setBody ] = useState(null)
    const [ stopGame, setStopGame ] = useState(false)
    const [ win, setWin ] = useState(null)
    const [restart, setRestart] = useState(false)
    const [playWin] = useSound(win_sound);
    const [playLose] = useSound(lose_sound);
    const [playTap1] = useSound(tap1);
    const [playTap2] = useSound(tap2);
    const [playHelp] = useSound(_help);

    useEffect(() => {
        request('get_game', "POST", {
            url: document.location.search, id: user.active_game
        }).then(data => {
            if (user.help.find(x => x.id === user.active_game && x.type === 'full')) {
                let HELP = user.help.find(x => x.id === user.active_game && x.type === 'full')
                setString(data.words)
                setWords(HELP.result.split(''))
            } else if (user.help.find(x => x.id === user.active_game && x.type === 'excess')) {
                let HELP = user.help.find(x => x.id === user.active_game && x.type === 'excess')
                setString(HELP.result)
                setWords(data.string)
            } else {
                setString(data.words)
                setWords(data.string)
            }
        }).catch(e => {
            setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text={e.message || 'Ошибка сервера'}/>)
        })
    }, [restart])

    const help = (type) => {
        if (user.help.find(x => x.id === user.active_game && x.type === type)) return

        request('help', "POST", {
            url: document.location.search, 
            id: user.active_game,
            type
        }).then(data => {
            if (data.error) {
                setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text={data.error || 'Ошибка сервера'}/>)
            } else {
                dispatch({type: 'SET_USER', data: {...user, ...data.user}})
                setRestart(!restart)
                if (user.sound) playHelp()
            }
        }).catch(e => {
            setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text={e.message || 'Ошибка сервера'}/>)
        })
    }

    const helpMenu = (type) => {
        let text = type === 'full' ? 'Показать слово' : "Убрать лишнее"
        let info = type === 'full' ? 
        'Вы хотите открыть слово целеком? будет списано 10 подсказок' : 
        "Вы хотите убрать лишние буквы? будет списано 5 подсказок"

        setPopout(
            <Alert
              actions={[
                {
                  title: "Да",
                  mode: "destructive",
                  autoClose: true,
                  action: () => {
                    setPopout(null)
                    help(type)
                    },
                },
                {
                  title: "Нет",
                  autoClose: true,
                  mode: "cancel",
                  action: () => setPopout(null),
                },
              ]}
              actionsLayout="horizontal"
              onClose={() => {setPopout(null)}}
              header={text}
              text={info}
            />
          )
    }


    const setWord = (x) => {
        if (!words.find(s => s === '0')) return

        let str = JSON.parse(JSON.stringify(string))
        let wo = JSON.parse(JSON.stringify(words)) 
        wo[wo.indexOf('0')] = str[x]
        str[x] = '0'

        setString(str)
        setWords(wo)
    }

    const unsetWord = (x) => {
        let str = JSON.parse(JSON.stringify(string))
        let wo = JSON.parse(JSON.stringify(words)) 
        str[str.indexOf('0')] = wo[x]
        wo[x] = '0'

        setString(str)
        setWords(wo)
    }

    useEffect(() => {
        let item = []
        let item2 = []

        let i = 0
        words.map(x => {
            const key = i
            item.push(<div key={item.length + 1} className='game-word' style={{
                backgroundColor:  x === ' ' | x === '-' ? 'var(--button_content)' : null
            }} onClick={() => {
                if (x === ' ' | x === '-') return
                if (user.sound) playTap2()
                unsetWord(key)
            }}>
                {x === '0' ? ' ' : x}
            </div>)
            i++
        })

        i = 0
        string.map(x => {
            const key = i
            item2.push(<div key={item2.length + 1} className='game-keyboard-word' style={{
                backgroundColor:  x === ' ' | x === '-' ? 'var(--button_content)' : null
            }} onClick={() => {
                if (x === '0') return
                if (user.sound) playTap1()
                setWord(key)
            }}>
                {x === '0' ? ' ' : x}
            </div>)
            i++
        })

        setBody(<div className='game-result'>
            <div className='game-result-string'>{item}</div>
            <div className='game-keyboard'>{item2}</div>
        </div>)

        const solution = user.games[user.active_lvl].find(x => x.id === user.active_game).name

        if (words.length > 0 && solution) {
            if (stopGame) return
            setWords(solution.split(''))
            setStopGame(true)
            if (user.sound) { playWin() }
            if (user.vibration) {
                bridge.send("VKWebAppTapticImpactOccurred", {"style": 'success'});
            }

            setWin(<div className='win-panel' data-to='lvl' onClick={go}>
                <div className="firework"></div>
                <div className="firework"></div>
                <div className="firework"></div>
                <div className="firework"></div>
                <div className="firework"></div>
                <div className="firework"></div>
                <div className="firework"></div>

                <div className='GameResult'>
                    <div className='GameResultCard'>
                        <p>Правильный ответ</p>
                        <h1>{solution}</h1>
                    </div>
                    <div 
                        className='main-menu-items'
                        style={{ width: '100%', boxSizing: 'border-box', maxWidth: '350px'}}
                    >
                        Продолжить
                    </div>
                </div>

                <div className='win-panel-text'>
                    <div className="win-panel-text-container">
                        <div className="row">
                            <div className="col-md-12 text-center">
                                <h3 className="animate-charcter">Победа!</h3>
                            </div>
                        </div>
                    </div>
                </div>

            </div>)
        }

        if (words.length > 0 && !words.find(s => s === '0') && !user.games[user.active_lvl].find(x => x.id === user.active_game).name) {
                if (stopGame) return
                request('get_result', "POST", {
                    url: document.location.search, 
                    id: user.active_game,
                    name: words.reduce((a, b) => a + b)
                }).then(data => {
                    console.log(data);
                    if (data.error) {
                        if (user.sound) { playLose() }
                        let game = document.getElementsByClassName('game-result-string')
                            game[0].style.animation = 'horizontal-shaking 0.3s ease-in-out 0s normal none running'
                            setTimeout(() => {
                                game[0].style.animation = null
                            }, 500)
                        if (user.vibration) {
                            bridge.send("VKWebAppTapticImpactOccurred", {"style": 'error'});
                        }
                    } else {
                        dispatch({type: 'SET_USER', data: {...user, ...data.user, games: data.progress}})
                        if (Math.round(Math.random() * 3)  === 1 && !user.don) {
                            bridge.send('VKWebAppShowNativeAds', { ad_format: 'reward' })
                        }

                        if (data.prizes.length > 0) {
                            setPopout(
                                <Alert
                                  actions={[
                                    {
                                      title: "OK",
                                      autoClose: true,
                                      mode: "cancel",
                                      action: () => setPopout(null),
                                    },
                                  ]}
                                  actionsLayout="horizontal"
                                  onClose={() => {setPopout(null)}}
                                  header="Так держать!"
                                  text={data.prizes[0].message}
                                />
                              )
                        }
                    }
                }).catch(e => {
                    setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text={e.message || 'Ошибка сервера'}/>)
                })
        }
    }, [words, user])

    return <Panel id={id}>
        <PanelHeader left={
            <PanelHeaderButton data-to='lvl' onClick={go}>
                <Icon28ChevronLeft />
            </PanelHeaderButton>
        }>Игра</PanelHeader>
        <UserData />

        <div className='game-body'>
            <div>
                <div className='help-menu-item' onClick={() => {helpMenu('excess')}}
                    style={{ opacity: user.help.find(x => x.id === user.active_game && x.type === 'excess') ? 0.5 : 1}}
                >
                    <Icon20ViewCircleFillRed width={30} height={30}/>
                </div>
                <div className='help-menu-item' onClick={() => {helpMenu('full')}}
                    style={{ opacity: user.help.find(x => x.id === user.active_game && x.type === 'full') ? 0.5 : 1}}
                >
                    <Icon20TextLiveCircleFillGreen width={30} height={30}/>
                </div>
            </div>
            <img src={`/img/${
                user.games[user.active_lvl].find(x => x.id === user.active_game).img ?
                user.games[user.active_lvl].find(x => x.id === user.active_game).img : 
                user.games[user.active_lvl].find(x => x.id === user.active_game).id
            }.png`}/>
        </div>
            {body}
            {snackbar}
            {win}
    </Panel>
}

export default Game