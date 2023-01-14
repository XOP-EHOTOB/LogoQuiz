import { useSelector } from 'react-redux'
import bridge from '@vkontakte/vk-bridge'

const vibration = (type, style) => {
    const user = useSelector(state => state.user.user)

    if (user.vibration) {
        if (!style) {
            bridge.send("VKWebAppTapticNotificationOccurred", { type });
        }

        if (style === 1) {
            bridge.send("VKWebAppTapticImpactOccurred", {"style": type});
        }

        if (!style && !type) {
           bridge.send("VKWebAppTapticSelectionChanged", {});
        }
    }
    return true
}

export default vibration