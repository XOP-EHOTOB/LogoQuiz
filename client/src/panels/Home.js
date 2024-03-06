import React, { useEffect } from 'react';
import '../css/Home.css'
import UserData from './items/UserData'
import { useSelector, useDispatch } from 'react-redux'
import { Panel, PanelHeader, Footer, Link } from '@vkontakte/vkui';
import { Icon28Users3Outline } from '@vkontakte/icons';
import { Icon28SettingsOutline } from '@vkontakte/icons';
import { Icon32PollOutline } from '@vkontakte/icons';
import bridge from "@vkontakte/vk-bridge"

const APP_AVA = "https://sun1-21.userapi.com/impf/_YdUv-TOuFpJqDt_ZtgXysp7BNMP9gdiYUsN9g/hrJxFbBHe84.jpg?size=288x288&quality=90&sign=d09cbff52ae6c175116c5bf5f32b801c"

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
				<div className='main-menu-items' data-to='shop' onClick={go}>Получить подстказки</div>

				<div 
					style={{ margin: '10px'}}
					className='Advertisement' 
					onClick={() => {
						bridge.send('VKWebAppOpenApp', {
							app_id: 8175004,
						}).catch(() => {
							let link = document.createElement('a')
							link.href = 'https://vk.com/quiz_footballcoin';
							link.target = "_blank"
							document.body.appendChild(link);
							link.click();
						}) 
					}}
				>
					<img 
						className='AdvertisementImage'
						src={APP_AVA}
						alt='Logo Quiz'
					/>
					<div className='AdvertisementInfo'>
						<p>Football Quiz</p>
						<span>Угадывай футбольные команды</span>
					</div>
				</div>
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
