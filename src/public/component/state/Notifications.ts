

let _notifications: string[] = [];

export function postNotification(string: string) {
    _notifications.push(string);
    return;
}