import React, { useEffect, useState } from 'react';
import { Panel, Spinner } from '@vkontakte/vkui';
import { useSelector, useDispatch } from 'react-redux'
import { Icon28ChevronLeft } from '@vkontakte/icons';
import { PanelHeader, PanelHeaderButton} from "@vkontakte/vkui";
import request from '../../hooks/useHttp'
import SnackbarItem from '../items/SnackbarItem'

import { styled } from '@mui/material/styles';
import Rating from '@mui/material/Rating';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import SentimentSatisfiedIcon from '@mui/icons-material/SentimentSatisfied';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAltOutlined';
import SentimentVerySatisfiedIcon from '@mui/icons-material/SentimentVerySatisfied';


const StyledRating = styled(Rating)(({ theme }) => ({
    '& .MuiRating-iconEmpty .MuiSvgIcon-root': {
      color: theme.palette.action.disabled,
    },
}));

const customIcons = {
  5: {
    icon: <SentimentVeryDissatisfiedIcon color="error" sx={{ width: 16 }}/>,
    label: 'Very Dissatisfied',
  },
  4: {
    icon: <SentimentDissatisfiedIcon color="error" sx={{ width: 16 }}/>,
    label: 'Dissatisfied',
  },
  3: {
    icon: <SentimentSatisfiedIcon color="warning" sx={{ width: 16 }}/>,
    label: 'Neutral',
  },
  2: {
    icon: <SentimentSatisfiedAltIcon color="success" sx={{ width: 16 }}/>,
    label: 'Satisfied',
  },
  1: {
    icon: <SentimentVerySatisfiedIcon color="success" sx={{ width: 16 }}/>,
    label: 'Very Satisfied',
  },
};

function IconContainer(props) {
    const { value, ...other } = props;
    return <span {...other}>{customIcons[value].icon}</span>;
}

const GameLvl = ({id, go}) => {
    const dispatch = useDispatch()
    const user = useSelector(state => state.user.user)
    const [body, setBody] = useState(<Spinner size='medium' style={{ margin: 'auto auto' }}/>)
    const [snackbar, setSnackbar] = useState(null)

    useEffect(() => {
        const start = async () => {
            request('get_games', "POST", {
                url: document.location.search
            }).then(data => {
                let items = []

                data.progress[user.active_lvl].map(item => {
                    items.push(
                    <div data-to='start' key={item.id} className='game-item' style={{ background: item.img ? 'rgba(240, 248, 255, 0.907)' : null}} onClick={() => {
                        dispatch({type: 'SET_USER', data: {...user, active_game: item.id, games: data.progress}})
                        go({currentTarget: { dataset: { to: 'start' }}})
                    }}>
                        <img src={`/img/${item.img ? item.img : item.id}.png`}/>
                        <StyledRating
                          name="highlight-selected-only"
                          defaultValue={item.stars / 2}
                          IconContainerComponent={IconContainer}
                          highlightSelectedOnly
                          readOnly
                        />
                    </div>
                    )
                })

                setBody(items)
            }).catch(e => {
                setSnackbar(<SnackbarItem setSnackbar={setSnackbar} code='error' text={e.message || 'Ошибка сервера'}/>)
            })
        }

        start()
    }, [user])


    return <Panel id={id}>
        <PanelHeader left={
            <PanelHeaderButton data-to='game' onClick={go}>
                <Icon28ChevronLeft />
            </PanelHeaderButton>
        }>Уровень {user.active_lvl + 1}</PanelHeader>
             <div className='main'>
              <div className='game-item-body'>{body}</div>
              {snackbar}
             </div>
    </Panel>
}

export default GameLvl