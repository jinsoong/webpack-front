export const BASE_URL = 'http://localhost:8080/api/v1' //로컬

export const postData = async (url, data) => {
    let options
    if (data) {
        options = {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.authToken,
                "Content-Type": 'application/json',
            },
            body: JSON.stringify(data)
        }
    }
    else {
        options = {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.authToken,
                "Content-Type": 'application/json',
            },
        }
    }
    const res = await fetch(`${BASE_URL}/${url}`, options)
    const resData = await res.json()
    return resData
}
export const postMutiPart = async (url, data, type) => {
    let options
    if (data) {
        options = {
            method: "POST",
            headers: {
                "Authorization": "Bearer " + localStorage.authToken,
            },
            body: data
        }
    }
    const res = await fetch(`${BASE_URL}/${url}`, options)
    const resData = await res.json()
    return resData
}
export const putData = async (url, data) => {
    let options
    if (data) {
        options = {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.authToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }
    }
    const res = await fetch(`${BASE_URL}/${url}`, options)
    const resData = await res.json()
    return resData
}

export const getData = async (url) => {
    const res = await fetch(`${BASE_URL}/${url}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.authToken,
            "Content-Type": "application/json",
        }
    })
    if (res != null) {
        const data = await res.json()
        return data.data
    }
}

export const deleteData = async (url, data) => {
    let options
    if (data) {
        options = {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.authToken,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data)
        }
    }
    else {
        options = {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.authToken,
                "Content-Type": "application/json",
            },
        }
    }
    const res = await fetch(`${BASE_URL}/${url}`, options)
    const resData = await res.json()
    return resData
}

// 파일 다운로드용 함수 (blob 반환)
export const downloadFile = async (url, fileName) => {
    const res = await fetch(`${BASE_URL}/${url}`, {
        method: "GET",
        headers: {
            "Authorization": "Bearer " + localStorage.authToken,
        }
    })
    if (!res.ok) {
        throw new Error(`Download failed: ${res.status}`)
    }
    const blob = await res.blob()
    // 파일 다운로드 처리
    if (typeof saveAs === "function") {
        saveAs(blob, fileName)
    } else {
        const blobUrl = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.href = blobUrl
        link.download = fileName
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(blobUrl)
    }
    return true
}
