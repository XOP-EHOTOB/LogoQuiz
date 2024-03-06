import React, { useState, useEffect } from 'react';
import bridge from '@vkontakte/vk-bridge';
import { View, ScreenSpinner, AdaptivityProvider, AppRoot, ConfigProvider, SplitLayout, SplitCol } from '@vkontakte/vkui';
import '@vkontakte/vkui/dist/vkui.css';
import { useDispatch } from 'react-redux'
import request from './hooks/useHttp'
import Home from './panels/Home';

import "./App.css"

import Settings from './panels/Settings';
import Top from './panels/Top';
import Statistic from './panels/Statistic';
import Shop from './panels/Shop';
import GameMenu from './panels/game/GameMenu';
import GameLvl from './panels/game/GameLvl';
import Game from './panels/game/Game';

const App = () => {
	const [scheme, setScheme] = useState('bright_light')
	const [activePanel, setActivePanel] = useState('home');
	const [fetchedUser, setUser] = useState(null);
	const [popout, setPopout] = useState(<ScreenSpinner size='large' />);
	const dispatch = useDispatch()

	useEffect(() => {
		bridge.subscribe(({ detail: { type, data }}) => {
			if (type === 'VKWebAppUpdateConfig') {
				setScheme('space_gray')
			}
		});

		async function fetchData() {
			const user = await bridge.send('VKWebAppGetUserInfo');

			const userData = await request('get_user', 'POST', {
				url: document.location.search,
			})

			if (!userData.user.don) {
				bridge.send('VKWebAppShowBannerAd', {
					banner_location: 'bottom'
				}).catch((error) => console.error(error));
			}

			dispatch({type: 'SET_USER', data: {...user, ...userData.user}})

			setUser(user);
			setPopout(null);

			try {
				let recommendation = (await bridge.send('VKWebAppStorageGet', {keys: ['recommendation']})).keys
				if (!recommendation?.[0]?.value) {
					bridge.send('VKWebAppStorageSet', {
						key: 'recommendation',
						value: 'true'
					})

					bridge.send('VKWebAppRecommend').then(data => {
						console.log(data);
					}).catch(e => {
						console.error(e);
					})
				}
			} catch (e) {
				console.error(e);
			}
		}
		fetchData();
	}, []);

	const go = e => {
		setActivePanel(e.currentTarget.dataset.to);
	};

	return (
		<ConfigProvider scheme={scheme}>
			<AdaptivityProvider>
				<AppRoot>
					<SplitLayout popout={popout}>
						<SplitCol>
							<View activePanel={activePanel}>
								<Home id='home' fetchedUser={fetchedUser} go={go} />
								<Settings id='settings' go={go} />
								<Top id='top' go={go} user={fetchedUser}/>
								<Statistic id='statistic' go={go} setPopout={setPopout}/>
								<Shop id='shop' go={go} />
								<GameMenu id='game' go={go}/>
								<GameLvl id='lvl' go={go}/>
								<Game id='start' go={go} setPopout={setPopout}/>
							</View>
						</SplitCol>
					</SplitLayout>
				</AppRoot>
			</AdaptivityProvider>
		</ConfigProvider>
	);
}

export default App;
