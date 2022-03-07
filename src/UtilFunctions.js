export function UNIXToDate(timestamp) {
    let formattedTime = new Date(timestamp);
    let month = formattedTime.getMonth()
    let day = formattedTime.getDate()
    let formattedMonth = (month < 10) ? '0'+month : month;
    let formattedDay = (day < 10) ? '0'+day : day;
    return(formattedTime.getFullYear() + "-" + formattedMonth + "-" + formattedDay)
}