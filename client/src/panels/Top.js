import React, { useEffect, useState } from 'react';
import { Panel, Spinner, Avatar } from '@vkontakte/vkui';
import { Icon28ChevronLeft } from '@vkontakte/icons';
import { PanelHeader, PanelHeaderButton} from "@vkontakte/vkui";
import bridge from '@vkontakte/vk-bridge'
import request from '../hooks/useHttp'
import { getToken } from '../hooks/getApi'

import '../css/Top.css'

const Top = ({ id, go, user }) => {
    const [body, setBody] = useState(<Spinner style={{ margin: 'auto auto'}} size='medium'/>)

    useEffect(() => {
        const start = async () => {
            const token = await getToken()
            
            const friends = await bridge.sendPromise('VKWebAppCallAPIMethod', {
                method: 'friends.get',
                request_id: '324nnefj',
        
                params: {
                    v: '5.95',
                    user_id: user.id,
                    fields: 'photo_200',
                    access_token: token.access_token,
                },
            })


            request('get_friends', "POST", {
                url: document.location.search, friends: friends.response.items
            }).then(data => {
                console.log(data);
                if (!data.friends && data?.friends?.length < 1) {
                    setBody(<div style={{ margin: 'auto auto'}}>
                        <p>Ваши друзья еще не играли в Football Quiz</p>
                    </div>)
                } else {
                    let div = []

                    data.friends.map(friend => {
                        div.push(<div className='top-menu' key={friend.id}>
                            <div className='top-menu-header'>
                                <Avatar size={32} src={friends.response.items.find(x => x.id === friend.id)?.photo_200 || null}/>
                                <p>{friends.response.items.find(x => x.id === friend.id)?.first_name || null} {friends.response.items.find(x => x.id === friend.id)?.last_name || null}</p>
                            </div>
                            <div className='top-menu-body'>
                                <div className='top-menu-body-item'>
                                    <h1>Логотипы</h1>
                                    <p>{friend.progress}</p>
                                </div>
                                <div className='top-menu-body-item'>
                                    <h1>Очки</h1>
                                    <p>{friend.stars}</p>
                                </div>
                                <p style={{ margin: 'auto auto'}}>{friend.lvl}</p>
                            </div>
                        </div>
                        )
                    })

                    setBody(div)
                }
            }).catch(e => {
                console.log(e);
            })
        }

        start()
    }, [])


    return <Panel id={id}>
        <PanelHeader left={
            <PanelHeaderButton data-to='home' onClick={go}>
                <Icon28ChevronLeft />
             </PanelHeaderButton>
        }>Топ</PanelHeader>
        <div className='main'>
            {body}
        </div>
    </Panel>
}

export default Top