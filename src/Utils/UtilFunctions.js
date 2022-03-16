
export function UNIXToDate(timestamp) {
    let formattedTime = new Date(timestamp);
    let month = formattedTime.getMonth()
    let day = formattedTime.getDate()
    let formattedMonth = (month < 10) ? '0'+month : month;
    let formattedDay = (day < 10) ? '0'+day : day;
    return(formattedTime.getFullYear() + "-" + formattedMonth + "-" + formattedDay)
}

export function calculateBlockTimes(timestamp) {
    let timeDifference = (Date.now() / 1000) - timestamp;
    if(timeDifference < 60){
        return timeDifference + " seconds ago"
    }
    else if(timeDifference < 3600){
        return (timeDifference / 60) + " minutes ago"
    }
    else if(timeDifference < 86400) {
        return (timeDifference / 3600) + " hours ago"
    }
    else {
        return Math.floor(timeDifference / 86400) + " days ago"
    }
}

export function downloadUrlAsFile(URL, file) {
    let downloadLink = document.createElement("a");
    downloadLink.href = URL;
    downloadLink.download = file;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}
