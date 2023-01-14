import { Snackbar, Avatar } from "@vkontakte/vkui"
import { Icon16Done } from '@vkontakte/icons';
import { Icon20ErrorCircleOutline } from '@vkontakte/icons';
import { Icon20WarningTriangleOutline } from '@vkontakte/icons';
import vibration from "./vibration";

const SnackbarItem = ({code, text, setSnackbar}) => {

    if (code === 'error') {
        vibration('error')
        return (
            <Snackbar
                onClose={() => setSnackbar(null)}
                before={
                    <Avatar
                        size={24}
                        style={{ background: "var(--negative-color)" }}
                    >
                        <Icon20ErrorCircleOutline fill="#fff" width={14} height={14} />
                    </Avatar>
                }>{text} </Snackbar>
        )

    } else if (code === 'warn') {
        vibration('warning')
        return (
            <Snackbar
                onClose={() => setSnackbar(null)}
                before={
                    <Avatar
                        size={24}
                        style={{ background: "var(--warn-color" }}
                    >
                    <Icon20WarningTriangleOutline fill="#fff" width={14} height={14} />
                </Avatar>
            }>{text} </Snackbar>)
    } else {
        vibration('success')
        return(
            <Snackbar
                onClose={() => setSnackbar(null)}
                before={
                    <Avatar
                        size={24}
                        style={{ background: "var(--positive-color)" }}
                    >
                        <Icon16Done fill="#fff" width={14} height={14} />
                    </Avatar>
                }>{text} </Snackbar>)
    }
}


export default SnackbarItem