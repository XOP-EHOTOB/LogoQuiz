import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Icon20LightbulbCircleFillYellow } from '@vkontakte/icons';
import { Icon20FavoriteCircleFillYellow } from '@vkontakte/icons';

const UserData = () => {
    const user = useSelector(state => state.user.user)

    useEffect(() => {
        console.log(user);
    }, [user])


    return <div className='top-data'>
        <div className='favorite-item'>
            <p>{user?.progress?.length || 0}</p>
            <Icon20FavoriteCircleFillYellow />
        </div>
        <div className='bulb-item'>
            <p>{user?.science || 0}</p>
            <Icon20LightbulbCircleFillYellow />
        </div>
    </div>
}

export default UserData