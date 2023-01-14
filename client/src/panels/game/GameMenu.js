import React, { useEffect, useState } from 'react';
import { Panel, Spinner } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux'
import { Icon28ChevronLeft } from '@vkontakte/icons';
import { PanelHeader, PanelHeaderButton} from "@vkontakte/vkui";
import request from '../../hooks/useHttp'
import SnackbarItem from '../items/SnackbarItem'
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Icon24LockOutline } from '@vkontakte/icons';

import '../../css/GameMenu.css'

const GameMenu = ({ id, go }) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const [snackbar, setSnackbar] = useState(null)
    const [ body, setBody ] = useState(<Spinner size='medium' style={{ margin: 'auto auto' }}/>)

    const startLvl = (lvl) => {
        dispatch({type: 'SET_USER', data: {...user, active_lvl: lvl}})
        go({currentTarget: { dataset: { to: 'lvl' }}})
    }

    useEffect(() => {
        request('get_games', "POST", {
            url: document.location.search
        }).then(data => {
            if (data.error) throw new Error(data.error.message || 'Ошибка сервера!')
            let items = []

            data.progress.map(lvl => {
                items.push(<div className='game-menu-item' key={Math.round(Math.random() * 1000000)} onClick={() => {
                    user.lvl < data.progress.indexOf(lvl) + 1 ?
                    setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='warn' text='Отгадайте больше команд чтобы открыть!'/>) :
                    startLvl(data.progress.indexOf(lvl))
                }}>
                    <p>Уровень {items.length + 1}</p>
                    <div className='game-menu-item-body'>
                        <div className='game-menu-item-body-item'>
                            <h1>Логотипы</h1>
                            <p>{Math.floor(lvl.filter(x => x.name).length)}/{lvl.length}</p>
                        </div>

                        <div className='game-menu-item-body-item'>
                            <h1>Очки</h1>
                            <p>{lvl.filter(x => x.name).length > 0 ? lvl.filter(x => x.name).reduce((a, b) => {return a + b.stars}, 0) : 0}</p>
                        </div>
                    </div>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress variant="determinate" value={Math.round(
                          Math.floor(lvl.filter(x => x.name).length / lvl.length * 100)
                        )} />
                      </Box>
                      <Box sx={{ minWidth: 40}}>
                        <Typography sx={{color: 'white' }} variant="body2" color="text.secondary">{`${Math.round(
                           Math.floor(lvl.filter(x => x.name).length / lvl.length * 100)
                        )}%`}</Typography>
                      </Box>
                    </Box>

                    {
                        user.lvl < items.length + 1 ?
                        <div className='lock-lvls'>
                            <Icon24LockOutline width={40} height={40}/>
                        </div> :
                        null
                    }
                </div>)
            })

            setBody(items)
        }).catch(e => {
            setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text={e.message || 'Ошибка сервера'}/>)
        })
    }, [])

    return <Panel id={id}>
        <PanelHeader left={
            <PanelHeaderButton data-to='home' onClick={go}>
                <Icon28ChevronLeft />
            </PanelHeaderButton>
        }>Уровни</PanelHeader>
        <div className='main'>
            <div className='game-menu-items-body'>{body}</div>
        </div>
        {snackbar}
    </Panel>
}

export default GameMenu