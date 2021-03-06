let rowNumberSection =document.querySelector(".row-number-section");
let formulaBarSelectedCellArea = document.querySelector(".selected-cell-div");
let lastCell;
let columnTagSection=document.querySelector(".col-tag-section");
let cellSection = document.querySelector(".cell-section");

//for scrolling the fixed row numbers and column numbers
cellSection.addEventListener("scroll",function(e){
  rowNumberSection.style.transform = `translateY(-${e.currentTarget.scrollTop}px)`;

  columnTagSection.style.transform = `translateX(-${e.currentTarget.scrollLeft}px)`;
});

//super object
let dataObj={};

for(let i=1;i<=100;i++){
    let div=document.createElement("div");
    div.innerText=i;
    div.classList.add("row-number");
    rowNumberSection.append(div);
}

for(let i=0;i<26;i++){
    let ASCIIcode=65+i;
    let reqAlphabet=String.fromCharCode(ASCIIcode);
    let div=document.createElement("div");
    div.innerText=reqAlphabet;
    div.classList.add("column-number");
    columnTagSection.append(div);
}


for (let i = 1; i <= 100; i++) {
  let rowDiv = document.createElement("div");
  rowDiv.classList.add("row");
  //i = 1 [A1,B1..........Z1]
  //i = 2 []
  //.
  //.
  //i = 100 [A100.........z100]

  for (let j = 0; j < 26; j++) {
    //i = 100   j = 25  asciiCode = 65+25=90  alpha = z  cellAdd = Z100
    // A to Z
    let asciiCode = 65 + j;

    let reqAlphabet = String.fromCharCode(asciiCode);

    let cellAddress = reqAlphabet + i;

    dataObj[cellAddress]={
      value:undefined,
      formula:undefined,
      upstream:[],
      downstream:[]
    };

    let cellDiv = document.createElement("div");

    cellDiv.addEventListener("input",function(e){
      //jis cell pr type krna usk attritube se maine uska cell address fetch kra
      let currCellAddress=e.currentTarget("data-Address")
      //kiki saare cell oject data obj me store ho rakhe hain usin their cell address a key
      //main jis cell pr click krk type krna uska hi address fetch and uska hi object 
      //to wo address as a key use krk dataobj se fetch krlia req cell obj
      let currCellobj=dataObj[currCellAddress]

      currCellobj.value=e.currentTarget.innerText;
      
      currCellobj.formula=undefined;

      //loop on upstream
      //for each case cell go to its downstream and remove urself
      //apni upstream ko empty array kr do 

      let currUpstream= currCellobj.upstream;
      for(let k=0;k<currUpstream.length;k++){
        removeFromDownstream(currUpstream[k],currCellAddress); //parent, child
      }
      currCellobj.upstream=[];

      let currDownstream=currCellobj.downstream;
      for(let i=0;i<currDownstream.length;i++){
        updateCell(currDownstream[i])
      }
      dataObj[currCellAddress]=currCellobj;
    });

    // cellDiv.contentEditable = true

    cellDiv.setAttribute("contentEditable", true);

    cellDiv.classList.add("cell");

    cellDiv.setAttribute("data-address", cellAddress);

    cellDiv.addEventListener("click", function (e) {
      if (lastCell) {
        lastCell.classList.remove("cell-selected");
      }

      e.currentTarget.classList.add("cell-selected");

      lastCell = e.currentTarget;



      let currCellAddress = e.currentTarget.getAttribute("data-address")

      formulaBarSelectedCellArea.innerText = currCellAddress


    });

    rowDiv.append(cellDiv);
  }

  cellSection.append(rowDiv);
}

//is function ko kisi ki upstream se mtlb nhi hai 
//iska bas itna sa kaam hai ki parent do chikd do, or m parent ki downstream se child ko hta dungi taki unk beech 
//ka connection khatam ho jaye, taki agr parent ki value update ho connection khatam hone k baad child update na ho
function removeFromDownstream(parentCell, childCell){
  //1, fetch parentCell's downstream
  let parentCellDownstream=dataObj[parentCell].downstream;

  //2. filter kro childcell ko parent cell ki upstream se 
  let filterDownstream=[];
  for(let i=0;i<parentCellDownstream.length;i++){
    if(parentCellDownstream[i]!=childCell){
         filterDownstream.push(parentCellDownstream[i]);
    }
  }
  dataObj[parentCell].downstream=filterDownstream;
}

function updateCell(cell){
  let cellObj=dataObj[cell]
  let upstream= cellObj.upstream;
  let formula=cellObj.formula;
   
  //upstream me jo bi cells hain unk oject me jana vahan se unki value lekr aana, wo saari values ek object me key
  //value pair k form me store karana when key being the

  let valObj={};
  for(let i=0;i<upstream.length;i++){
    let cellValue=dataObj[upstream[i]].vslue
    valObj[upstream[i]]=cellValue;
  }
  for(let key in valObj){
    formula=formula.replace(key,valObj[key])
  }
  let newValue=eval(formula);
  dataObj[cell].value=newValue
  let downstream=cellObj.downstream;
  for(let i=0;i<downstream.length;i++){
    updateCell(downstream[i]);
  }
}