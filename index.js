const html = `
<div style="background-color: yellow; font-size: 14px" id="first-div">
Hello, friends
    <p class="para" style="font-faimly: monospace; font-size: 11px">
        Lorem ipsum dolor sit
        <a href="https://google.com">
            <strong>I am strong!</strong>
        </a>
    </p>
    <footer style="width: auto; height: 100px; color: blue">
        <span>
            This is the end
        </span>
    </footer>
</div>
`;


const htmlToArray = html.replace(/[\t\n\r]/gm,'').split('<').map(r => r.trim()).filter(r => r.length);
let finalArray = [];

 // console.log(htmlToArray);


const extractOptionsAndTexts = (str) => {

    const res = {
        options: [],
        textFound: str
    }

    let leftStr = str;

    while(leftStr.includes('="')) {
        let strToArray = leftStr.split('="');
        let firstEl = strToArray[0];
        leftStr = strToArray.slice(1).join('="');
        strToArray = leftStr.split('"');

        res.options.push({
            name: firstEl,
            value: strToArray[0]
        });
        
        leftStr = strToArray.slice(1).join('"');

        // console.log('left:', leftStr);

    }

    res.textFound = leftStr.replace(/[^a-zA-Z0-9 ]/g, "").trim();

//console.log('res', res);

    return res;
}

const extractTagInfo = (str) => {
    let strToArray = str.split(' ');
    const resp = {
        isOpenTag: false,
        tagName: '',
        options: [],
        textFound: ''
    }

    const firstEl = strToArray[0];
    const restString = strToArray.slice(1).join(' ');

    const optionsAndTexts = extractOptionsAndTexts(restString);
    resp.options = optionsAndTexts.options;
    resp.textFound = optionsAndTexts.textFound;

    resp.tagName = firstEl.replace(/[^a-z]/g, "");
    if(firstEl.match(/^[a-z]/)) {
        resp.isOpenTag = true;
    }


    return resp;
};



for(let i = 0; i < htmlToArray.length; i++) {
    let tagData = extractTagInfo(htmlToArray[i]);
    finalArray.push(tagData);
}


// generate final json data
const finalObj = {
    children: []
};

let parentObj = finalObj;
let objectsArr = [finalObj];

let depth = 0;


finalArray.forEach((e, index) => {
    if(e.isOpenTag) {
        depth++; 
        
        if(parentObj.children === undefined) {
            parentObj.children = [];
        }

    
    let curObj = {};
    curObj.tag = e.tagName;
    e.options.forEach((opt) => {
        curObj[opt.name] = opt.value;
    });
    curObj.text = e.textFound;
    objectsArr.push(curObj);
    parentObj.children.push(curObj);
    parentObj = curObj;
    } else {
        depth--;
        parentObj = objectsArr[depth];
    }
})

console.log(JSON.stringify(finalObj));
