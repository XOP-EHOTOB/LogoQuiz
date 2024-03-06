import { useSelector, useDispatch } from 'react-redux'
import { useState } from 'react';
import { Icon20LightbulbCircleFillYellow } from '@vkontakte/icons';
import { Icon20FavoriteCircleFillYellow } from '@vkontakte/icons';
import { Icon24VideoAdvertisement } from '@vkontakte/icons';
import SnackbarItem from './SnackbarItem'
import request from '../../hooks/useHttp'
import useSound from 'use-sound';
import bonus from '../../mp3/bonus.mp3'
import bridge from "@vkontakte/vk-bridge"

const UserData = () => {
    const user = useSelector(state => state.user.user)
    const dispatch = useDispatch()
    const [snackbar, setSnackbar] = useState(null)
    const [playBonus] = useSound(bonus);

    const showideo = () => {
        bridge.send('VKWebAppCheckNativeAds', { ad_format: 'reward' }).then((data) => { 
              if (data.result) { 
                bridge.send('VKWebAppShowNativeAds', { ad_format: 'reward' }).then( (data) => { 
                      if (data.result) {
                        request('get_free_science', "POST", {
                            url: document.location.search
                        }).then(data => {
                            if (data.error) throw new Error(data.error || 'Ошибка сервера!')
                            dispatch({type: 'SET_USER', data: { ...user, ...data.user, photo_200: user.photo_200}})
                            setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='sucess' text='Вы получили 2 подсказки!'/>)
                            if (user.sound) playBonus()
                        }).catch(e => {
                            setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text={e.message || 'Ошибка сервера'}/>)
                        })
                      } else {
                        setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text='Произошла неизвестная ошибка!'/>)
                      }
                    }).catch((error) => { console.log(error); });
              } else {
                setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='warn' text='Для вас нет доступной рекламы!'/>)
              }    
            }).catch((error) => { 
                setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text='Произошла неизвестная ошибка!'/>)
            });
    }

    return <div className='top-data'>
        <div className='favorite-item'>
            <p>{user?.progress?.length || 0}</p>
            <Icon20FavoriteCircleFillYellow />
        </div>
        
        <div className='bulb-item'>
            <p>{user?.science || 0}</p>
            <Icon20LightbulbCircleFillYellow />
        </div>

        <div className='bulb-item' style={{ top: '36px', cursor: 'pointer' }} onClick={showideo}>
            <p>+2</p>
            <Icon24VideoAdvertisement fill='#ffa618'/>
        </div>
        
        {snackbar}
    </div>
}

export default UserData