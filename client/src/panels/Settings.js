import React, { useState } from 'react';
import { Panel, Footer } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux'
import { Icon28ChevronLeft } from '@vkontakte/icons';
import { PanelHeader, PanelHeaderButton, Switch} from "@vkontakte/vkui";
import bridge from '@vkontakte/vk-bridge'
import request from '../hooks/useHttp'
import SnackbarItem from './items/SnackbarItem'

import '../css/Settings.css'

import { Icon20VolumeOutline } from '@vkontakte/icons';
import { Icon24BroadcastOutline } from '@vkontakte/icons';
import { Icon24CrownCircleFillVkDating } from '@vkontakte/icons';
import { Icon28ServicesCircleFillBlue } from '@vkontakte/icons';
import { Icon28RepostCircleFillGreen } from '@vkontakte/icons';

const APP_IMAGE = 'https://sun1-30.userapi.com/impf/0xS2TBa6-ifqOeiD8i-8YX1Q20gWHDcvys4rbg/3QQ6Mru6S9M.jpg?size=278x278&quality=90&sign=a035116920a68dda909a5e3f6458ffa5'

const Settings = ({ id, go }) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const [snackbar, setSnackbar] = useState(null)

    const setSetings = (key) => {
        request('set_settings', "POST", {
            url: document.location.search, id: key, status: !user[key]
        }).then(data => {
            if (data.error) throw new Error(data.error.message || 'Ошибка сервера!')
            dispatch({type: 'SET_USER', data: {...data.user, photo_200: user.photo_200}})
            setSnackbar(<SnackbarItem setSnackbar={setSnackbar} text={data.message || 'Успешно!'}/>)
        }).catch(e => {
            setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text={e.message || 'Ошибка сервера'}/>)
        })
    }

	return <Panel id={id}>
        <PanelHeader left={
            <PanelHeaderButton data-to='home' onClick={go}>
                <Icon28ChevronLeft />
             </PanelHeaderButton>
        }>Настройки</PanelHeader>
        
        <div className='main'>
        <div className='settings-menu'>
            <p>Основные</p>
            <div className='settings-menu-button'>
                <Icon20VolumeOutline width={28} height={28}/>
                <p>Звук</p>
                <Switch defaultChecked={user.sound} onChange={() => {setSetings('sound')}}/>
            </div>

            <div className='settings-menu-button'>
                <Icon24BroadcastOutline width={28} height={28}/>
                <p>Вибрация</p>
            <Switch defaultChecked={user.vibration} onChange={() => {setSetings('vibration')}}/>
            </div>
        </div>

        <div className='settings-menu'>
            <p>Дополнительно</p>
            <div className='settings-menu-button clicked' onClick={() => {
                bridge.send("VKWebAppAddToFavorites").then(data => {
                    setSnackbar(<SnackbarItem setSnackbar={setSnackbar} text='Приложение добавлено в избраное'/>)
                }).catch(e => {
                    setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text='Произошла ошибка'/>)
                })
            }}>
                <Icon24CrownCircleFillVkDating width={28} height={28}/>
                <p>В избранное</p>
            </div>

            <div className='settings-menu-button clicked' onClick={() => {
                bridge.send("VKWebAppAddToHomeScreenInfo").then(data => {
                    if (data.is_added_to_home_screen) {
                        return setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='warn' text='Приложение уже на главном экране устройства'/>)
                    }
                    if (data.is_feature_supported) {
                        bridge.send("VKWebAppAddToHomeScreen").then(data => {
                            setSnackbar(<SnackbarItem setSnackbar={setSnackbar} text='Приложение добавлено на главный экран'/>)
                        }).catch(e => {
                            setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text='Произошла ошибка'/>)
                        })
                    } else {
                        return setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='warn' text='Недоступно на вашем устройстве'/>)
                    }
                    console.log(data);
                }).catch(e => {
                    console.log(e);
                })

            }}>
                <Icon28ServicesCircleFillBlue width={28} height={28}/>
                <p>На гланый экран</p>
            </div>

            <div className='settings-menu-button clicked' onClick={() => {
                bridge.send("VKWebAppShare").then(data => {
                    setSnackbar(<SnackbarItem setSnackbar={setSnackbar} text='Приложение отправлено'/>)
                }).catch(e => {
                    setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text='Произошла ошибка'/>)
                })
            }}>
                <Icon28RepostCircleFillGreen width={28} height={28}/>
                <p>Поделиться</p>
            </div>

        </div>

        <div className='settings-menu'>
        <p>Может пригодиться</p>
        <div 
            style={{ margin: '10px'}}
            className='Advertisement' 
            onClick={() => {
			    bridge.send('VKWebAppOpenApp', {
				    app_id: 7790406,
			    }).catch(() => {
                    let link = document.createElement('a')
                    link.href = 'https://vk.com/cclinks';
                    link.target = "_blank"
                    document.body.appendChild(link);
                    link.click();
                }) 
		}}>
		    <img 
			    className='AdvertisementImage'
			    src={APP_IMAGE}
			    alt='Logo Quiz'
		    />
			<div className='AdvertisementInfo'>
				<p>Сокращение ссылок</p>
				<span>Из сложной в простую</span>
			</div>
		</div>
        </div>

        <Footer>v 2.0.0</Footer>
        {snackbar}
        </div>
	</Panel>
}

export default Settings;
