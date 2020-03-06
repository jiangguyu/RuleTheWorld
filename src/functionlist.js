import Motor from '../library/motor';

export async function initialize(viewer) {
    await viewer.initialize();
    await viewer.projectListFetchReadyPromise;
}

export async function getProjIdList(viewer) {
    let ret = [];
    let result = await fetch(Motor.Config.serverUrl + '/motor/v1.0/service/bp/project/list?type=BIM', {
        method: 'GET',
        headers: {
            'content-type': 'application/json',
            'access_token': viewer.options.access_token
        }
    });
    let jsonData = await result.json();
    if (jsonData['code'] === 200) {
        let array = jsonData['data'];
        if(array && array.length > 0) {
            for(let i = 0; i < array.length; ++i) {
                ret.push(array[i].id);
            }
        }
    }
    return ret;
}