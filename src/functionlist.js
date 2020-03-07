import Motor from '../library/motor';

//初始化
export async function initialize(viewer) {
    await viewer.initialize();
    await viewer.projectListFetchReadyPromise;
}

//获取工程列表，返回的数据展示在右侧工程列表框
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
        if (array && array.length > 0) {
            for (let i = 0; i < array.length; ++i) {
                ret.push(array[i]);
            }
        }
    }
    return ret;
}

//右侧下拉框切换工程
export async function switchProj(oldId, newId) {
    let oldproj = viewer.queryProject(oldId);
    if(oldproj && oldproj.isOpen) await oleproj.close();
    let newproj = viewer.queryProject(newId);
    if(newproj) await newproj.open();
}

//左侧楼栋接口
export function getModelInfoFromProject(project) {
    return project.projectList;
}

//楼层列表
export function getFloors(project) {
    return project.getFloors();
}

//大类列表 model: 楼栋
export async function getDalei(project, floor, model) {

}

//小类列表
export async function getXiaolei(project, floor, dalei, model) {

}

//构件名称列表
export async function getCompName(project, floor, dalei, xiaolei, model) {

}

//查询
export async function query(project, floor, dalei, xiaolei, compName, model) {

}

//编码
export function code(comps, pre) {

} 

