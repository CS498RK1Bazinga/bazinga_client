var divs = document.getElementsByClassName('alert');
for(var i=0; i<divs.length; i++) {
  divs[i].addEventListener("click", highlightThis);
  /*
  divs[i].addEventListener("click", highlightThis, true);
  divs[i].addEventListener("click", highlightThis, false);*/
}

function highlightThis(event) {
    //event.stopPropagation();

    var backgroundColor = this.style.backgroundColor;
    this.style.backgroundColor='yellow';
    alert(this.className);
    this.style.backgroundColor=backgroundColor;
}

function dateFormat (format) {
  var tempStr = new Date(format.toString()).toLocaleDateString();
  // .toString().split(" ");
  // console.log(tempStr);
  format = tempStr;
  // tempStr[1]+ " " + tempStr[2] + ", " + tempStr[3];
  return format;
};


function timeFormat (format) {
  var tempStr = new Date(format.toString());
  // .toString().split(" ");
  // console.log(tempStr);

  var apm = 'am';
  var hour = tempStr.getHours();
  var min = tempStr.getMinutes();
  var precH = '';
  var precM = '';


  if(hour >= 12){
     apm = 'pm';
  }

  if(hour === 0){
     hour = 12;
  }

  if(hour <10){
    precH = '0';
  }

  if(min < 10){
    precM = '0';
  }

  format = precH+hour+":"+precM+min+" "+apm;
  return format;
};

