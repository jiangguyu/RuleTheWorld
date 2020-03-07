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
export async function switchProj(oldproj, newproj) {
    console.log(oldproj, newproj)
    if (oldproj && oldproj.isOpened) {
        try {
            console.log("close");
            await oldproj.clearIsolation();
            await oldproj.close();
        } catch (e) {
            oldproj._isOpened = false;
        }
    }
    if (newproj) {
        await newproj.open();
    }
}

//左侧楼栋接口
export function getModelInfoFromProject(project) {
    return project._projectList;
}

//楼层列表
export function getFloors(project, model) {
    if (model) return model._floors();
    return project.getFloors();
}

//专业列表 取值proj._major
export function getZhuangye(project, model) {
    if (model) return [model._major];
    let ret = [];
    for (let i = 0; i < project._projectList.length; ++i) {
        if (ret.indexOf(project._projectList[i]._major) === -1) {
            ret.push(project._projectList[i]._major);
        }
    }
    return ret;
}

//大类列表 model: 楼栋
//opion: {floor, major, main_type, sub_type, name}
// floor	String	<optional>
// 楼层

// major	BIMMajor	<optional>
// 专业

// main_type	String	<optional>
// 大类

// sub_type	String	<optional>
// 小类

// name	String	<optional>
// 属性名称

export async function getDalei(project, opion, model) {
    let comps = await project.queryComponents(opion);
    if (comps.length === undefined) return [];
    let ret = [];
    let data = [];
    if (model) {
        for (let i = 0; i < comps.length; ++i) {
            let comp = comps[i];
            if (comp.project.guid === model.guid) data.push(comp);
        }
    }
    else data = comps;
    for (let i = 0; i < data.length; ++i) {
        let comp = data[i];
        if (ret.indexOf(comp.infos.main_type) === -1) {
            ret.push(comp.infos.main_type);
        }
    }
    return ret;
}

//小类列表
export async function getXiaolei(project, opion, model) {
    let comps = await project.queryComponents(opion);
    if (comps.length === undefined) return [];
    let ret = [];
    let data = [];
    if (model) {
        for (let i = 0; i < comps.length; ++i) {
            let comp = comps[i];
            if (comp.project.guid === model.guid) data.push(comp);
        }
    }
    else data = comps;
    for (let i = 0; i < data.length; ++i) {
        let comp = data[i];
        if (ret.indexOf(comp.infos.sub_type) === -1) {
            ret.push(comp.infos.sub_type);
        }
    }
    return ret;
}

//构件名称列表
export async function getCompName(project, opion, model) {
    let comps = await project.queryComponents(opion);
    if (comps.length === undefined) return [];
    let ret = [];
    let data = [];
    if (model) {
        for (let i = 0; i < comps.length; ++i) {
            let comp = comps[i];
            if (comp.project.guid === model.guid) data.push(comp);
        }
    }
    else data = comps;
    for (let i = 0; i < data.length; ++i) {
        let comp = data[i];
        if (ret.indexOf(comp.infos.name) === -1) {
            ret.push(comp.infos.name);
        }
    }
    return ret;
}

//查询 返回构件对象列表
export async function query(project, opion, model) {
    await project.clearIsolation();
    let data = await queryComp(project, opion, model);
    await project.isolateComponents(data);
    return data;
}

//编码
export function code(comps, pre) {
    let data = comps.sort(compare);
    let arry = [];
    for (let i = 0; i < data.length; ++i) {
        let code_ = pre + '_' + String(i);
        let cur = data[i];
        arry.push({ code: code_, comp: cur });
    }
    return arry;
}

export async function codeEx(project, opion, model, pre) {
    let comps = await queryComp(project, opion, model);
    let data = comps.sort(compare);
    let arry = [];
    for (let i = 0; i < data.length; ++i) {
        let code_ = pre + '_' + String(i);
        let cur = data[i];
        arry.push({ code: code_, comp: cur });
    }
    return arry;
}

async function queryComp(project, opion, model) {
    let comps = await project.queryComponents(opion);
    if (comps.length === undefined) return [];
    let data = [];
    if (model) {
        for (let i = 0; i < comps.length; ++i) {
            let comp = comps[i];
            if (comp.project.guid === model.guid) data.push(comp);
        }
    }
    else data = comps;
    return data
}

function compare(_in1, _in2) {
    let coord_1 = analysisCoord(_in1.infos.extent);
    let coord_2 = analysisCoord(_in2.infos.extent);
    if (coord_1[3] == coord_2[3]) return coord_2[4] - coord_1[4];
    else return coord_1[3] - coord_2[3];
}

function analysisCoord(coord) {
    let str = coord.slice(1, coord.length - 1);
    let arry = str.split(",");
    let ret = [];
    for (let i = 0; i < arry.length; ++i) {
        let cur = parseFloat(arry[i]);
        ret.push(cur);
    }
    return ret;
}
