import React, { useEffect, useState } from 'react';
import { Panel, Footer } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux'
import { Icon28ChevronLeft } from '@vkontakte/icons';
import { PanelHeader, PanelHeaderButton, Alert} from "@vkontakte/vkui";
import bridge from '@vkontakte/vk-bridge'
import request from '../hooks/useHttp'
import SnackbarItem from './items/SnackbarItem'

import { Icon16VideoAdvertisement } from '@vkontakte/icons';
import { Icon20UsersOutline } from '@vkontakte/icons';
import { Icon28ShareExternalOutline } from '@vkontakte/icons';
import { Icon20ShoppingCartOutline } from '@vkontakte/icons';

const Shop = ({ id, go }) => {
    const [snackbar, setSnackbar] = useState(null)
    const user = useSelector(state => state.user.user)
    const dispatch = useDispatch()

    const showideo = () => {
        bridge.send('VKWebAppCheckNativeAds', { ad_format: 'reward' }).then((data) => { 
              if (data.result) { 
                bridge.send('VKWebAppShowNativeAds', { ad_format: 'reward' }).then( (data) => { 
                      if (data.result) {
                        request('get_free_science', "POST", {
                            url: document.location.search
                        }).then(data => {
                            if (data.error) throw new Error(data.error || 'Ошибка сервера!')
                            dispatch({type: 'SET_USER', data: {...data.user, photo_200: user.photo_200}})
                            setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='sucess' text='Вы получили 2 подсказки!'/>)
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

    const subscribe = () => {
        bridge.send('VKWebAppJoinGroup', { group_id: 187158682 }).then((data) => { 
              if (data.result) {
                request('get_free_science_subscribe', "POST", {
                    url: document.location.search
                }).then(data => {
                    if (data.error) throw new Error(data.error || 'Ошибка сервера!')
                    dispatch({type: 'SET_USER', data: {...data.user, photo_200: user.photo_200}})
                    setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='sucess' text='Вы получили 20 подсказок!'/>)
                }).catch(e => {
                    setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text={e.message || 'Ошибка сервера'}/>)
                })
              } else {
                setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='warn' text='Вы не подписались на группу!'/>)
              }
            }).catch((error) => {
                setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text='Произошла неизвестная ошибка!'/>)
            });
    }

    const shere = async () => {
        bridge.send('VKWebAppShowWallPostBox', {
            message: 'Угадывай футбольные логотипы по логотипам используя свои знания в футболе!',
            attachments: 'https://vk.com/quiz_footballcoin'
            })
            .then((data) => { 
              if (data.post_id) {
                request('get_free_science_post', "POST", {
                    url: document.location.search
                }).then(data => {
                    if (data.error) throw new Error(data.error || 'Ошибка сервера!')
                    dispatch({type: 'SET_USER', data: {...data.user, photo_200: user.photo_200}})
                    setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='sucess' text='Вы получили 20 подсказок!'/>)
                }).catch(e => {
                    setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text={e.message || 'Ошибка сервера'}/>)
                })
              } else {
                setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='warn' text='Вы не поделились записью!'/>)
              }
            })
            .catch((error) => {
                setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text='Произошла неизвестная ошибка!'/>)
            });
    }


    const pay = (key, items) => {
        bridge.send('VKWebAppShowOrderBox', { 
                type: 'item',
                item: key
            })
            .then((data) => {
              if (data.success) {
                setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='sucess' text={`Успешно! Начислено - ${items} голосов`}/>)
            }})
            .catch((error) => {
                setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text='Произошла неизвестная ошибка!'/>)
            });
    }


    return <Panel id={id}>
        <PanelHeader left={
            <PanelHeaderButton data-to='home' onClick={go}>
                <Icon28ChevronLeft />
             </PanelHeaderButton>
        }>Магазин</PanelHeader>

        <div className='main'>
        <div className='settings-menu'>
            <p>Бесплатные подсказки</p>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}} onClick={showideo}>
                <Icon16VideoAdvertisement width={28} height={28}/>
                <div>
                <p style={{margin: 0}}>Смотреть рекламу (+2)</p>
                </div>
            </div>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}} onClick={subscribe}>
                <Icon20UsersOutline width={28} height={28}/>
                <div>
                <p style={{margin: 0}}> Подписаться на группу (+20)</p>
                </div>
            </div>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}} onClick={shere}>
                <Icon28ShareExternalOutline width={28} height={28}/>
                <div>
                <p style={{margin: 0}}> Поделиться записью (+20)</p>
                </div>
            </div>
        </div>

        <div className='settings-menu'>
            <p>Доступно для покупки</p>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}}  onClick={() => { pay('item1', 29) }}>
                <Icon20ShoppingCartOutline width={28} height={28}/>
                <div>
                <p style={{margin: 0}}>29 подсказок за 3 голоса</p>
                </div>
            </div>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}}  onClick={() => { pay('item2', 59) }}>
                <Icon20ShoppingCartOutline width={28} height={28}/>
                <div>
                <p style={{margin: 0}}>59 подсказок за 6 голосов</p>
                </div>
            </div>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}}  onClick={() => { pay('item3', 149) }}>
                <Icon20ShoppingCartOutline width={28} height={28}/>
                <div>
                <p style={{margin: 0}}>149 подсказок за 12 голосов</p>
                </div>
            </div>
            
            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}}  onClick={() => { pay('item4', 309) }}>
                <Icon20ShoppingCartOutline width={28} height={28}/>
                <div>
                <p style={{margin: 0}}>309 подсказок за 24 голоса</p>
                </div>
            </div>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}} onClick={() => { pay('item5', 649) }}>
                <Icon20ShoppingCartOutline width={28} height={28}/>
                <div>
                <p style={{margin: 0}}>649 подсказок за 44 голоса</p>
                </div>
            </div>

            <div className='settings-menu-button' style={{gridTemplateColumns: '40px 1fr'}} onClick={() => { pay('item6', 999) }}>
                <Icon20ShoppingCartOutline width={28} height={28}/>
                <div>
                <p style={{margin: 0}}>999 подсказок за 55 голоса</p>
                </div>
            </div>
        </div>
        <Footer>После любой покупки для вас будет отключена реклама!</Footer>
        {snackbar}
        </div>
        </Panel>
}

export default Shop