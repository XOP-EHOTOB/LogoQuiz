import React, { useEffect } from 'react';
import '../css/Home.css'
import UserData from './items/UserData'
import { useSelector, useDispatch } from 'react-redux'
import { Panel, PanelHeader, Footer, Link } from '@vkontakte/vkui';
import { Icon28Users3Outline } from '@vkontakte/icons';
import { Icon28SettingsOutline } from '@vkontakte/icons';
import { Icon32PollOutline } from '@vkontakte/icons';
import { Icon24LockOutline } from '@vkontakte/icons';

import img from '../img/bottom_item.png'
import request from '../hooks/useHttp'

const Home = ({ id, go }) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
	
	useEffect(() => {
		const start = async () => {
			const userData = await request('get_user', 'POST', {
				url: document.location.search,
			})
	
			dispatch({type: 'SET_USER', data: {...user, ...userData.user}})
		}
		start()
	}, [])

	return <Panel id={id}>
		<PanelHeader>Logo Quiz</PanelHeader>
		<UserData />
		<div className='main-menu'>
			<div>
				<div className='main-menu-items' data-to='game' onClick={go}>Играть</div>
				<div className='main-menu-items' style={{ position: 'relative' }}>
					<div style={{ 
						position: 'absolute', display: 'flex',
						left: 0, top: 0, borderRadius: '8px',
						width: '100%', height: '100%',
						background: 'rgba(0, 0, 0, 0.50)', 
						alignItems: 'center', justifyContent: 'center'
					}}>
						<Icon24LockOutline />
					</div>
					Дополнительные уровни
				</div>
				<div className='main-menu-items' data-to='shop' onClick={go}>Получить подстказки</div>
			</div>

			<div className='bottom-menu'>
				<Icon32PollOutline width={36} height={36} data-to='statistic' onClick={go}/>
				<Icon28Users3Outline  width={36} height={36} data-to='top' onClick={go}/>
				<Icon28SettingsOutline  width={36} height={36} data-to='settings' onClick={go}/>
			</div>

			<Footer>Made by <Link href='https://хор-енотов.рф' target='_blank'>XOP EHOTOB</Link></Footer>
		</div>
		<div className='bottom-image'>
			<img src={img} />
		</div>
	</Panel>
}

export default Home;
