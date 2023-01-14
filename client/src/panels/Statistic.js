import React, { useEffect, useState } from 'react';
import { Panel } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux'
import { Icon28ChevronLeft } from '@vkontakte/icons';
import { PanelHeader, PanelHeaderButton, Alert} from "@vkontakte/vkui";
import request from '../hooks/useHttp'
import SnackbarItem from './items/SnackbarItem'
import LinearProgress from '@mui/material/LinearProgress';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

import { Icon20EducationOutline } from '@vkontakte/icons';;
import { Icon20LogoGeekbrainsOutline } from '@vkontakte/icons';
import { Icon16FavoriteOutline } from '@vkontakte/icons';
import { Icon24FlashOutline } from '@vkontakte/icons';
import { Icon24Flash } from '@vkontakte/icons';

import { Icon20HistoryBackwardOutline } from '@vkontakte/icons';
import { Icon24ClockOutline } from '@vkontakte/icons';
import { Icon28LiveClockBadgeOutline } from '@vkontakte/icons';

var options = {
    era: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    timezone: 'UTC',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric'
};
  
const Statistic = ({ id, go, setPopout }) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const [snackbar, setSnackbar] = useState(null)
    const [info, setInfo] = useState(null)


    const getGameDate = () => {
        let date = Number(new Date(user?.date)) || 0
        let date_now = Date.now()

        let days = Math.floor((Number(date_now) - Number(date)) / 86400000)
        let hours = Math.floor((Number(date_now) - Number(date)) / 3600000 % 24)
        let min = Math.floor((Number(date_now) - Number(date)) / 60000 % 60 )

        return `${days} д. ${hours} час. ${min} мин.`
    }


    const reset = async () => {
        request('restart', "POST", {
            url: document.location.search
        }).then(data => {
            if (data.error) throw new Error(data.error.message || 'Ошибка сервера!')
            setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='success' text={'Статистика обнулена!'}/>)
            dispatch({type: 'SET_USER', data: {...data.user, photo_200: user.photo_200}})
        }).catch(e => {
            setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text={e.message || 'Ошибка сервера'}/>)
        })
    }

    const resetGame = async () => {
        setPopout(
            <Alert
              actions={[
                {
                  title: "Сбросить",
                  mode: "destructive",
                  autoClose: true,
                  action: () => {
                    setPopout(null)
                    reset()
                    },
                },
                {
                  title: "Отмена",
                  autoClose: true,
                  mode: "cancel",
                  action: () => setPopout(null),
                },
              ]}
              actionsLayout="horizontal"
              onClose={() => {setPopout(null)}}
              header="Подтвердите действие"
              text="Вы уверены, что хотите сбросить статистику? После обнуления весь прогресс и подсказки будут потеряны!"
            />
          )
    }


    useEffect(() => {
        request('get_info', "POST", {
            url: document.location.search
        }).then(data => {
            if (data.error) throw new Error(data.error.message || 'Ошибка сервера!')
            setInfo(data)
        }).catch(e => {
            setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text={e.message || 'Ошибка сервера'}/>)
        })
    }, [user])
    
    return <Panel id={id}>
        <PanelHeader left={
            <PanelHeaderButton data-to='home' onClick={go}>
                <Icon28ChevronLeft />
             </PanelHeaderButton>
        }>Статистика</PanelHeader>

        <div className='main'>
        <div className='settings-menu'>
            <p>Прогресс</p>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}}>
                <Icon20EducationOutline width={28} height={28}/>
                <div>
                    <p style={{margin: 0}}>{user?.progress?.length || 0} Угаданые команды</p>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress variant="determinate" value={Math.round(
                          user?.progress?.length / info?.items * 100
                        )} />
                      </Box>
                      <Box sx={{ minWidth: 40}}>
                        <Typography sx={{color: 'white' }} variant="body2" color="text.secondary">{`${Math.round(
                          user?.progress?.length / info?.items * 100
                        )}%`}</Typography>
                      </Box>
                    </Box>
                </div>
            </div>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}}>
                <Icon16FavoriteOutline width={28} height={28}/>
                <div>
                    <p style={{margin: 0}}>{info?.stars || 0} Очки</p>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Box sx={{ width: '100%', mr: 1 }}>
                        <LinearProgress variant="determinate" value={Math.round(
                          info?.stars / info?.all_stars * 100
                        )} />
                      </Box>
                      <Box sx={{ minWidth: 40}}>
                        <Typography sx={{color: 'white' }} variant="body2" color="text.secondary">{`${Math.round(
                          info?.stars / info?.all_stars * 100
                        )}%`}</Typography>
                      </Box>
                    </Box>
                </div>
            </div>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}}>
                <Icon20LogoGeekbrainsOutline width={28} height={28}/>
                <div>
                    <p style={{margin: 0}}>{user?.lvl || 0} Уровень</p>
                </div>
            </div>
        </div>

        <div className='settings-menu'>
            <p>Подсказки</p>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}}>
                <Icon24Flash width={28} height={28}/>
                <div>
                    <p style={{margin: 0}}>{user?.science || 0} Подсказки</p>
                </div>
            </div>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}}>
                <Icon24FlashOutline width={28} height={28}/>
                <div>
                <p style={{margin: 0}}>{user?.science_use || 0} Использованые одсказки</p>
                </div>
            </div>
        </div>

        <div className='settings-menu'>
            <p>Остальное</p>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}} onClick={resetGame}>
                <Icon20HistoryBackwardOutline width={28} height={28}/>
                <div>
                <p style={{margin: 0}}>Сбросить игру</p>
                </div>
            </div>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}}>
                <Icon24ClockOutline width={28} height={28}/>
                <div>
                <p style={{margin: 0}}> Первый запуск: {new Date(user?.date)?.toLocaleString('ru', options) || 0}</p>
                </div>
            </div>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}}>
                <Icon28LiveClockBadgeOutline width={28} height={28}/>
                <div>
                <p style={{margin: 0}}> В игре: {getGameDate()}</p>
                </div>
            </div>
            
        </div>

        {snackbar}
        </div>
    </Panel>
}

export default Statistic